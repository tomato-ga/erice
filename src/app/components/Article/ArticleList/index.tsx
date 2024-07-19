import React from 'react'
import { HomePageArticle } from '../../../../../types/types'
import ArticleCard from '../ArticleCard'

interface ArticleListProps {
	articles: HomePageArticle[]
}

const ArticleList: React.FC<ArticleListProps> = React.memo(({ articles }) => {
	if (articles.length === 0) {
		return <p className="text-center text-gray-500">No articles available.</p>
	}

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
			{articles.map((article) => (
				<ArticleCard key={article.id} article={article} />
			))}
		</div>
	)
})

ArticleList.displayName = 'ArticleList'

export default ArticleList
