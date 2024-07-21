'use client'

import React, { useCallback, useState, useEffect } from 'react'
import { ArticleView, loadArticleViews } from '@/lib/articleViewSync'
import ArticleCard from '../ArticleCard'
import { RelatedArticle } from '../../../../../types/types'

const ArticleLoad: React.FC = () => {
	const [loadArticles, setLoadArticles] = useState<ArticleView[]>([])
	const [articleDetails, setArticleDetails] = useState<RelatedArticle[]>([])
	const [isIndexedDBSupported, setIsIndexedDBSupported] = useState<boolean | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

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
			console.log('記事の読み込みを開始します')
			const loadedArticles = await loadArticleViews()
			console.log('読み込まれた記事:', loadedArticles)
			setLoadArticles(loadedArticles)
			return loadedArticles
		} catch (error) {
			console.error('未同期の記事の取得に失敗しました:', error)
			setError('記事の読み込みに失敗しました')
			setLoadArticles([])
			return []
		}
	}, [])

	const fetchArticleDetails = async (articles: ArticleView[]) => {
		if (articles.length === 0) {
			console.log('記事がありません。APIリクエストをスキップします。')
			setIsLoading(false)
			return
		}

		try {
			console.log('記事詳細の取得を開始します')
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
			console.log('取得した記事詳細:', data)
			setArticleDetails(data.articles.results)
		} catch (error) {
			console.error('記事詳細の取得に失敗しました:', error)
			setError('記事詳細の取得に失敗しました')
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		setIsIndexedDBSupported(isIndexedDBSupportedCheck())
		getLoadArticles()
			.then(fetchArticleDetails)
			.catch((error) => {
				console.error('エラーが発生しました:', error)
				setError('データの取得中にエラーが発生しました')
				setIsLoading(false)
			})
	}, [getLoadArticles])

	return (
		<>
			{isLoading ? (
				<p>データを読み込み中...</p>
			) : error ? (
				<p className="text-red-500">{error}</p>
			) : articleDetails.length > 0 ? (
				<>
					<h3 className="text-center pt-4 text-xl">閲覧履歴</h3>
					<div className="mt-4 p-4 bg-pink-50 rounded-md">
						<ul>
							{articleDetails.slice(0, 5).map((article: RelatedArticle) => (
								<li key={article.id} className="p-2">
									<ArticleCard article={article} isSmallThumbnail={true} />
								</li>
							))}
						</ul>
					</div>
				</>
			) : (
				<p>閲覧履歴がありません。</p>
			)}
		</>
	)
}

export default ArticleLoad
