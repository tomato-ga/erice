import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { DMMItem } from '@/types/dmmtypes'

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

	// 次の0時までの秒数を計算する関数
	const getSecondsUntilMidnight = () => {
		const now = new Date()
		const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
		return Math.floor((tomorrow.getTime() - now.getTime()) / 1000)
	}

	try {
		// console.log(`Fetching data from ${WORKER_URL}`)
		const response = await fetch(`${WORKER_URL}/today-new-items`, {
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
			content_id: item.content_id,
			title: item.title,
			affiliateURL: item.affiliateURL,
			imageURL: item.imageURL?.large ? item.imageURL?.large : item.imageURL?.small,
			sampleImageURL: item.sampleImageURL?.sample_l?.image ?? item.sampleImageURL?.sample_s?.image ?? null,
			actress: item.iteminfo?.actress ? item.iteminfo?.actress?.[0]?.name : null,
			actress_id: item.iteminfo?.actress?.[0]?.id || null,
			genre: item.iteminfo?.genre ? item.iteminfo?.genre.map((genre) => genre.name) : null,
			price: item.prices?.price,
			date: item.date,
			maker: item.iteminfo?.maker ? item.iteminfo?.maker[0]?.name : null,
			label: item.iteminfo?.label ? item.iteminfo?.label[0]?.name : null,
			series: item.iteminfo?.series ? item.iteminfo?.series[0]?.name : null,
			director: item.iteminfo?.director ? item.iteminfo?.director[0]?.name : null,
			db_id: item.db_id
		}))

		// データ処理後、キャッシュタグを再検証
		// revalidateTag('dmm-todaynew')

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
