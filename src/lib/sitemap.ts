// /Volumes/SSD_1TB/erice2/erice/src/lib/sitemap.ts

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://erice.cloud'
const WORKER_URL = process.env.SITEMAP_WORKER_URL
const API_KEY = process.env.D1_API_KEY
const ARTICLES_PER_SITEMAP = 10000

interface Article {
	id: number
	updated_at: string
}

interface WorkerResponse {
	articles: Article[]
	nextCursor: string | null
	totalCount: number
}

async function fetchArticles(cursor: string | null): Promise<WorkerResponse> {
	if (!WORKER_URL || !API_KEY) {
		throw new Error('環境変数 SITEMAP_WORKER_URL または D1_API_KEY が設定されていません。')
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

	const data = await response.json()

	if (!data.articles || !Array.isArray(data.articles)) {
		throw new Error('Invalid response format from worker')
	}

	return data as WorkerResponse
}

export async function getTotalArticles(): Promise<number> {
	const response = await fetchArticles(null)
	console.log(`Total articles: ${response.totalCount}`)
	return response.totalCount
}

export async function generateSitemapIndex(totalArticles: number): Promise<string> {
	const sitemapCount = Math.ceil(totalArticles / ARTICLES_PER_SITEMAP)

	let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
	xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

	for (let i = 0; i < sitemapCount; i++) {
		xml += `  <sitemap>
      <loc>${BASE_URL}/sitemap/${i}.xml</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
    </sitemap>\n`
	}

	xml += '</sitemapindex>'

	return xml
}

export async function generateSitemap(id: number): Promise<string> {
	let cursor: string | null = null
	let articles: Article[] = []

	const startIndex = id * ARTICLES_PER_SITEMAP
	const endIndex = startIndex + ARTICLES_PER_SITEMAP

	console.log(`Fetching articles for sitemap ID ${id}, startIndex: ${startIndex}, endIndex: ${endIndex}`)

	while (articles.length < endIndex) {
		const response = await fetchArticles(cursor)
		articles = articles.concat(response.articles)
		console.log(`Fetched ${response.articles.length} articles, total: ${articles.length}`)
		if (!response.nextCursor || articles.length >= endIndex) break
		cursor = response.nextCursor
	}

	const sitemapArticles = articles.slice(
		Math.max(0, startIndex - articles.length + ARTICLES_PER_SITEMAP),
		Math.min(articles.length, endIndex - articles.length + ARTICLES_PER_SITEMAP)
	)

	console.log(`Generating sitemap for articles ${startIndex} to ${endIndex}, total entries: ${sitemapArticles.length}`)

	let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
	xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

	for (const article of sitemapArticles) {
		xml += `  <url>
    <loc>${BASE_URL}/post/${article.id}</loc>
    <lastmod>${new Date(article.updated_at).toISOString()}</lastmod>
  </url>\n`
	}

	xml += '</urlset>'

	return xml
}
