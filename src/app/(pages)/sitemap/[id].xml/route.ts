import { getServerSideSitemap } from 'next-sitemap'
import { ISitemapField } from 'next-sitemap'

const BASE_URL = 'http://localhost:3000' // 実際のサイトURLに置き換えてください
const ENTRIES_PER_SITEMAP = 50000
const API_ENDPOINT = process.env.DMM_SITEMAP_WORKER_URL
const API_KEY = process.env.CLOUDFLARE_DMM_API_TOKEN

async function fetchItems(cursor?: string): Promise<{ items: { content_id: string }[]; nextCursor?: string }> {
	if (!API_ENDPOINT || !API_KEY) {
		throw new Error('API_ENDPOINT または API_KEY が設定されていません。')
	}

	const url = new URL(API_ENDPOINT)
	if (cursor) {
		url.searchParams.set('cursor', cursor)
	}

	const response = await fetch(url.toString(), {
		headers: { 'X-API-KEY': API_KEY }
	})

	if (!response.ok) {
		throw new Error(`API request failed: ${response.statusText}`)
	}

	return await response.json()
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
	try {
		const id = parseInt(params.id, 10)
		const skip = id * ENTRIES_PER_SITEMAP
		let cursor: string | undefined
		let items: { content_id: string }[] = []
		let fetchedCount = 0

		while (fetchedCount < ENTRIES_PER_SITEMAP) {
			const data = await fetchItems(cursor)
			items = items.concat(data.items.slice(skip, skip + ENTRIES_PER_SITEMAP - fetchedCount))
			fetchedCount += data.items.length
			cursor = data.nextCursor
			if (!cursor) break
		}

		const fields: ISitemapField[] = items.map((item) => ({
			loc: `${BASE_URL}/item/${item.content_id}`,
			lastmod: new Date().toISOString(),
			changefreq: 'daily',
			priority: 0.5
		}))

		return getServerSideSitemap(fields)
	} catch (error) {
		console.error(`サイトマップ ${params.id} の生成中にエラーが発生しました:`, error)
		return getServerSideSitemap([])
	}
}
