'use client'

import React, { useEffect, useCallback } from 'react'
import Link from 'next/link'
import { KobetuPageArticle } from '../../../../../types/types'
import ArticleKeywords from '../ArticleKeywords'
import { handleEXClickCount } from '../../handleexclick'
import { initDatabase, recordArticleView, syncArticleKV } from '../../../../lib/articleViewSync'
import { initKeywordDatabase, recordKeywordView, syncKeywordKV } from '../../../../lib/keywordViewSync'
import { BreadcrumbWithCustomSeparator } from '../../Breadcrumb'

const ArticleLBasic: React.FC<{ article: KobetuPageArticle }> = ({ article }) => {
	const recordArticles = useCallback(async () => {
		try {
			await initDatabase()
			const recordResult = await recordArticleView(article.id)

			if (recordResult.process) {
				await syncArticleKV()
			}
		} catch (err) {
			// エラー処理は必要に応じて実装
		}
	}, [article.id])

	const recordKeywords = useCallback(async () => {
		try {
			await initKeywordDatabase()
			let shouldSync = false

			for (const keyword of article.keywords) {
				const recordResult = await recordKeywordView(keyword.id)
				if (recordResult.process) {
					shouldSync = true
				}
			}
			if (shouldSync) {
				await syncKeywordKV()
			}
		} catch (err) {
			console.error('キーワードの記録中にエラーが発生しました:', err)
		}
	}, [article.keywords])

	useEffect(() => {
		recordArticles()
		recordKeywords()
	}, [recordArticles, recordKeywords])

	const handleClick = async () => {
		try {
			await handleEXClickCount(article.id)
		} catch (err) {
			// console.error('クリックの記録に失敗しました:', err)
		}
	}

	const breadcrumbItems = [
		{ href: '/', label: 'ホーム' },
		{ href: `/tag/${article.keywords[0].keyword}`, label: article.keywords[0].keyword },
		{ label: article.title }
	]

	return (
		<article className="flex flex-col space-y-4">
			<div className="bg-white p-2">
				<BreadcrumbWithCustomSeparator items={breadcrumbItems} />
			</div>
			<div className="relative">
				<Link href={article.link} target="_blank" rel="noopener" onClick={handleClick}>
					<img src={article.image_url} alt={article.title} className="w-full h-auto rounded-lg" />
				</Link>
			</div>

			<div className="flex items-center space-x-4">
				<img src={article.image_url || '/default-avatar.jpg'} alt={article.title} className="w-12 h-12 rounded-full" />
				<div>
					<p className="text-gray-600 text-sm">{new Date(article.created_at).toLocaleDateString()}</p>
					<p className="text-gray-600 text-sm">{article.site_name}</p>
				</div>
			</div>

			<h1 className="text-gray-600 font-semibold text-2xl sm:text-4xl">{article.title}</h1>

			<ArticleKeywords keywords={article.keywords} />

			<Link href={article.link} target="_blank" rel="noopener" onClick={handleClick}>
				<div className="text-lg p-5 text-slate-700 text-center font-semibold rounded-md bg-red-50">
					{article.title}のページを見る
				</div>
			</Link>
		</article>
	)
}

export default ArticleLBasic
