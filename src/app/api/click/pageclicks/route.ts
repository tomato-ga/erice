import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
	const apiKey = process.env.D1_API_KEY
	const workersApiUrl = process.env.USER_ACTION_WORKER_URL

	if (!apiKey || !workersApiUrl) {
		console.error('Missing environment variables: D1_API_KEY or USER_ACTION_WORKER_URL')
		return NextResponse.json({ error: 'Internal server configuration error' }, { status: 500 })
	}

	try {
		const { userId, actions } = await request.json()
		console.log('Received userId:', userId, 'actions:', actions) // デバッグログ

		if (!userId || !actions || !Array.isArray(actions)) {
			return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
		}

		const response = await fetch(workersApiUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-API-Key': apiKey
			},
			body: JSON.stringify({ userId, actions })
		})

		console.log('Worker API response status:', response.status) // デバッグログ

		if (!response.ok) {
			const errorData = await response.json().catch(() => null)
			console.error('Worker API error:', response.status, errorData)
			return NextResponse.json(
				{ error: 'Failed to record user actions', details: errorData?.error || response.statusText },
				{ status: response.status }
			)
		}

		const result = await response.json()
		console.log('Worker API response:', result) // デバッグログ

		return NextResponse.json(result)
	} catch (error) {
		console.error('Failed to record user actions:', error)
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
	}
}
