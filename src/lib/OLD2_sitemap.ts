const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://erice.cloud'
const WORKER_URL = process.env.DMM_SITEMAP_WORKER_URL
const API_KEY = process.env.CLOUDFLARE_DMM_API_TOKEN
const ITEMS_PER_SITEMAP = 10000

interface DMMItem {
	content_id: string
	date: string
}

interface WorkerResponse {
	items: DMMItem[]
	nextCursor: string | null
	totalCount: number
}

async function fetchDMMItems(cursor: string | null): Promise<WorkerResponse> {
	if (!WORKER_URL || !API_KEY) {
		throw new Error('環境変数 DMM_SITEMAP_WORKER_URL または CLOUDFLARE_DMM_API_TOKEN が設定されていません。')
	}

	const url = new URL(WORKER_URL)
	if (cursor) {
		url.searchParams.append('cursor', cursor)
	}
	url.searchParams.append('pageSize', '1000')

	const response = await fetch(url, {
		headers: {
			'X-API-KEY': API_KEY
		},
		cache: 'no-store'
	})

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`)
	}

	const data: unknown = await response.json()

	if (!isWorkerResponse(data)) {
		throw new Error('ワーカーからの応答が無効な形式です')
	}

	return data
}

function isWorkerResponse(data: unknown): data is WorkerResponse {
	return (
		typeof data === 'object' &&
		data !== null &&
		'items' in data &&
		Array.isArray((data as WorkerResponse).items) &&
		'nextCursor' in data &&
		'totalCount' in data
	)
}

export async function getTotalDMMItems(): Promise<number> {
	const response = await fetchDMMItems(null)
	console.log(`Total DMM items: ${response.totalCount}`)
	return response.totalCount
}

export async function generateDMMSitemapIndex(totalItems: number): Promise<string> {
	const sitemapCount = Math.ceil(totalItems / ITEMS_PER_SITEMAP)

	let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
	xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

	for (let i = 0; i < sitemapCount; i++) {
		xml += `  <sitemap>
    <loc>${BASE_URL}/dmm-sitemap/${i}.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>\n`
	}

	xml += '</sitemapindex>'

	return xml
}

export async function generateDMMSitemap(id: number): Promise<string> {
	let cursor: string | null = null
	let items: DMMItem[] = []

	const startIndex = id * ITEMS_PER_SITEMAP
	const endIndex = startIndex + ITEMS_PER_SITEMAP

	console.log(`Fetching DMM items for sitemap ID ${id}, startIndex: ${startIndex}, endIndex: ${endIndex}`)

	while (items.length < endIndex) {
		const response = await fetchDMMItems(cursor)
		items = items.concat(response.items)
		console.log(`Fetched ${response.items.length} DMM items, total: ${items.length}`)
		if (!response.nextCursor || items.length >= endIndex) break
		cursor = response.nextCursor
	}

	const sitemapItems = items.slice(
		Math.max(0, startIndex - items.length + ITEMS_PER_SITEMAP),
		Math.min(items.length, endIndex - items.length + ITEMS_PER_SITEMAP)
	)

	console.log(`Generating sitemap for DMM items ${startIndex} to ${endIndex}, total entries: ${sitemapItems.length}`)

	let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
	xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

	for (const item of sitemapItems) {
		xml += `  <url>
    <loc>${BASE_URL}/item/${item.content_id}</loc>
    <lastmod>${new Date(item.date).toISOString()}</lastmod>
  </url>\n`
	}

	xml += '</urlset>'

	return xml
}
