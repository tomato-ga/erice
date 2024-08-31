import { NextRequest, NextResponse } from 'next/server'
import { DMMActressInfo, DMMActressInfoSchema } from '@/types/APItypes'

// APIエンドポイント
export async function GET(request: NextRequest): Promise<NextResponse> {
	const db_id = request.nextUrl.searchParams.get('db_id')
	const API_KEY = process.env.CLOUDFLARE_DMM_API_TOKEN
	const WORKER_URL = process.env.DMM_GET_ACTRESSINFO_WORKER_URL

	if (!API_KEY) {
		console.error('CLOUDFLARE_DMM_API_TOKENが設定されていません')
		return NextResponse.json({ error: 'CLOUDFLARE_DMM_API_TOKENが環境変数に設定されていません' }, { status: 500 })
	}

	if (!db_id) {
		console.error('content_idが指定されていません')
		return NextResponse.json({ error: 'db_id is required' }, { status: 400 })
	}

	try {
		const response = await fetch(`${WORKER_URL}?db_id=${db_id}`, {
			headers: {
				'Content-Type': 'application/json',
				'X-API-Key': API_KEY
			},
			cache: 'force-cache'
		})

		if (response.status === 404) {
			console.log(`Content not found for db_id: ${db_id}`)
			return NextResponse.json({ items: [] }, { status: 200 })
		}

		if (!response.ok) {
			console.error(`Cloudflare Worker API error: ${response.status} ${response.statusText}`)
			throw new Error(`Cloudflare Workerからのデータ取得に失敗しました: ${response.status}`)
		}

		const data: DMMActressInfo[] = await response.json()
		const parsedData = DMMActressInfoSchema.parse(data)
		return NextResponse.json({ items: parsedData })
	} catch (error) {
		console.error('APIルートでエラーが発生しました:', error)
		return NextResponse.json({ error: 'サーバー内部エラー', details: (error as Error).message }, { status: 500 })
	}
}
