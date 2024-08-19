import { DMMActressProfile, DMMActressProfileSchema } from '@/types/APItypes'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// 型ガード関数
function isValidApiResponse(data: unknown): data is DMMActressProfile {
	return typeof data === 'object' && data !== null && 'actress' in data && typeof (data as any).actress === 'object'
}

// APIエンドポイント
export async function GET(request: NextRequest): Promise<NextResponse> {
	const { searchParams } = new URL(request.url)
	const actressname = searchParams.get('actressname')

	if (!actressname) {
		return NextResponse.json({ error: 'actressnameパラメータが必要です' }, { status: 400 })
	}

	const API_KEY = process.env.CLOUDFLARE_DMM_API_TOKEN
	const WORKER_URL = process.env.DMM_ACTRESS_PROFILE_WORKER_URL

	if (!API_KEY) {
		console.error('CLOUDFLARE_DMM_API_TOKENが設定されていません')
		return NextResponse.json({ error: 'CLOUDFLARE_DMM_API_TOKENが環境変数に設定されていません' }, { status: 500 })
	}

	if (!WORKER_URL) {
		console.error('DMM_ACTRESS_DETAIL_WORKER_URLが設定されていません')
		return NextResponse.json({ error: 'DMM_ACTRESS_DETAIL_WORKER_URLが環境変数に設定されていません' }, { status: 500 })
	}

	const encodedActressName = encodeURIComponent(actressname)

	try {
		const response = await fetch(`${WORKER_URL}/${encodedActressName}`, {
			headers: {
				'Content-Type': 'application/json',
				'X-API-Key': API_KEY
			},
			next: { revalidate: 2592000 } // 30日間キャッシュ
		})

		if (response.status === 404) {
			console.log(`女優が見つかりません: ${actressname}`)
			return NextResponse.json({ error: '女優が見つかりません' }, { status: 404 })
		}

		if (!response.ok) {
			console.error(`Cloudflare Worker APIエラー: ${response.status} ${response.statusText}`)
			throw new Error(`Cloudflare Workerからのデータ取得に失敗しました: ${response.status}`)
		}

		const data = await response.json()

		console.log('dmm-actress-profile data: ', data)

		if (!isValidApiResponse(data)) {
			throw new Error('不正なレスポンス形式')
		}

		const validatedData = DMMActressProfileSchema.parse(data)
		console.log('dmm-actress-profile validatedData', validatedData)

		return NextResponse.json(validatedData)
	} catch (error) {
		console.error('APIルートでエラーが発生しました:', error)
		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: 'データの形式が不正です', details: error.errors }, { status: 500 })
		}
		return NextResponse.json({ error: 'サーバー内部エラー', details: (error as Error).message }, { status: 500 })
	}
}
