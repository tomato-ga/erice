import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
	const API_KEY = process.env.D1_API_KEY
	const WORKER_URL = process.env.FAVORITE_WORKER_URL

	if (!API_KEY || !WORKER_URL) {
		console.error('必要な環境変数が設定されていません')
		return NextResponse.json({ error: 'サーバー設定エラー' }, { status: 500 })
	}

	try {
		const body = await request.json()
		console.log('API: 受信したデータ:', JSON.stringify(body, null, 2))

		if (!body.articleId || !['add', 'remove'].includes(body.action)) {
			return NextResponse.json({ error: '無効なデータ形式です' }, { status: 400 })
		}

		const response = await fetch(WORKER_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-API-Key': API_KEY
			},
			body: JSON.stringify(body)
		})

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
			console.error('Worker API error:', response.status, errorData)
			return NextResponse.json(
				{ error: 'お気に入りの更新に失敗しました', details: errorData.error },
				{ status: response.status }
			)
		}

		const data = await response.json()
		return NextResponse.json(data)
	} catch (error) {
		console.error('Error updating favorite:', error)
		return NextResponse.json(
			{ error: 'お気に入りの更新に失敗しました', details: error instanceof Error ? error.message : String(error) },
			{ status: 500 }
		)
	}
}
