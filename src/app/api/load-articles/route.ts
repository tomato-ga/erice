import { NextResponse } from 'next/server'

export async function POST(request: Request) {
	const API_KEY = process.env.D1_API_KEY
	const WORKER_URL = process.env.ARTICLE_ID_WORKER_URL

	if (!API_KEY) {
		throw new Error('D1_API_KEY is not set in the environment variables')
	}

	if (!WORKER_URL) {
		throw new Error('CLOUDFLARE_WORKER_URL is not set in the environment variables')
	}

	try {
		const { articleIds } = await request.json()
		console.log('API: 受信したデータ:', JSON.stringify({ articleIds }, null, 2))

		// データの形式を検証
		if (!Array.isArray(articleIds) || articleIds.length === 0) {
			return NextResponse.json({ error: '無効なデータ形式です' }, { status: 400 })
		}

		// Cloudflare Workerにリクエストを転送
		const response = await fetch(WORKER_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-API-Key': API_KEY
			},
			body: JSON.stringify({ articleIds })
		})

		if (!response.ok) {
			throw new Error('Failed to fetch data from Cloudflare Worker')
		}

		const data = await response.json()

		return NextResponse.json(data)
	} catch (error) {
		console.error('Error in API route:', error)
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
	}
}
