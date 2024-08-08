import { NextRequest, NextResponse } from 'next/server'
import { DMMItem } from '../../../../../types/dmmtypes'

interface ApiResponse {
	request: {
		parameters: {
			[key: string]: string
		}
	}
	result: {
		status: number
		result_count: number
		total_count: number
		first_position: number
		items: DMMItem[]
	}
}

/**
 * 今日の新着動画を取得するAPIエンドポイント
 * @route GET /api/dmm-todaynew-getkv
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
	const API_KEY = process.env.CLOUDFLARE_DMM_API_TOKEN
	const WORKER_URL = process.env.DMM_TOPPAGE_WORKER_URL

	if (!API_KEY) {
		console.error('CLOUDFLARE_DMM_API_TOKENが設定されていません')
		return NextResponse.json({ error: 'CLOUDFLARE_DMM_API_TOKENが環境変数に設定されていません' }, { status: 500 })
	}

	if (!WORKER_URL) {
		console.error('DMM_TOPPAGE_WORKER_URLが設定されていません')
		return NextResponse.json({ error: 'DMM_TOPPAGE_WORKER_URLが環境変数に設定されていません' }, { status: 500 })
	}

	try {
		console.log(`Fetching data from ${WORKER_URL}`)
		const response = await fetch(`${WORKER_URL}/feature-items`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'X-API-Key': API_KEY
			}
		})

		if (!response.ok) {
			console.error(`Cloudflare Worker API error: ${response.status} ${response.statusText}`)
			throw new Error(`Cloudflare Workerからのデータ取得に失敗しました: ${response.status}`)
		}

		const data: ApiResponse = await response.json()
		const processedData = data.result.items.map((item) => ({
			contend_id: item.content_id,
			title: item.title,
			affiliateURL: item.affiliateURL,
			imageURL: item.imageURL?.large ? item.imageURL?.large : item.imageURL?.small,
			actress: item.iteminfo?.actress ? item.iteminfo?.actress?.map((actress) => actress.name).join(', ') : null,
			genre: item.iteminfo?.genre ? item.iteminfo?.genre.map((genre) => genre.name) : null
		}))

		return NextResponse.json(processedData)
	} catch (error) {
		console.error('APIルートでエラーが発生しました:', error)
		if (error instanceof SyntaxError) {
			return NextResponse.json(
				{ error: 'JSONのパースに失敗しました', details: (error as Error).message },
				{ status: 500 }
			)
		} else if (error instanceof TypeError) {
			return NextResponse.json({ error: 'データ型が不正です', details: (error as Error).message }, { status: 500 })
		} else {
			return NextResponse.json({ error: 'サーバー内部エラー', details: (error as Error).message }, { status: 500 })
		}
	}
}
