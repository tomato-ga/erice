// app/api/getkv-top100/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { DMMItem, ErrorResponse, GetKVTop100Response } from '../../../../types/dmm-keywordpage'

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url)
	const keywordsParam = searchParams.get('keywords')

	if (!keywordsParam) {
		const errorResponse: ErrorResponse = { error: 'Keywords parameter is required' }
		return NextResponse.json(errorResponse, { status: 400 })
	}

	// キーワードをカンマ区切りで分割し、トリムして配列にする
	const keywordsArray = keywordsParam
		.split(',')
		.map(keyword => keyword.trim())
		.filter(k => k.length > 0)

	if (keywordsArray.length === 0) {
		const errorResponse: ErrorResponse = { error: 'At least one valid keyword must be provided' }
		return NextResponse.json(errorResponse, { status: 400 })
	}

	// キーワードを '|' で結合
	const combinedKeywords = keywordsArray.join('|')

	// URL エンコード
	const encodedKeywords = encodeURIComponent(combinedKeywords)

	// Cloudflare Worker のエンドポイント
	const API_KEY = process.env.CLOUDFLARE_DMM_API_TOKEN
	const BASE_URL = process.env.DMM_TOP100_GETKV_WORKER_URL

	if (!API_KEY || !BASE_URL) {
		console.error('Cloudflare Worker の環境変数が設定されていません')
		const errorResponse: ErrorResponse = { error: 'Server configuration error' }
		return NextResponse.json(errorResponse, { status: 500 })
	}

	const workerEndpoint = `${BASE_URL}/query/${encodedKeywords}`

	try {
		const response = await fetch(workerEndpoint, {
			method: 'GET',
			headers: {
				'X-API-Key': API_KEY,
				'Content-Type': 'application/json',
			},
		})

		if (!response.ok) {
			const errorData = (await response.json().catch(() => ({}))) as ErrorResponse
			const errorMessage = errorData.message || 'Failed to fetch data from Cloudflare Worker'
			const errorResponse: ErrorResponse = { error: errorMessage }
			return NextResponse.json(errorResponse, { status: response.status })
		}

		const data: GetKVTop100Response = await response.json() // { keyword: string; items: DMMItem[]; createdAt: string }

		// デバッグログ
		// console.log('Received data from Worker:', data)

		// Workerからのレスポンス構造に合わせてレスポンスを整形
		const getKVTop100Response: GetKVTop100Response = {
			keyword: data.keyword,
			items: data.items,
			createdAt: data.createdAt, // 必要に応じて
		}

		return NextResponse.json(getKVTop100Response, { status: 200 })
	} catch (error) {
		console.error('Error fetching data from Cloudflare Worker:', error)
		const errorResponse: ErrorResponse = { error: 'Internal Server Error' }
		return NextResponse.json(errorResponse, { status: 500 })
	}
}
