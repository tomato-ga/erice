import { ActressStatsSchema } from '@/_types_dmm/statstype'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

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
		// Cloudflare WorkersのAPIにリクエストを送信
		const response = await fetch(`${WORKER_URL}?actress_id=${actress_id}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': API_KEY || '', // APIキーをヘッダーに追加
			},
		})

		// エラーがある場合はエラーレスポンスを返す
		if (!response.ok) {
			return NextResponse.json(
				{ error: 'Failed to fetch data from Cloudflare Workers' },
				{ status: response.status },
			)
		}

		// Cloudflare WorkersからのレスポンスデータをJSONとして取得
		const data = await response.json()

		// スキーマでバリデーション
		const result = ActressStatsSchema.safeParse(data)

		if (!result.success) {
			// バリデーションエラーがあった場合
			return NextResponse.json(
				{ error: 'Invalid data format from Cloudflare Workers' },
				{ status: 400 },
			)
		}

		// 正しいデータを返す
		return NextResponse.json(result.data)
	} catch (error) {
		// 例外発生時のエラーレスポンス
		return NextResponse.json({ error: 'An error occurred while fetching data' }, { status: 500 })
	}
}
