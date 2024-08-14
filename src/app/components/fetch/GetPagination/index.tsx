// /Users/ore/Documents/GitHub/rice/erice/src/app/components/fetch/getPagination/index.tsx

import { PaginationArticleResponse } from '../../../../../types/types'

export async function fetchPaginationArticles(
	keyword: string | null,
	page: number
): Promise<PaginationArticleResponse> {
	const params = new URLSearchParams({ page: page.toString() })
	if (keyword) {
		params.append('keyword', keyword)
	}

	try {
		const response = await fetch(`/api/pagination?${params}`, {
			headers: {
				Accept: 'application/json'
			}
			// next: { revalidate: 60 }
		})

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}))
			console.error('API error:', response.status, errorData)
			throw new Error(`Failed to fetch articles: ${response.status} ${JSON.stringify(errorData)}`)
		}

		const data = await response.json() as {
			articles: unknown,
			currentPage?: number,
			totalPages?: number,
			total?: number
		}
		console.log('Fetched data:', data) // デバッグログ

		// レスポンスの型チェックと整形
		if (!Array.isArray(data.articles)) {
			console.error('Invalid articles data:', data.articles)
			throw new Error('Invalid response format from API: articles is not an array')
		}

		return {
			articles: data.articles,
			currentPage: data.currentPage || 1,
			totalPages: data.totalPages || 1,
			total: data.total || 0
		}
	} catch (error) {
		console.error('Fetch error:', error)
		// エラー時にデフォルト値を返す
		return { articles: [], currentPage: 1, totalPages: 1, total: 0 }
	}
}