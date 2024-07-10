import { HomePageApiResponse } from '../../../../types/types'

export async function getArticlesByKeyword(keyword: string): Promise<HomePageApiResponse> {
	const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/articles?keyword=${encodeURIComponent(keyword)}`
	console.log('API URL:', apiUrl) // URLをログに出力

	try {
		const res = await fetch(apiUrl, { cache: 'no-store' })
		if (!res.ok) {
			const errorText = await res.text()
			console.error('API Response:', errorText) // エラーレスポンスをログに出力
			throw new Error(`Failed to fetch articles: ${res.status} ${res.statusText}. Response: ${errorText}`)
		}
		const data: HomePageApiResponse = await res.json()

		if (!data.articles || !Array.isArray(data.articles)) {
			console.error('Unexpected API response structure:', data)
			return { articles: [] }
		}

		console.log('getArticlesByKeyword data: ', data)
		return data
	} catch (error) {
		console.error('Error in getArticlesByKeyword:', error)
		throw error
	}
}
