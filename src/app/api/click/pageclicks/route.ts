import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
	console.log('API route hit: /api/click/pageclicks') // デバッグログ

	const apiKey = process.env.D1_API_KEY
	const workersApiUrl = process.env.PAGECLICK_WORKER_URL

	if (!apiKey || !workersApiUrl) {
		console.error('Missing environment variables: D1_API_KEY or PAGECLICK_WORKER_URL')
		return NextResponse.json({ error: 'Internal server configuration error' }, { status: 500 })
	}

	try {
		const { articleId } = await request.json()
		console.log('Received articleId:', articleId) // デバッグログ

		if (!articleId) {
			return NextResponse.json({ error: 'Article ID is required' }, { status: 400 })
		}

		const response = await fetch(`${workersApiUrl}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${apiKey}`
			},
			body: JSON.stringify({ articleId })
		})

		console.log('Worker API response status:', response.status) // デバッグログ

		if (!response.ok) {
			const errorData = await response.json().catch(() => null)
			console.error('Worker API error:', response.status, errorData)
			return NextResponse.json(
				{ error: 'Failed to increment page clicks', details: errorData?.error || response.statusText },
				{ status: response.status }
			)
		}

		const result = await response.json()
		console.log('Worker API response:', result) // デバッグログ

		return NextResponse.json(result)
	} catch (error) {
		console.error('Failed to increment page clicks:', error)
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
	}
}
