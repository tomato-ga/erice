// /app/maker_timeline/route.ts
import { TimelineApiResponse, TimelineApiResponseSchema } from '@/_types_doujin/doujintypes'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
	const makerId = req.nextUrl.searchParams.get('maker_id')

	if (!makerId) {
		return NextResponse.json({ error: 'Invalid maker_id parameter' }, { status: 400 })
	}

	const WORKER_URL = process.env.FANZA_DOUJIN_KOBETU_WORKER_URL
	if (!WORKER_URL) {
		return NextResponse.json({ error: 'Invalid WORKER_URL parameter' }, { status: 500 })
	}

	const API_KEY = process.env.CLOUDFLARE_DMM_API_TOKEN_DOUJIN
	if (!API_KEY) {
		return NextResponse.json({ error: 'Invalid API_KEY parameter' }, { status: 500 })
	}

	try {
		const response = await fetch(`${WORKER_URL}/maker_timeline?maker_id=${makerId}`, {
			headers: {
				'Content-Type': 'application/json',
				'X-API-Key': API_KEY,
			},
			cache: 'force-cache',
		})

		if (response.status === 404) {
			console.log(`Content not found for maker_id: ${makerId}`)
			return NextResponse.json([], { status: 200 })
		}

		if (!response.ok) {
			console.error(`Cloudflare Worker API error: ${response.status} ${response.statusText}`)
			throw new Error(`Failed to fetch data from Cloudflare Worker: ${response.status}`)
		}

		const data: TimelineApiResponse = await response.json()

		// Validate data using Zod
		const parseResult = TimelineApiResponseSchema.safeParse(data)
		if (!parseResult.success) {
			console.error('Data validation failed:', parseResult.error)
			return NextResponse.json({ error: 'Data validation failed' }, { status: 500 })
		}

		return NextResponse.json(parseResult.data)
	} catch (error) {
		console.error('API route error:', error)
		return NextResponse.json(
			{ error: 'Internal server error', details: (error as Error).message },
			{ status: 500 },
		)
	}
}
