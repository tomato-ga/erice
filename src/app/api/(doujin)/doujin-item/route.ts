import { DoujinTopItem } from '@/_types_doujin/doujintypes'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, res: NextResponse) {
	const dbId = req.nextUrl.searchParams.get('db_id')

	if (!dbId) {
		return NextResponse.json({ error: `Invalid db_id parameter ${dbId}` }, { status: 500 })
	}

	const WORKER_URL = process.env.FANZA_DOUJIN_KOBETU_WORKER_URL
	if (!WORKER_URL) {
		return NextResponse.json({ error: 'Invalid WORKER_URL parameter' }, { status: 500 })
	}

	const API_KEY = process.env.CLOUDFLARE_DMM_API_TOKEN_DOUJIN
	if (!API_KEY) {
		return NextResponse.json({ error: 'Invalid API_URL parameter' }, { status: 500 })
	}

	try {
		const response = await fetch(`${WORKER_URL}/doujin?db_id=${dbId}`, {
			headers: {
				'Content-Type': 'application/json',
				'X-API-Key': API_KEY
			},
			cache: 'force-cache'
		})

		if (response.status === 404) {
			console.log(`Content not found for db_id: ${dbId}`)
			return NextResponse.json({ items: [] }, { status: 200 })
		}

		if (!response.ok) {
			console.error(`Cloudflare Worker API error: ${response.status} ${response.statusText}`)
			throw new Error(`Cloudflare Workerからのデータ取得に失敗しました: ${response.status}`)
		}

		const data: DoujinTopItem = await response.json()

		// Convert DoujinItem to DoujinTopItem if necessary
		console.log('doujin APIルート:', data)

		return NextResponse.json(data)
	} catch (error) {
		console.error('APIルートでエラーが発生しました:', error)
		return NextResponse.json({ error: 'サーバー内部エラー', details: (error as Error).message }, { status: 500 })
	}
}
