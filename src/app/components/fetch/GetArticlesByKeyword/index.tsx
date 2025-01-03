import { PaginationArticleResponse, PaginationArticle } from '@/types/types'

interface APIResponse {
	articles: PaginationArticle[]
	currentPage: number
	totalPages: number
	total: number
}

export async function getArticlesByKeyword(
	keyword: string,
	page: number,
	limit: number
): Promise<PaginationArticleResponse> {
	const apiUrl = `${process.env.PAGINATION_KEYWORD_WORKER_URL}/articles?keyword=${encodeURIComponent(
		keyword
	)}&page=${page}&limit=${limit}`

	try {
		const res = await fetch(apiUrl, {
			// cache: 'no-store',

			next: { revalidate: 1800 },
			headers: {
				Authorization: `Bearer ${process.env.D1_API_KEY}`
			}
		})
		if (!res.ok) {
			const errorText = await res.text()
			console.error('getArticlesByKeyword API Response:', errorText)
			throw new Error(`Failed to fetch articles: ${res.status} ${res.statusText}. Response: ${errorText}`)
		}
		const data = (await res.json()) as APIResponse
		// console.log('getArticlesByKeyword API Response:', data) // 確認用ログ

		if (!data.articles || !Array.isArray(data.articles)) {
			console.error('Unexpected API response structure:', data)
			return {
				articles: [],
				currentPage: 1,
				totalPages: 0,
				total: 0
			}
		}

		const paginatedData: PaginationArticleResponse = {
			articles: data.articles as PaginationArticle[],
			currentPage: data.currentPage || 1,
			totalPages: data.totalPages || 1,
			total: data.total || data.articles.length
		}

		// console.log('getArticlesByKeyword data:', paginatedData) // 確認用ログ
		return paginatedData
	} catch (error) {
		console.error('Error in getArticlesByKeyword:', error)
		throw error
	}
}
