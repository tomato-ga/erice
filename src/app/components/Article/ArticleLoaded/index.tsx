'use client'

import React, { useEffect } from 'react'
import { useArticleViewStore } from '@/app/stores/articleViewStore'
import ArticleCard from '../ArticleCard'
import { RelatedArticle } from '../../../../../types/types'

const ArticleLoad: React.FC = () => {
	const { articles, isLoading, error, fetchArticles } = useArticleViewStore()

	useEffect(() => {
		fetchArticles()
	}, [fetchArticles])

	if (isLoading) return <p>閲覧履歴を読み込んでいます...</p>
	if (error) return <p className="text-red-500">{error}</p>
	if (articles.length === 0) return <p>閲覧履歴がありません</p>

	return (
		<>
			<h3 className="text-center pt-4 text-xl">閲覧履歴</h3>
			<div className="mt-1.5 p-0.5 bg-orange-50 rounded-md">
				<ul>
					{articles.slice(0, 5).map((article: RelatedArticle) => (
						<li key={article.id} className="p-1.5">
							<ArticleCard article={article} isSmallThumbnail={true} />
						</li>
					))}
				</ul>
			</div>
		</>
	)
}

export default ArticleLoad
