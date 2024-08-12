import { getServerSideSitemapIndex } from 'next-sitemap'

const BASE_URL = 'http://localhost:3000' // 実際のサイトURLに置き換えてください
const ENTRIES_PER_SITEMAP = 50000
const API_ENDPOINT = process.env.DMM_SITEMAP_WORKER_URL
const API_KEY = process.env.CLOUDFLARE_DMM_API_TOKEN

async function fetchTotalCount(): Promise<number> {
	if (!API_ENDPOINT || !API_KEY) {
		throw new Error('API_ENDPOINT または API_KEY が設定されていません。')
	}

	const response = await fetch(API_ENDPOINT, {
		headers: { 'X-API-KEY': API_KEY }
	})

	if (!response.ok) {
		throw new Error(`API request failed: ${response.statusText}`)
	}

	const data = await response.json()
	if (typeof data === 'object' && data !== null && 'totalCount' in data && typeof data.totalCount === 'number') {
		return data.totalCount
	} else {
		throw new Error('APIレスポンスが期待された形式ではありません。')
	}
}

export async function GET(request: Request) {
	try {
		const totalCount = await fetchTotalCount()
		const sitemapCount = Math.ceil(totalCount / ENTRIES_PER_SITEMAP)
		const sitemapUrls = Array.from({ length: sitemapCount }, (_, i) => `${BASE_URL}/sitemap/${i}.xml`)

		return getServerSideSitemapIndex(sitemapUrls)
	} catch (error) {
		console.error('サイトマップインデックスの生成中にエラーが発生しました:', error)
		return getServerSideSitemapIndex([])
	}
}
