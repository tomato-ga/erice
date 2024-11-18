// /app/product/sitemap/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server'

const BASE_URL = 'https://erice.cloud'
const MAX_URLS_PER_SITEMAP = 10000

const API_ENDPOINT = process.env.DMM_SITEMAP_API_ENDPOINT
const API_KEY = process.env.CLOUDFLARE_DMM_API_TOKEN

const FIXED_URLS = ['/doujin/sale', '/doujin/review', '/doujin/newrelease', '/doujin/newrank']

async function fetchTotalCount(): Promise<number> {
	if (!API_ENDPOINT || !API_KEY) {
		throw new Error('API_ENDPOINT or API_KEY is not set')
	}

	const response = await fetch(API_ENDPOINT, {
		headers: {
			'Content-Type': 'application/json',
			'X-API-Key': API_KEY,
		},
		cache: 'no-cache',
	})

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`)
	}

	const data: { totalCount: number } = await response.json()
	return data.totalCount
}

function generateUrls(start: number, end: number, includeFixedUrls = false): string {
	const productUrls = Array.from({ length: end - start }, (_, i) => ({
		id: start + i + 1,
		date: new Date().toISOString(),
	}))
		.map(
			product => `
	<url>
		<loc>${BASE_URL}/doujin/itemd/${product.id}</loc>
		<changefreq>daily</changefreq>
		<priority>0.7</priority>
	</url>
	`,
		)
		.join('')

	const fixedUrls = includeFixedUrls
		? FIXED_URLS.map(
				url => `
	<url>
		<loc>${BASE_URL}${url}</loc>
		<changefreq>daily</changefreq>
		<priority>0.7</priority>
		<lastmod>2024-11-15</lastmod>
	</url>
	`,
			).join('')
		: ''

	return productUrls + fixedUrls
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
	try {
		// IDから.xml拡張子を除去
		const idWithoutExtension = params.id.replace('.xml', '')
		const id = Number.parseInt(idWithoutExtension, 10)

		if (Number.isNaN(id) || !Number.isInteger(id) || id < 0) {
			return new NextResponse('Invalid sitemap ID', { status: 400 })
		}

		const totalCount = await fetchTotalCount()
		const start = id * MAX_URLS_PER_SITEMAP
		const end = Math.min((id + 1) * MAX_URLS_PER_SITEMAP, totalCount)

		if (start >= totalCount) {
			return new NextResponse('Sitemap not found', { status: 404 })
		}

		const urls = generateUrls(start, end, id === 0)

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
		return new NextResponse('Internal Server Error', { status: 500 })
	}
}
