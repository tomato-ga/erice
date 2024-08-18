import React from 'react'
import { KobetuPageArticle } from '@/types/types'
import PopularArticles from '../PopularArticle'
import ArticleKeywords from '../ArticleKeywords'
import ArticleLinks from '../ArticleLinks/index'

interface ArticleContentProps {
	article: KobetuPageArticle
}

const ArticleBasicContent: React.FC<ArticleContentProps> = ({ article }) => {
	// useArticleView(article.id)

	return (
		<div className="bg-white">
			<div className="py-2">
				<ArticleLinks article={article} />
				{/* <ArticleKeywords keywords={article.keywords} /> */}
			</div>
		</div>
	)
}

export default ArticleBasicContent
