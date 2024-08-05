import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url)
	const page = searchParams.get('page') || '1'
	const limit = searchParams.get('limit') || '10'

	const apiKey = process.env.D1_API_KEY
	const workersApiUrl = process.env.TOPPAGE_WORKER_URL

	if (!apiKey || !workersApiUrl) {
		console.error('Missing environment variables: D1_API_KEY or TOPPAGE_WORKER_URL')
		return NextResponse.json({ error: 'Internal server configuration error' }, { status: 500 })
	}

	const cleanWorkerUrl = workersApiUrl.endsWith('/') ? workersApiUrl.slice(0, -1) : workersApiUrl

	try {
		const response = await fetch(
			`${cleanWorkerUrl}?page=${encodeURIComponent(page)}&limit=${encodeURIComponent(limit)}`,
			{
				headers: {
					Authorization: `Bearer ${apiKey}`
				}
			}
		)

		if (!response.ok) {
			const errorData = (await response.json().catch(() => ({}))) as { error?: string }
			console.error('Worker API error:', response.status, errorData)
			return NextResponse.json(
				{ error: 'Failed to fetch articles', details: errorData?.error || response.statusText },
				{ status: response.status }
			)
		}

		const data = await response.json()
		return NextResponse.json(data)
	} catch (error) {
		console.error('Failed to fetch articles:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}
