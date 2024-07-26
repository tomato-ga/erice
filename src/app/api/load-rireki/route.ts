import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
	const API_KEY = process.env.D1_API_KEY
	const WORKER_URL = process.env.USER_HISTORY_WORKER_URL

	if (!API_KEY) {
		throw new Error('D1_API_KEYが環境変数に設定されていません')
	}

	if (!WORKER_URL) {
		throw new Error('USER_HISTORY_WORKER_URLが環境変数に設定されていません')
	}

	const userId = request.nextUrl.searchParams.get('userId')

	if (!userId) {
		return NextResponse.json({ error: 'ユーザーIDが指定されていません' }, { status: 400 })
	}

	try {
		console.log('API: ユーザー履歴を取得します。ユーザーID:', userId)

		// Cloudflare Workerにリクエストを転送
		const response = await fetch(`${WORKER_URL}/${userId}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'X-API-Key': API_KEY
			}
		})

		if (!response.ok) {
			throw new Error('Cloudflare Workerからのデータ取得に失敗しました')
		}

		const data = await response.json()

		return NextResponse.json(data)
	} catch (error) {
		console.error('APIルートでエラーが発生しました:', error)
		return NextResponse.json({ error: 'サーバー内部エラー' }, { status: 500 })
	}
}
