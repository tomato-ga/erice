// /app/product/sitemap.xml/route.ts

import { NextResponse } from 'next/server'

const BASE_URL = 'https://erice.cloud'
const MAX_URLS_PER_SITEMAP = 10000

const API_ENDPOINT = process.env.DMM_SITEMAP_API_ENDPOINT
const API_KEY = process.env.CLOUDFLARE_DMM_API_TOKEN

async function fetchTotalCount(): Promise<number> {
	if (!API_ENDPOINT || !API_KEY) {
		throw new Error('API_ENDPOINT or API_KEY is not set')
	}

	const response = await fetch(API_ENDPOINT, {
		headers: {
			'Content-Type': 'application/json',
			'X-API-Key': API_KEY
		},
		next: { revalidate: 3600 } // 1時間ごとに再検証
	})

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`)
	}

	const data: { totalCount: number } = await response.json()
	return data.totalCount
}

export async function GET() {
	try {
		const totalCount = await fetchTotalCount()
		const sitemapCount = Math.ceil(totalCount / MAX_URLS_PER_SITEMAP)

		const sitemaps = Array.from(
			{ length: sitemapCount },
			(_, i) => `
  <sitemap>
    <loc>${BASE_URL}/product/sitemap/${i}.xml</loc>
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
