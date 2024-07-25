'use client'

import React, { useEffect, useCallback } from 'react'
import Link from 'next/link'
import { KobetuPageArticle } from '../../../../../types/types'
import ArticleKeywords from '../ArticleKeywords'
import { handleEXClickCount } from '../../handleexclick'
import { initDatabase, recordArticleView, syncArticleKV } from '../../../../lib/articleViewSync'

const ArticleLinks: React.FC<{ article: KobetuPageArticle }> = ({ article }) => {
	const recordView = useCallback(async () => {
		console.log(`記事閲覧の記録を開始します: articleId=${article.id}`)
		try {
			console.log('データベースの初期化を開始します...')
			await initDatabase()
			console.log('データベースの初期化が完了しました')

			console.log(`記事閲覧をデータベースに記録します: articleId=${article.id}`)
			const recordResult = await recordArticleView(article.id)
			console.log(`記事閲覧の記録結果: ${JSON.stringify(recordResult)}`)

			if (recordResult.process) {
				console.log('Cloudflare KVとの同期を開始します...')
				await syncArticleKV()
				console.log('Cloudflare KVとの同期が完了しました')
			} else {
				console.log('記事閲覧の記録処理がスキップされました')
			}
		} catch (err) {
			console.error('記事閲覧の記録に失敗しました:', err)
			console.error('エラーの詳細:', JSON.stringify(err, null, 2))
		} finally {
			console.log(`記事閲覧の記録処理が完了しました: articleId=${article.id}`)
		}
	}, [article.id])

	useEffect(() => {
		recordView()
	}, [recordView])

	const handleClick = async () => {
		try {
			await handleEXClickCount(article.id)
		} catch (err) {
			console.error('クリックの記録に失敗しました:', err)
		}
	}

	return (
		<article className="flex flex-col space-y-4">
			<Link href={article.link} target="_blank" onClick={handleClick} rel="noopener">
				<div className="relative">
					<img src={article.image_url} alt={article.title} className="w-full h-auto rounded-lg" />
				</div>
			</Link>

			<div className="flex items-center space-x-4">
				<img src={article.image_url || '/default-avatar.jpg'} alt={article.title} className="w-12 h-12 rounded-full" />
				<div>
					<p className="text-gray-600 text-sm">{new Date(article.created_at).toLocaleDateString()}</p>
					<p className="text-gray-600 text-sm">{article.site_name}</p>
				</div>
			</div>

			<h1 className="text-gray-600 font-semibold text-2xl sm:text-4xl">{article.title}</h1>

			<ArticleKeywords keywords={article.keywords} />

			<Link href={article.link} target="_blank" onClick={handleClick} rel="noopener">
				<div className="text-lg p-5 text-slate-700 text-center font-semibold rounded-md bg-red-50">
					{article.title}のページを見る
				</div>
			</Link>
		</article>
	)
}

export default ArticleLinks
