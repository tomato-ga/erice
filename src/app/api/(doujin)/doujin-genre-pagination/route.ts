import { NextRequest, NextResponse } from 'next/server'

interface APIResponse {
	items: {
		db_id: number
		content_id: string
		package_images: string
		title: string
	}[]
	currentPage: number
	totalPages: number
	genre: string
}

export async function GET(request: NextRequest) {
	const genre = request.nextUrl.searchParams.get('genre')
	const page = request.nextUrl.searchParams.get('page') || '1'

	const WORKER_URL = process.env.DOUJIN_GENRE_PAGINATION_WORKER_URL
	if (!WORKER_URL) {
		throw new Error('必要な環境変数が設定されていません')
	}

	const headers = new Headers()
	headers.append('X-API-Key', process.env.CLOUDFLARE_DMM_API_TOKEN_DOUJIN || '')

	const apiParams = new URLSearchParams({ page })
	if (genre) {
		apiParams.append('genre', genre)
	}

	try {
		const response = await fetch(`${WORKER_URL}/items-by-genre?${apiParams}`, {
			headers: headers
			// cache: 'force-cache'
		})

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}))
			console.error('API Route error:', response.status, errorData)
			return NextResponse.json(
				{ error: 'Failed to fetch data from API route', details: errorData },
				{ status: response.status }
			)
		}

		const data = (await response.json()) as APIResponse

		return NextResponse.json(data, {
			headers: {
				'Cache-Control': 'public, max-age=60, stale-while-revalidate=300'
			}
		})
	} catch (error) {
		console.error('Fetch error:', error)
		return NextResponse.json(
			{
				error: 'Internal Server Error',
				details: error instanceof Error ? error.message : 'Unknown error'
			},
			{ status: 500 }
		)
	}
}
