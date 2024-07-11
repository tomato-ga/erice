import { HomePageApiResponse } from '../../../../../types/types'

export async function getHomeArticles(): Promise<HomePageApiResponse> {
	const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/toppage`

	const res = await fetch(apiUrl, { cache: 'no-store' })
	if (!res.ok) {
		throw new Error('Failed to fetch articles')
	}
	const data: HomePageApiResponse = await res.json()

	if (!data.articles || !Array.isArray(data.articles)) {
		console.error('Unexpected API response structure:', data)
		return { articles: [] }
	}

	return data
}
