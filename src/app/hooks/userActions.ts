import { useCallback } from 'react'
import { getUserId } from '@/lib/getUserId'
import { KobetuPageArticle } from '../../../types/types'

export function useUserActions() {
	const recordArticleView = useCallback(async (article: KobetuPageArticle) => {
		const userId = getUserId()
		try {
			const response = await fetch('/api/record-article', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					userId,
					data: {
						article_id: article.id,
						title: article.title,
						site_name: article.site_name,
						viewed_at: new Date().toISOString()
					}
				})
			})

			if (!response.ok) {
				throw new Error('Failed to record article view')
			}

			// console.log(`Article view recorded: ${article.id} - ${article.title}`)
		} catch (error) {
			console.error('Error recording article view:', error)
		}
	}, [])

	return { recordArticleView }
}
