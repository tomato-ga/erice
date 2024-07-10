import { PaginationArticleResponse } from '../../../../../types/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api'

export async function fetchArticles(keyword: string | null, page: number): Promise<PaginationArticleResponse> {
	const params = new URLSearchParams({ page: page.toString() })
	if (keyword) {
		params.append('keyword', keyword)
	}
	const { data } = await fetch(`${API_BASE_URL}/articles`, { params })
	return data
}
