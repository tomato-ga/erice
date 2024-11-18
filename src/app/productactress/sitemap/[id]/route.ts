// /Volumes/SSD_1TB/erice2/erice/src/app/productactress/sitemap/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server'

const BASE_URL = 'https://erice.cloud'
const MAX_URLS_PER_SITEMAP = 10000

// APIレスポンスの型を更新
interface ApiResponse {
	names: string[]
	totalCount: number
}

async function fetchNames(): Promise<string[]> {
	try {
		const API_ENDPOINT = process.env.DMM_ACTRESS_SITEMAP_API_ENDPOINT
		const API_KEY = process.env.CLOUDFLARE_DMM_API_TOKEN

		if (!API_ENDPOINT || !API_KEY) {
			throw new Error('API_ENDPOINT or API_KEY is not set')
		}

		const response = await fetch(API_ENDPOINT, {
			headers: {
				'Content-Type': 'application/json',
				'X-API-Key': API_KEY,
			},
		})

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}

		const data = (await response.json()) as ApiResponse
		// console.log('productactress sitemap [id] API Response:', data) // デバッグ用ログ

		if (!data || typeof data.totalCount !== 'number') {
			throw new Error('Invalid API response format')
		}

		if (!data.names || !Array.isArray(data.names)) {
			console.warn('Names not found in API response')
			return [] // 空の配列を返す
		}

		return data.names
	} catch (error) {
		console.error('Error fetching names:', error)
		throw new Error('Failed to fetch names from API')
	}
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
	try {
		const idWithoutExtension = params.id.replace('.xml', '')
		const id = Number.parseInt(idWithoutExtension, 10)

		if (Number.isNaN(id) || id < 0) {
			return new NextResponse('Invalid sitemap ID', { status: 400 })
		}

		const names = await fetchNames()
		console.log('Fetched names:', names) // デバッグ用ログ

		if (names.length === 0) {
			return new NextResponse('No names available', { status: 404 })
		}

		const start = id * MAX_URLS_PER_SITEMAP
		const end = Math.min((id + 1) * MAX_URLS_PER_SITEMAP, names.length)

		if (start >= names.length) {
			return new NextResponse('Sitemap not found', { status: 404 })
		}

		const urls = names
			.slice(start, end)
			.map(
				name => `
  <url>
    <loc>${BASE_URL}/actressprofile/${encodeURIComponent(name)}</loc>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
		<lastmod>2024-11-10</lastmod>
  </url>`,
			)
			.join('')

		const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`

		return new NextResponse(sitemap, {
			status: 200,
			headers: {
				'Content-Type': 'application/xml',
				'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
			},
		})
	} catch (error) {
		console.error('Error generating sitemap:', error)
		if (error instanceof Error) {
			return new NextResponse(`Internal Server Error: ${error.message}`, { status: 500 })
		}
		return new NextResponse('Unknown error occurred', { status: 500 })
	}
}
