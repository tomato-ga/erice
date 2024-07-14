import { NextRequest, NextResponse } from 'next/server'

const API_ENDPOINT = process.env.USER_ACTION_WORKER_URL
const API_KEY = process.env.D1_API_KEY

if (!API_ENDPOINT || !API_KEY) {
	console.error('Missing required environment variables: USER_ACTION_WORKER_URL or D1_API_KEY')
}

export async function POST(request: NextRequest) {
	if (!API_ENDPOINT || !API_KEY) {
		console.error('Missing required environment variables')
		return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
	}

	try {
		const { userId, type, data } = await request.json()

		if (!userId || !type || !data) {
			console.error('Missing required fields in request:', { userId, type, data })
			return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
		}

		console.log(`Attempting to record action for user ${userId}, type: ${type}`)
		console.log('API_ENDPOINT:', API_ENDPOINT)
		console.log('API_KEY (first 4 chars):', API_KEY.substring(0, 4))

		const headers: HeadersInit = {
			'Content-Type': 'application/json',
			'X-API-Key': API_KEY
		}

		const response = await fetch(API_ENDPOINT, {
			method: 'POST',
			headers: headers,
			body: JSON.stringify({ userId, type, data })
		})

		console.log('Worker response status:', response.status)
		const responseText = await response.text()
		console.log('Worker response text:', responseText)

		if (!response.ok) {
			console.error(`Failed to record action: ${response.status} ${response.statusText}`, responseText)
			return NextResponse.json(
				{ error: `Failed to record action: ${response.statusText}`, details: responseText },
				{ status: response.status }
			)
		}

		let result
		try {
			result = JSON.parse(responseText)
		} catch (error) {
			console.error('Failed to parse response as JSON:', responseText)
			return NextResponse.json({ error: 'Invalid response from server', details: responseText }, { status: 500 })
		}

		console.log('Action recorded successfully:', result)
		return NextResponse.json(result)
	} catch (error: unknown) {
		console.error('Error recording user action:', error)
		let errorMessage = 'An unknown error occurred'
		if (error instanceof Error) {
			errorMessage = error.message
		} else if (typeof error === 'string') {
			errorMessage = error
		}
		return NextResponse.json({ error: 'Internal Server Error', message: errorMessage }, { status: 500 })
	}
}
