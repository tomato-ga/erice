'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { KobetuPageArticle } from '../../../../../types/types'
import ArticleKeywords from '../ArticleKeywords'
import {
	initDatabase,
	loadArticleViews,
	recordArticleView,
	ArticleView,
	syncArticleKV
} from '../../../../lib/articleViewSync'
import { syncArticleViews } from '@/lib/loadArticle'
import { handleEXClickCount } from '../../handleexclick'

const ArticleLinks: React.FC<{ article: KobetuPageArticle }> = React.memo(({ article }) => {
	const handleClick = () => {
		handleEXClickCount(article.id).catch((error) => console.error('Failed to record click:', error))
	}

	const writeArticleView = useCallback(async () => {
		try {
			await initDatabase()
			const recordResult: { process: boolean } = await recordArticleView(article.id)
			if (recordResult.process === true) {
				syncArticleKV()
			}
			// console.log(`記事ID ${article.id} の閲覧が記録されました`)
		} catch (error) {
			// console.error('記事閲覧の記録に失敗しました:', error)
		}
	}, [article.id])

	useEffect(() => {
		let isMounted = true
		const fetchData = async () => {
			if (isMounted) {
				await writeArticleView()
			}
		}
		fetchData()
		return () => {
			isMounted = false
		}
	}, [article.id, writeArticleView])

	return (
		<>
			<div className="relative py-2">
				<Link href={article.link} target="_blank" onClick={handleClick} aria-label={`${article.title}の記事を開く`}>
					<img src={article.image_url} alt={article.title} className="w-full h-auto rounded-lg sm:rounded-lg" />
				</Link>
			</div>
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center">
					<img
						src={article.image_url || '/default-avatar.jpg'}
						alt={article.title}
						className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-4 cursor-pointer"
					/>

					<div>
						<p className="text-gray-600 text-sm">{new Date(article.created_at).toLocaleDateString()}</p>
						<p className="text-gray-600 text-sm">{article.site_name}</p>
					</div>
				</div>
			</div>

			<h1 className="text-gray-600 font-semibold text-2xl sm:text-4xl py-4">{article.title}</h1>

			<ArticleKeywords keywords={article.keywords} />

			<div className="text-lg p-5 m-1 text-slate-700 text-center font-semibold rounded-md bg-red-50">
				<Link href={article.link} target="_blank" onClick={handleClick} legacyBehavior>
					<a>{article.title}のページを見る</a>
				</Link>
			</div>
		</>
	)
})

ArticleLinks.displayName = 'ArticleLinks'

export default ArticleLinks
