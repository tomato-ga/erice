import { ActressStatsSchema } from '@/_types_dmm/statstype'
import { unstable_cache } from 'next/cache'
import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

// GETリクエストを処理するAPIハンドラー
export async function GET(request: NextRequest) {
	const actress_id = request.nextUrl.searchParams.get('actress_id')

	// Cloudflare WorkersのAPIエンドポイントとAPIキー
	const WORKER_URL = process.env.DMM_ACTRESS_STATS_WORKER_URL // Cloudflare Workers APIのエンドポイントを指定
	const API_KEY = process.env.CLOUDFLARE_DMM_API_TOKEN // 環境変数からAPIキーを取得

	if (!API_KEY) {
		console.error('CLOUDFLARE_DMM_API_TOKENが設定されていません')
		return NextResponse.json(
			{ error: 'CLOUDFLARE_DMM_API_TOKENが環境変数に設定されていません' },
			{ status: 500 },
		)
	}

	if (!WORKER_URL) {
		console.error('DMM_ACTRESS_DETAIL_WORKER_URLが設定されていません')
		return NextResponse.json(
			{ error: 'DMM_ACTRESS_DETAIL_WORKER_URLが環境変数に設定されていません' },
			{ status: 500 },
		)
	}

	try {
		// Define a fetch callback for caching
		const fetchCallback = async () => {
			const response = await fetch(`${WORKER_URL}?actress_id=${actress_id}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'x-api-key': API_KEY || '',
				},
				next: {
					tags: [`actress-stats-${actress_id}`], // キャッシュのタグを設定
				},
			})

			if (!response.ok) {
				throw new Error('Failed to fetch data from Cloudflare Workers')
			}

			const data = await response.json()
			const result = ActressStatsSchema.safeParse(data)

			if (!result.success) {
				throw new Error('Invalid data format from Cloudflare Workers')
			}

			return result.data
		}

		// Use unstable_cache with the fetch callback
		const cachedFetch = unstable_cache(
			fetchCallback,
			[`actress-stats-${actress_id}`], // キャッシュキー
			{
				tags: [`actress-stats-${actress_id}`], // revalidation tags
				revalidate: 3600, // 1時間でキャッシュを自動更新
			},
		)

		const data = await cachedFetch()
		revalidateTag(`actress-stats-${actress_id}`) // 必要に応じてタグを無効化

		return NextResponse.json(data)
	} catch (error) {
		// 例外発生時のエラーレスポンス
		return NextResponse.json({ error: 'An error occurred while fetching data' }, { status: 500 })
	}
}