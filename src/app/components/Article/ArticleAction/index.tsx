import { useEffect } from 'react'
import { KobetuPageArticle } from '../../../../../types/types'
import { useUserActions } from '../../../hooks/userActions'
;('use client')

const ArticleAction = (article: KobetuPageArticle) => {
	const { recordArticleView, recordExternalClick } = useUserActions()

	useEffect(() => {
		recordArticleView(article)
	})
}
