import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { DMMItem } from '../../../../../types/dmmitemzodschema'

// APIエンドポイント
export async function GET(request: NextRequest): Promise<NextResponse> {
	const content_id = request.nextUrl.searchParams.get('content_id')
	const API_KEY = process.env.CLOUDFLARE_DMM_API_TOKEN
	const WORKER_URL = process.env.DMM_GET_ONE_ITEM_WORKER_URL

	if (!API_KEY) {
		console.error('CLOUDFLARE_DMM_API_TOKENが設定されていません')
		return NextResponse.json({ error: 'CLOUDFLARE_DMM_API_TOKENが環境変数に設定されていません' }, { status: 500 })
	}

	if (!content_id) {
		console.error('content_idが指定されていません')
		return NextResponse.json({ error: 'content_id is required' }, { status: 400 })
	}

	try {
		const response = await fetch(`${WORKER_URL}/item-detail?content_id=${content_id}`, {
			headers: {
				'Content-Type': 'application/json',
				'X-API-Key': API_KEY
			},
			cache: 'force-cache'
		})

		if (!response.ok) {
			console.error(`Cloudflare Worker API error: ${response.status} ${response.statusText}`)
			throw new Error(`Cloudflare Workerからのデータ取得に失敗しました: ${response.status}`)
		}

		const data: DMMItem[] = await response.json()
		return NextResponse.json(data)
	} catch (error) {
		console.error('APIルートでエラーが発生しました:', error)
		return NextResponse.json({ error: 'サーバー内部エラー', details: (error as Error).message }, { status: 500 })
	}
}