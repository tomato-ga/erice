'use client'

import React from 'react'
import { KobetuPageArticle } from '../../../../../types/types'
import ArticleLinks from '../ArticleLinks'
import { useArticleView } from '@/app/hooks/useArticleView'
import PopularArticles from '../PopularArticle'
import ArticleLoad from '../ArticleLoaded'

interface ArticleContentProps {
	article: KobetuPageArticle
}

const ArticleContent: React.FC<ArticleContentProps> = ({ article }) => {
	// useArticleView(article.id)

	return (
		<div className="bg-white">
			<div className="py-2">
				<h1 className="text-3xl font-bold mb-4">{article.title}</h1>
				<ArticleLinks article={article} />
			</div>
		</div>
	)
}

export default ArticleContent
