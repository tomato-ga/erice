// File: app/api/doujin-maker-pagination/route.ts

import { PaginationResponse } from '@/_types_doujin/doujintypes'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
	const maker = request.nextUrl.searchParams.get('maker')
	const page = request.nextUrl.searchParams.get('page') || '1'

	const WORKER_URL = process.env.DOUJIN_MAKER_PAGINATION_WORKER_URL
	if (!WORKER_URL) {
		return NextResponse.json({ error: '必要な環境変数が設定されていません' }, { status: 500 })
	}

	const headers = new Headers()
	headers.append('X-API-Key', process.env.CLOUDFLARE_DMM_API_TOKEN_DOUJIN || '')

	const apiParams = new URLSearchParams({ page })
	if (maker) {
		apiParams.append('maker', maker)
	}

	try {
		const response = await fetch(`${WORKER_URL}/items-by-maker?${apiParams}`, {
			headers: headers,
		})

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}))
			console.error('API Route error:', response.status, errorData)
			return NextResponse.json(
				{ error: 'Failed to fetch data from API route', details: errorData },
				{ status: response.status },
			)
		}

		const data = (await response.json()) as PaginationResponse

		return NextResponse.json(data, {
			headers: {
				'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
			},
		})
	} catch (error) {
		console.error('Fetch error:', error)
		return NextResponse.json(
			{
				error: 'Internal Server Error',
				details: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		)
	}
}
