import { useEffect } from 'react'
import { recordArticleView, syncArticleKV } from '@/lib/articleViewSync'

export function useArticleView(articleId: number) {
	useEffect(() => {
		const recordView = async () => {
			try {
				await recordArticleView(articleId)
				await syncArticleKV()
			} catch (err) {
				console.error('Failed to record article view:', err)
			}
		}

		recordView()
	}, [articleId])
}
