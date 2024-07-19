// /Volumes/SSD_1TB/erice/src/app/sitemap.ts

import { MetadataRoute } from 'next'

const WORKER_URL = process.env.SITEMAP_WORKER_URL
const API_KEY = process.env.D1_API_KEY
const BASE_URL = 'https://erice.cloud'

interface Article {
	id: number
	updated_at: string
}

interface WorkerResponse {
	articles: Article[]
	nextCursor: string | null
}

async function fetchArticles(cursor: string | null): Promise<WorkerResponse> {
	const params = new URLSearchParams({
		pageSize: '50000' // Googleの推奨上限
	})

	if (cursor) {
		const [lastId, lastUpdated] = cursor.split('|')
		params.append('lastId', lastId)
		params.append('lastUpdated', lastUpdated)
	}

	const response = await fetch(`${WORKER_URL}?${params.toString()}`, {
		headers: {
			Authorization: `Bearer ${API_KEY}`
		}
	})

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`)
	}

	return await response.json()
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	try {
		const response = await fetchArticles(null)

		return response.articles.map((article) => ({
			url: `${BASE_URL}/post/${article.id}`,
			lastModified: new Date(article.updated_at)
		}))
	} catch (error) {
		console.error('Error generating sitemap:', error)
		return []
	}
}
