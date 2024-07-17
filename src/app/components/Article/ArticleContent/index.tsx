'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { KobetuPageArticle } from '../../../../../types/types'
import ArticleKeywords from '../ArticleKeywords'
import { initDataSyncManager, getDataSyncManager } from '../../../../lib/dataSync'

const ArticleLinks: React.FC<{ article: KobetuPageArticle }> = ({ article }) => {
	const [isDataSyncManagerReady, setIsDataSyncManagerReady] = useState(false)

	useEffect(() => {
		console.log('ArticleLinks: コンポーネントがマウントされました。')
		initDataSyncManager()
		setIsDataSyncManagerReady(true)
	}, [])

	useEffect(() => {
		if (isDataSyncManagerReady) {
			console.log(`ArticleLinks: 記事ID ${article.id} のuseEffectが実行されました。`)
			const dataSyncManager = getDataSyncManager()
			if (dataSyncManager) {
				console.log(`ArticleLinks: 記事ID ${article.id} の閲覧をDataSyncManagerに記録します。`)
				dataSyncManager.addArticleView(article.id)
			} else {
				console.warn('ArticleLinks: DataSyncManagerが利用できません。閲覧履歴の記録をスキップします。')
			}
		}
	}, [article.id, isDataSyncManagerReady])

	console.log(`ArticleLinks: 記事「${article.title}」のレンダリングを開始します。`)

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
		</>
	)
}

console.log('ArticleLinks: コンポーネントの定義が完了しました。')

export default ArticleLinks
