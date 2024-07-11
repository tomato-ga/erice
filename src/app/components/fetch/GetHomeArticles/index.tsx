import { HomePageApiResponse } from '../../../../../types/types'

export async function getHomeArticles(page: number, limit: number): Promise<HomePageApiResponse> {
	const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/toppage?page=${page}&limit=${limit}`

	const res = await fetch(apiUrl, {
		cache: 'no-store',
		headers: { Authorization: `Bearer ${process.env.D1_API_KEY}` }
	})
	if (!res.ok) {
		throw new Error('Failed to fetch articles')
	}
	const data: HomePageApiResponse = await res.json()

	if (!data.articles || !Array.isArray(data.articles)) {
		console.error('Unexpected API response structure:', data)
		return { articles: [], totalPages: 0 }
	}

	return data
}
