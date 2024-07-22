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
			<div onClick={handleClick}>
				{/* 2024/07/22 リンク除外設定にした <Link href={article.link} passHref className="hover:underline" target="_blank" rel="noopener noreferrer"> */}
				<h1 className="text-gray-600 text-2xl sm:text-4xl py-4">{article.title}</h1>
				{/* </Link> */}
			</div>

			<ArticleKeywords keywords={article.keywords} />

			<div className="text-lg p-5 m-1 text-slate-700 text-center font-semibold rounded-md bg-red-50">
				<h3 onClick={handleClick}>
					<Link href={article.link} target="_blank">
						{article.title}のページを見る
					</Link>
				</h3>
			</div>
		</>
	)
})

ArticleLinks.displayName = 'ArticleLinks'

export default ArticleLinks
