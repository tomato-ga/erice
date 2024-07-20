import { HomePageApiResponse } from '../../../../../types/types'

export async function getHomeArticles(page: number, limit: number): Promise<HomePageApiResponse> {
	const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/toppage?page=${page}&limit=${limit}`

	console.log(`[Server] Fetching articles. URL: ${apiUrl}`)

	const startTime = Date.now()
	const res = await fetch(apiUrl, {
		// cache: 'no-store',
		next: { revalidate: 3600 },
		headers: { Authorization: `Bearer ${process.env.D1_API_KEY}` }
	})
	const endTime = Date.now()

	console.log(`[Server] API request completed. Time taken: ${endTime - startTime}ms`)

	if (!res.ok) {
		console.error(`[Server] API request failed. Status: ${res.status}`)
		throw new Error('Failed to fetch articles')
	}

	const data: HomePageApiResponse = await res.json()
	console.log(`[Server] API response processed. Articles count: ${data.articles?.length || 0}`)

	if (!data.articles || !Array.isArray(data.articles)) {
		console.error('[Server] Unexpected API response structure:', data)
		return { articles: [], totalPages: 0 }
	}

	return data
}
