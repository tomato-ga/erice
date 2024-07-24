import { NextRequest, NextResponse } from 'next/server'
import { KeywordArticleApiResponse } from '../../../../types/types'

export async function GET(request: NextRequest) {
	const API_KEY = process.env.D1_API_KEY
	const WORKER_URL = process.env.ONEKEYWORD_WORKER_URL

	if (!API_KEY) {
		throw new Error('D1_API_KEY is not set in the environment variables')
	}

	if (!WORKER_URL) {
		throw new Error('ARTICLE_WORKER_URL is not set in the environment variables')
	}

	const keyword = request.nextUrl.searchParams.get('keyword')

	if (!keyword || keyword.trim().length === 0) {
		return NextResponse.json({ error: 'Valid keyword is required' }, { status: 400 })
	}

	try {
		const workerUrl = new URL('/articles', WORKER_URL)
		workerUrl.searchParams.set('keyword', keyword.trim())

		const response = await fetch(workerUrl, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'X-API-Key': API_KEY
			}
		})

		if (!response.ok) {
			throw new Error(`Failed to fetch data from Cloudflare Worker: ${response.statusText}`)
		}

		const data: KeywordArticleApiResponse = await response.json()

		// console.log('APIルートキーワード関連記事', data)

		return NextResponse.json(data)
	} catch (error) {
		console.error('Error in API route:', error)
		return NextResponse.json({ error: 'Internal Server Error', details: (error as Error).message }, { status: 500 })
	}
}
