'use client'

import React, { useEffect } from 'react'
import { useArticleViewStore } from '@/app/stores/articleViewStore'
import ArticleCard from '../ArticleCard'
import { KeywordArticle, RelatedArticle } from '../../../../../types/types'
import PopularArticles from '../PopularArticle'

interface ArticleLoadProps {
	viewrireki?: boolean
	keywordarticledata?: KeywordArticle[] | null
}

const ArticleLoad: React.FC<ArticleLoadProps> = ({ viewrireki = false, keywordarticledata }) => {
	const { articles, isLoading, error, fetchArticles } = useArticleViewStore()

	useEffect(() => {
		window.scrollTo(0, 0)
		fetchArticles()
	}, [fetchArticles])

	if (isLoading) return <p>最近チェックした動画を読み込んでいます...</p>
	if (error) return <p className="text-red-500">{error}</p>

	return (
		<>
			{keywordarticledata && keywordarticledata.length > 0 && (
				<>
					<h3 className="text-3xl font-bold text-center pt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
						この動画を見た人はこんな動画を見ています
					</h3>
					{/* 濃い青から薄い青へのグラデーションに変更 */}
					<div className="mt-1.5 p-0.5 rounded-md bg-gradient-to-b from-pink-100 to-pink-200">
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

			{viewrireki && (
				<>
					<h3 className="text-3xl font-bold text-center pt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
						最近チェックした動画
					</h3>
					{/* bg-pink-50 を濃いピンクから薄いピンクへのグラデーションに変更 */}
					<div className="mt-1.5 p-0.5 rounded-md bg-gradient-to-b from-pink-100 to-pink-200">
						{articles.length === 0 ? (
							<p>最近チェックした動画がありません</p>
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
		</>
	)
}

export default ArticleLoad
