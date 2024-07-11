// /Users/ore/Documents/GitHub/rice/erice/src/app/api/pagination/route.ts

import { NextRequest, NextResponse } from 'next/server'

const WORKER_URL = process.env.PAGINATION_KEYWORD_WORKER_URL

if (!WORKER_URL) {
	throw new Error('PAGINATION_KEYWORD_WORKER_URL is not defined in environment variables')
}

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url)
	const keyword = searchParams.get('keyword')
	const page = searchParams.get('page') || '1'

	const workerParams = new URLSearchParams({ page })
	if (keyword) {
		workerParams.append('keyword', keyword)
	}

	try {
		const controller = new AbortController()
		const timeoutId = setTimeout(() => controller.abort(), 5000) // 5秒タイムアウト

		const response = await fetch(`${WORKER_URL}/articles?${workerParams}`, {
			signal: controller.signal
		})

		clearTimeout(timeoutId)

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}))
			console.error('Worker API error:', response.status, errorData)
			return NextResponse.json(
				{ error: 'Failed to fetch data from worker', details: errorData },
				{ status: response.status }
			)
		}

		const data = await response.json()
		console.log('api/pagination:', data)

		if (!Array.isArray(data.articles) || typeof data.currentPage !== 'number' || typeof data.totalPages !== 'number') {
			throw new Error('Invalid response format from worker')
		}

		return NextResponse.json(data, {
			headers: {
				'Cache-Control': 'public, max-age=60, stale-while-revalidate=300'
			}
		})
	} catch (error) {
		console.error('Fetch error:', error)
		return NextResponse.json(
			{ error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' },
			{ status: 500 }
		)
	}
}
