import { NextRequest, NextResponse } from 'next/server'

const API_ENDPOINT = process.env.USER_ACTION_WORKER_URL
const API_KEY = process.env.D1_API_KEY

if (!API_ENDPOINT || !API_KEY) {
	console.error('Missing required environment variables: USER_ACTION_WORKER_URL or D1_API_KEY')
}

export async function POST(request: NextRequest) {
	const { userId, type, data } = await request.json()

	if (!userId || !type || !data) {
		console.error('Missing required fields in request:', { userId, type, data })
		return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
	}

	if (!API_ENDPOINT || !API_KEY) {
		console.error('Missing required environment variables')
		return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
	}

	console.log(`Attempting to record action for user ${userId}, type: ${type}`)

	try {
		const headers: HeadersInit = {
			'Content-Type': 'application/json',
			'X-API-Key': API_KEY
		}

		const response = await fetch(`${API_ENDPOINT}/record-action`, {
			method: 'POST',
			headers: headers,
			body: JSON.stringify({ userId, type, data })
		})

		if (!response.ok) {
			const errorText = await response.text()
			console.error(`Failed to record action: ${response.status} ${response.statusText}`, errorText)
			throw new Error(`Failed to record action: ${response.statusText}`)
		}

		const result = await response.json()
		console.log('Action recorded successfully:', result)
		return NextResponse.json(result)
	} catch (error) {
		console.error('Error recording user action:', error)
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
	}
}
