// /app/productactress/sitemap.xml/route.ts

import { NextResponse } from 'next/server'

const BASE_URL = 'https://erice.cloud'
const MAX_URLS_PER_SITEMAP = 10000

interface ApiResponse {
	names: string[]
	totalCount: number
}

export async function GET() {
	const API_ENDPOINT = process.env.DMM_ACTRESS_SITEMAP_API_ENDPOINT
	const API_KEY = process.env.CLOUDFLARE_DMM_API_TOKEN

	if (!API_ENDPOINT || !API_KEY) {
		console.error('API_ENDPOINT or API_KEY is not defined')
		return new NextResponse('Internal Server Error', { status: 500 })
	}

	try {
		const response = await fetch(API_ENDPOINT, {
			headers: {
				'Content-Type': 'application/json',
				'X-API-Key': API_KEY
			}
		})

		if (!response.ok) {
			throw new Error(`API responded with status: ${response.status}`)
		}

		const data = (await response.json()) as ApiResponse
		console.log('productactress sitemap index API Response:', data) // デバッグ用ログ

		if (!Array.isArray(data.names) || data.names.length === 0) {
			throw new Error('Invalid or empty response from API')
		}

		const totalUrls = data.totalCount
		const sitemapCount = Math.ceil(totalUrls / MAX_URLS_PER_SITEMAP)

		const sitemaps = Array.from(
			{ length: sitemapCount },
			(_, i) => `
  <sitemap>
    <loc>${BASE_URL}/productactress/sitemap/${i}.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`
		).join('')

		const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps}
</sitemapindex>`

		return new NextResponse(sitemapIndex, {
			status: 200,
			headers: {
				'Content-Type': 'application/xml',
				'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400'
			}
		})
	} catch (error) {
		console.error('Error generating sitemap index:', error)
		return new NextResponse('Internal Server Error', { status: 500 })
	}
}
