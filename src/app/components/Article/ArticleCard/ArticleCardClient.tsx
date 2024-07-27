'use client'

import React, { useEffect } from 'react'
import { HomePageArticle, RelatedArticle } from '../../../../../types/types'
import { handlePageClickCount } from '../../handleclick'

interface ArticleCardClientProps {
	article: HomePageArticle | RelatedArticle
}

const ArticleCardClient: React.FC<ArticleCardClientProps> = ({ article }) => {
	useEffect(() => {
		const handleClick = () => {
			if (typeof window !== 'undefined' && window.umami) {
				window.umami.track('Article Click', {
					article_id: article.id,
					article_title: article.title
				})
			}

			handlePageClickCount(article.id).catch((error) => console.error('Failed to record click:', error))
		}

		const element = document.getElementById(`article-${article.id}`)
		if (element) {
			element.addEventListener('click', handleClick)
		}

		return () => {
			if (element) {
				element.removeEventListener('click', handleClick)
			}
		}
	}, [article])

	return null
}

export default ArticleCardClient
