'use client'

import React, { useEffect } from 'react'
import { useArticleViewStore } from '@/app/stores/articleViewStore'
import ArticleCard from '../ArticleCard'
import { KeywordArticle, RelatedArticle } from '../../../../../types/types'

interface ArticleLoadProps {
	viewrireki?: boolean
	keywordarticledata?: KeywordArticle[] | null
}

const ArticleLoad: React.FC<ArticleLoadProps> = ({ viewrireki = false, keywordarticledata }) => {
	const { articles, isLoading, error, fetchArticles } = useArticleViewStore()

	useEffect(() => {
		fetchArticles()
	}, [fetchArticles])

	if (isLoading) return <p>閲覧履歴を読み込んでいます...</p>
	if (error) return <p className="text-red-500">{error}</p>

	return (
		<>
			{viewrireki && (
				<>
					<h3 className="text-center pt-4 text-xl">閲覧履歴</h3>
					<div className="mt-1.5 p-0.5 bg-pink-50 rounded-md">
						{articles.length === 0 ? (
							<p>閲覧履歴がありません</p>
						) : (
							<ul>
								{articles.slice(0, 5).map((article: RelatedArticle) => (
									<li key={article.id} className="p-1.5">
										<ArticleCard article={article} isSmallThumbnail={true} />
									</li>
								))}
							</ul>
						)}
					</div>
				</>
			)}

			{keywordarticledata && keywordarticledata.length > 0 && (
				<>
					<h3 className="text-center pt-4 text-xl">関連記事</h3>
					<div className="mt-1.5 p-0.5 bg-blue-50 rounded-md">
						<ul>
							{keywordarticledata.map((keyarti: KeywordArticle) => (
								<li key={keyarti.id} className="p-1.5">
									<ArticleCard article={keyarti} isSmallThumbnail={true} />
								</li>
							))}
						</ul>
					</div>
				</>
			)}
		</>
	)
}

export default ArticleLoad
