import { useCallback } from 'react'
import { getUserId } from '@/lib/getUserId'
import { Keyword, KobetuPageArticle } from '../../../types/types'

export function useUserActions() {
	const recordAction = useCallback(async (type: 'article_view' | 'keyword_view' | 'external_click', data: any) => {
		const userId = getUserId()
		try {
			const response = await fetch('/api/record-action', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ userId, type, data })
			})
			if (!response.ok) {
				const errorData = await response.json()
				throw new Error(errorData.error || 'Failed to record action')
			}
		} catch (error) {
			console.error('Error recording user action:', error)
		}
	}, [])

	const recordArticleView = useCallback(
		(article: KobetuPageArticle) => {
			recordAction('article_view', {
				article_id: article.id,
				title: article.title,
				site_name: article.site_name,
				viewed_at: new Date().toISOString()
			})
		},
		[recordAction]
	)

	const recordKeywordView = useCallback(
		(keyword: Keyword) => {
			recordAction('keyword_view', {
				keyword_id: keyword.id,
				keyword: keyword.keyword,
				viewed_at: new Date().toISOString()
			})
		},
		[recordAction]
	)

	const recordExternalClick = useCallback(
		(articleId: number, link: string) => {
			recordAction('external_click', {
				article_id: articleId,
				link,
				clicked_at: new Date().toISOString()
			})
		},
		[recordAction]
	)

	return { recordArticleView, recordKeywordView, recordExternalClick }
}
