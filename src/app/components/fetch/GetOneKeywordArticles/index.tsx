import { KeywordArticle, KeywordArticleApiResponse } from '../../../../../types/types'

export async function getKeywordArticle(word: string): Promise<KeywordArticle[] | null> {
	const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/onekeyword?keyword=${word}`

	try {
		const res = await fetch(apiUrl, { next: { revalidate: false } })
		if (!res.ok) {
			const errorText = await res.text()
			console.error(`API error (${res.status}):`, errorText)
			throw new Error(`API request failed with status ${res.status}: ${errorText}`)
		}
		const data: KeywordArticleApiResponse = await res.json()
		if (!data || !data.articles) {
			console.error('API response does not contain article data:', data)
			throw new Error('Invalid API response format')
		}
		return data.articles
	} catch (error) {
		console.error('Error fetching article:', error)
		return null
	}
}
