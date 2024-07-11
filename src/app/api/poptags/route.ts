import { NextResponse } from 'next/server'

export async function GET() {
	const apiKey = process.env.D1_API_KEY
	const workersApiUrl = process.env.TAGS_WORKER_URL

	if (!apiKey || !workersApiUrl) {
		console.error('Missing environment variables: D1_API_KEY or TAGS_WORKER_URL')
		return NextResponse.json({ error: 'Internal server configuration error' }, { status: 500 })
	}

	try {
		const response = await fetch(workersApiUrl, {
			headers: {
				Authorization: `Bearer ${apiKey}`
			}
		})

		if (!response.ok) {
			const errorData = await response.json().catch(() => null)
			console.error('Worker API error:', response.status, errorData)
			return NextResponse.json(
				{ error: 'Failed to fetch popular keywords', details: errorData?.error || response.statusText },
				{ status: response.status }
			)
		}

		const keywords = await response.json()

		// We're now returning all keywords (up to 50) without slicing
		return NextResponse.json(keywords)
	} catch (error: unknown) {
		console.error('Failed to fetch popular keywords:', error)
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
	}
}
