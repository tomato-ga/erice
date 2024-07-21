'use client'

import React, { useCallback, useState, useEffect } from 'react'
import { ArticleView, loadArticleViews } from '@/lib/articleViewSync'
import ArticleCard from '../ArticleCard'
import { RelatedArticle } from '../../../../../types/types'

const ArticleLoad: React.FC = () => {
	const [loadArticles, setLoadArticles] = useState<ArticleView[]>([])
	const [articleDetails, setArticleDetails] = useState<RelatedArticle[]>([])

	const getLoadArticles = useCallback(async () => {
		try {
			const loadedArticles = await loadArticleViews()
			setLoadArticles(loadedArticles)
			return loadedArticles
		} catch (error) {
			console.error('未同期の記事の取得に失敗しました:', error)
			setLoadArticles([])
			return []
		}
	}, [])

	const fetchArticleDetails = async (articles: ArticleView[]) => {
		try {
			const response = await fetch('/api/load-articles', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ articleIds: articles.map((a) => a.articleId) })
			})

			if (!response.ok) {
				throw new Error('Failed to fetch article details')
			}

			const data = await response.json()
			setArticleDetails(data.articles.results)
			console.log('data', data)
		} catch (error) {
			console.error('記事詳細の取得に失敗しました:', error)
		}
	}

	useEffect(() => {
		getLoadArticles().then(fetchArticleDetails)
	}, [getLoadArticles])

	return (
		<>
			<h3 className="text-center pt-4 text-xl">閲覧履歴</h3>
			{articleDetails.length > 0 && (
				<div className="mt-4 p-4 bg-pink-50 rounded-md">
					<ul>
						{articleDetails.slice(0, 5).map((article: RelatedArticle) => (
							<div key={article.id} className="p-2">
								<ArticleCard article={article} isSmallThumbnail={true} />
							</div>
						))}
					</ul>
				</div>
			)}
		</>
	)
}

export default ArticleLoad
