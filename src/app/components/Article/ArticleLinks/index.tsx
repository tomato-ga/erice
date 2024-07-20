'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { KobetuPageArticle } from '../../../../../types/types'
import ArticleKeywords from '../ArticleKeywords'
import { initDatabase, loadArticleViews, recordArticleView, ArticleView } from '../../../../lib/articleViewSync'

const ArticleLinks: React.FC<{ article: KobetuPageArticle }> = React.memo(({ article }) => {
	const [unsyncedArticles, setUnsyncedArticles] = useState<ArticleView[]>([])
	const isInitialMount = useRef(true)

	const writeArticleView = useCallback(async () => {
		try {
			await initDatabase()
			await recordArticleView(article.id)
			// console.log(`記事ID ${article.id} の閲覧が記録されました`)
		} catch (error) {
			// console.error('記事閲覧の記録に失敗しました:', error)
		}
	}, [article.id])

	const fetchUnsyncedArticles = useCallback(async () => {
		try {
			const loadedArticles = await loadArticleViews()
			setUnsyncedArticles(loadedArticles)
		} catch (error) {
			// console.error('未同期の記事の取得に失敗しました:', error)
			setUnsyncedArticles([])
		}
	}, [])

	useEffect(() => {
		let isMounted = true
		const fetchData = async () => {
			if (isMounted) {
				await writeArticleView()
				await fetchUnsyncedArticles()
			}
		}
		fetchData()
		return () => {
			isMounted = false
		}
	}, [article.id, writeArticleView, fetchUnsyncedArticles])

	useEffect(() => {
		if (isInitialMount.current) {
			isInitialMount.current = false
		} else {
			// console.log('未同期の記事数:', unsyncedArticles.length)
			// console.log('未同期の記事データ:', unsyncedArticles)
		}
	}, [unsyncedArticles])

	return (
		<>
			<div>
				<Link href={article.link} passHref className="hover:underline" target="_blank" rel="noopener noreferrer">
					<h1 className="text-gray-600 text-2xl sm:text-4xl py-4">{article.title}</h1>
				</Link>
			</div>

			<ArticleKeywords keywords={article.keywords} />

			<div className="text-2xl p-5 m-1 text-white text-center font-semibold hover:bg-orange-700 rounded-md bg-gradient-to-r from-pink-400 to-violet-900">
				<h3>
					<Link href={article.link} target="_blank">
						{article.title}のページを見る
					</Link>
				</h3>
			</div>

			{/* {unsyncedArticles.length > 0 && (
				<div className="mt-4 p-4 bg-yellow-100 rounded-md">
					<p>未同期の記事数: {unsyncedArticles.length}</p>
					<ul>
						{unsyncedArticles.map((unsynced) => (
							<li key={unsynced.id}>
								記事ID: {unsynced.articleId}, タイムスタンプ: {new Date(unsynced.timestamp).toLocaleString()}
							</li>
						))}
					</ul>
				</div>
			)} */}
		</>
	)
})

ArticleLinks.displayName = 'ArticleLinks'

export default ArticleLinks
