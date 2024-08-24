// app/sitemap.ts

import { MetadataRoute } from 'next'

const BASE_URL = 'https://erice.cloud'
const MAX_URLS_PER_SITEMAP = 50000 // Google's limit

const API_ENDPOINT = process.env.DMM_SITEMAP_API_ENDPOINT
const API_KEY = process.env.CLOUDFLARE_DMM_API_TOKEN

export async function fetchTotalCount(): Promise<number> {
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

export async function generateSitemaps() {
	const totalCount = await fetchTotalCount()
	const sitemapCount = Math.ceil(totalCount / MAX_URLS_PER_SITEMAP)

	return Array.from({ length: sitemapCount }, (_, i) => ({ id: i }))
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
	const totalCount = await fetchTotalCount()
	const start = id * MAX_URLS_PER_SITEMAP
	const end = Math.min((id + 1) * MAX_URLS_PER_SITEMAP, totalCount)

	// この部分は実際のデータ取得ロジックに置き換える必要があります
	const items = Array.from({ length: end - start }, (_, i) => ({
		id: start + i + 1,
		date: new Date().toISOString()
	}))

	return items.map((item) => ({
		url: `${BASE_URL}/item/${item.id}`,
		lastModified: item.date,
		changeFrequency: 'daily',
		priority: 0.7
	}))
}
