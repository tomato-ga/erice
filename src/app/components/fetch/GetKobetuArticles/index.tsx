import { KobetuPageArticle, SingleArticleApiResponse } from '../../../../types/types'

export async function getKobetuArticle(postId: string): Promise<KobetuPageArticle | null> {
	const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/kobetupage?postId=${postId}`

	try {
		const res = await fetch(apiUrl, { cache: 'no-store' })
		if (!res.ok) {
			const errorText = await res.text()
			console.error(`API error (${res.status}):`, errorText)
			throw new Error(`API request failed with status ${res.status}: ${errorText}`)
		}
		const data: SingleArticleApiResponse = await res.json()
		if (!data.article) {
			console.error('API response does not contain article data:', data)
			throw new Error('Invalid API response format')
		}
		return data.article
	} catch (error) {
		console.error('Error fetching article:', error)
		return null
	}
}
