// src/app/api/r18-latestpost/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { antennaPostApiResponseSchema } from '@/types/antennaschema'

export async function GET(request: NextRequest): Promise<NextResponse> {
	const API_KEY = process.env.CLOUDFLARE_R18_API_TOKEN
	const WORKER_URL = process.env.R18_LATEST_POSTS_GET_WORKER_URL
	console.log('API_KEY:', API_KEY)
	console.log('WORKER_URL:', WORKER_URL)

	if (!API_KEY || !WORKER_URL) {
		console.error('必要な環境変数が設定されていません')
		return NextResponse.json({ error: '必要な環境変数が設定されていません' }, { status: 500 })
	}

	try {
		const response = await fetch(`${WORKER_URL}`, {
			headers: {
				'Content-Type': 'application/json',
				'X-API-Key': API_KEY
			},
			cache: 'no-store'
		})

		if (!response.ok) {
			console.error(`Cloudflare Worker APIエラー: ${response.status} ${response.statusText}`)
			throw new Error(`Cloudflare Workerからのデータ取得に失敗しました: ${response.status}`)
		}

		const rawData = await response.json()
		console.log('Raw API response:', rawData) // デバッグ用ログ

		const validatedData = antennaPostApiResponseSchema.parse(rawData)
		console.log('Validated API response:', validatedData) // デバッグ用ログ

		return NextResponse.json(validatedData)
	} catch (error) {
		console.error('APIルートでエラーが発生しました:', error)
		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: 'データの形式が不正です', details: error.errors }, { status: 400 })
		}
		return NextResponse.json({ error: 'サーバー内部エラー', details: (error as Error).message }, { status: 500 })
	}
}
