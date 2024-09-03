import { DMMActressProfile, DMMActressProfileSchema } from '@/types/APItypes'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// 型ガード関数
function isValidApiResponse(data: unknown): data is DMMActressProfile {
	// data が object かつ null でないことを確認
	if (typeof data !== 'object' || data === null) {
		return false
	}
	// actress プロパティが存在し、object 型であることを確認
	if (!('actress' in data) || typeof data.actress !== 'object') {
		return false
	}
	// さらに、actress プロパティが object 型で、必要なプロパティを持っていることを確認
	// ... (DMMActressProfile のプロパティに応じて追加)
	return true
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

	const encodedActressName = encodeURIComponent(actressname)

	try {
		const response = await fetch(`${WORKER_URL}/actress?actressname=${encodedActressName}`, {
			headers: {
				'Content-Type': 'application/json',
				'X-API-Key': API_KEY,
			},
			cache: 'force-cache',
		})

		if (!response.ok) {
			const errorMessage = `女優情報の取得に失敗しました。ステータスコード: ${response.status} ${response.statusText}`
			console.error(errorMessage)
			return NextResponse.json({ error: errorMessage }, { status: response.status })
		}

		const data = await response.json()

		// Zodスキーマを用いてレスポンスデータの検証
		const validationResult = DMMActressProfileSchema.safeParse(data)

		if (!validationResult.success) {
			// 検証エラー時の処理
			console.warn(
				'女優情報のデータ形式が予期しないものでした:',
				JSON.stringify(validationResult.error, null, 2),
			)
			// エラーではなく、空のデータを返す
			return NextResponse.json({ actress: null })
		}

		// 検証に成功した場合は、データを返す
		return NextResponse.json(validationResult.data)
	} catch (error) {
		console.error('APIルートでエラーが発生しました:', error)
		return NextResponse.json(
			{ error: 'サーバー内部エラー', details: (error as Error).message },
			{ status: 500 },
		)
	}
}
