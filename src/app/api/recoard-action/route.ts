import { NextRequest, NextResponse } from 'next/server'

const API_ENDPOINT = process.env.USER_ACTION_WORKER_URL
const API_KEY = process.env.D1_API_KEY

export async function POST(request: NextRequest) {
	const { userId, type, data } = await request.json()

	if (!userId || !type || !data) {
		return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
	}

	try {
		const response = await fetch(`${API_ENDPOINT}/record-action`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-API-Key': API_KEY as string
			},
			body: JSON.stringify({ userId, type, data })
		})

		if (!response.ok) {
			throw new Error('Failed to record action')
		}

		const result = await response.json()
		return NextResponse.json(result)
	} catch (error) {
		console.error('Error recording user action:', error)
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
	}
}
