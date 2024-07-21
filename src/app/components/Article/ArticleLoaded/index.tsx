'use client'

import React, { useCallback, useState, useEffect } from 'react'
import { ArticleView, loadArticleViews } from '@/lib/articleViewSync'
import ArticleCard from '../ArticleCard'
import { RelatedArticle } from '../../../../../types/types'

const ArticleLoad: React.FC = () => {
	const [loadArticles, setLoadArticles] = useState<ArticleView[]>([])
	const [articleDetails, setArticleDetails] = useState<RelatedArticle[]>([])
	const [isIndexedDBSupported, setIsIndexedDBSupported] = useState<boolean | null>(null)

	const isIndexedDBSupportedCheck = (): boolean => {
		try {
			return 'indexedDB' in window && !!window.indexedDB
		} catch (e) {
			console.error('IndexedDBのサポートチェック中にエラーが発生しました:', e)
			return false
		}
	}

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
		setIsIndexedDBSupported(isIndexedDBSupportedCheck())
		getLoadArticles().then(fetchArticleDetails)
	}, [getLoadArticles])

	return (
		<>
			<div className="mb-4 p-2 bg-blue-100 rounded-md">
				<p>
					IndexedDB サポート状況:{' '}
					{isIndexedDBSupported === null
						? '確認中...'
						: isIndexedDBSupported
						? 'サポートされています'
						: 'サポートされていません'}
				</p>
			</div>
			{articleDetails.length > 0 && (
				<>
					<h3 className="text-center pt-4 text-xl">閲覧履歴</h3>
					<div className="mt-4 p-4 bg-pink-50 rounded-md">
						<ul>
							{articleDetails.slice(0, 5).map((article: RelatedArticle) => (
								<li key={article.id} className="p-2">
									<ArticleCard article={article} isSmallThumbnail={true} />
									<div className="mt-2 p-2 border border-gray-300 rounded-md">
										<p>
											<strong>記事ID:</strong> {article.id}
											<br />
											<strong>タイトル:</strong> {article.title}
											<br />
										</p>
									</div>
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
