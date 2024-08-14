// /Volumes/SSD_1TB/erice2/erice/src/app/(pages)/sitemap/[id]/route.ts

import { getServerSideSitemap } from 'next-sitemap'
import { ISitemapField } from 'next-sitemap'

const BASE_URL = 'https://erice.cloud' // 実際のサイトURLに置き換えてください
const ENTRIES_PER_SITEMAP = 20000
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
	console.log(`GETリクエスト：params = ${JSON.stringify(params)}`)
	try {
		const id = parseInt(params.id, 10)
		console.log(`id = ${id}`)
		// skip の計算方法を修正
		const skip = id * ENTRIES_PER_SITEMAP
		let cursor = undefined // 最初の API リクエストでは cursor を undefined にする
		let items: { content_id: string }[] = []
		let fetchedCount = 0

		while (fetchedCount < ENTRIES_PER_SITEMAP) {
			console.log(`APIリクエスト開始：cursor = ${cursor}`)
			const data = await fetchItems(cursor)
			console.log(`APIレスポンス：${JSON.stringify(data)}`)
			// slice の開始位置を 0 に修正
			items = items.concat(data.items.slice(0, ENTRIES_PER_SITEMAP - fetchedCount))
			fetchedCount += data.items.length
			cursor = data.nextCursor
			if (!cursor) break
		}

		console.log(`取得したアイテム数：${items.length}`)

		const fields: ISitemapField[] = items.map((item) => ({
			loc: `${BASE_URL}/item/${item.content_id}`,
			lastmod: new Date().toISOString(),
			changefreq: 'daily',
			priority: 0.5
		}))

		console.log(`生成されたサイトマップフィールド：${JSON.stringify(fields)}`)

		return getServerSideSitemap(fields)
	} catch (error) {
		console.error(`サイトマップ ${params.id} の生成中にエラーが発生しました:`, error)
		return getServerSideSitemap([])
	}
}
