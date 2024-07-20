'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { KobetuPageArticle } from '../../../../../types/types'
import ArticleKeywords from '../ArticleKeywords'
import { initDatabase, loadArticleViews, recordArticleView, ArticleView } from '../../../../lib/articleViewSync'

const ArticleLinks: React.FC<{ article: KobetuPageArticle }> = React.memo(({ article }) => {
	const [loadArticles, setloadArticles] = useState<ArticleView[]>([])
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

	//  MEMO 最近見た記事コンポーネントで使用する
	const getLoadArticles = useCallback(async () => {
		try {
			const loadedArticles = await loadArticleViews()
			setloadArticles(loadedArticles)
		} catch (error) {
			// console.error('未同期の記事の取得に失敗しました:', error)
			setloadArticles([])
		}
	}, [])

	useEffect(() => {
		let isMounted = true
		const fetchData = async () => {
			if (isMounted) {
				await writeArticleView()
				await getLoadArticles()
			}
		}
		fetchData()
		return () => {
			isMounted = false
		}
	}, [article.id, writeArticleView, getLoadArticles])

	useEffect(() => {
		if (isInitialMount.current) {
			isInitialMount.current = false
		} else {
			// console.log('未同期の記事数:', unsyncedArticles.length)
			// console.log('未同期の記事データ:', unsyncedArticles)
		}
	}, [getLoadArticles])

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

			{loadArticles.length > 0 && (
				<div className="mt-4 p-4 bg-yellow-100 rounded-md">
					<p>保存している記事数: {loadArticles.length}</p>
					<ul>
						{loadArticles.map((unsynced: any) => (
							<li key={unsynced.id}>
								記事ID: {unsynced.articleId}, タイムスタンプ: {new Date(unsynced.timestamp).toLocaleString()}
							</li>
						))}
					</ul>
				</div>
			)}
		</>
	)
})

ArticleLinks.displayName = 'ArticleLinks'

export default ArticleLinks
