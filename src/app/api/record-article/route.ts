import { NextRequest, NextResponse } from 'next/server'

const API_ENDPOINT = process.env.USER_ACTION_WORKER_URL
const API_KEY = process.env.D1_API_KEY

export async function POST(request: NextRequest) {
	if (!API_ENDPOINT || !API_KEY) {
		return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
	}

	try {
		const { userId, data } = await request.json()

		if (!userId || !data) {
			return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
		}

		const response = await fetch(API_ENDPOINT, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-API-Key': API_KEY
			},
			body: JSON.stringify({ userId, data })
		})

		if (!response.ok) {
			throw new Error('Failed to record article view in worker')
		}

		return NextResponse.json({ status: 'OK' })
	} catch (error) {
		console.error('Error recording article view:', error)
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
	}
}
