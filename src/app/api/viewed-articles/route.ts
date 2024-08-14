import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
	const API_KEY = process.env.D1_API_KEY
	const WORKER_URL = process.env.USER_ACTION_ARTICLE_WORKER_URL

	if (!API_KEY || !WORKER_URL) {
		console.error('必要な環境変数が設定されていません')
		process.exit(1)
	}

	try {
		const body = await request.json()
		console.log('API: 受信したデータ:', JSON.stringify(body, null, 2))

		// if (!body.userId || !Array.isArray(body.viewedArticles)) {
		// 	return NextResponse.json({ error: '無効なデータ形式です' }, { status: 400 })
		// }

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
				// { error: 'Failed to sync viewed articles', details: errorData.error },
				{ status: response.status }
			)
		}

		const data = await response.json()
		return NextResponse.json(data)
	} catch (error) {
		console.error('Error syncing viewed articles:', error)
		return NextResponse.json(
			{ error: 'Failed to sync viewed articles', details: error instanceof Error ? error.message : String(error) },
			{ status: 500 }
		)
	}
}
