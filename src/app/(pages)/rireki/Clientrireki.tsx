'use client'

import React, { useEffect, useState } from 'react'
import { getUserId } from '@/lib/dataSync'
import ArticleCard from '../../components/Article/ArticleCard'
import { RirekiArticle, RirekiArticleResponse } from '../../../../types/types'

export default function ClientRirekiComp() {
	const [sortedArticles, setSortedArticles] = useState<RirekiArticle[]>([])

	useEffect(() => {
		const fetchRirekiArticles = async () => {
			try {
				const userId = await getUserId()
				const response = await fetch(`/api/load-rireki?userId=${userId}`, {
					cache: 'no-store'
				})
				if (!response.ok) {
					throw new Error('APIレスポンスが正常ではありません')
				}
				const rirekiArticles: RirekiArticleResponse = await response.json()

				console.log('rirekiArticles: ', rirekiArticles)

				// timestampの降順でソート
				const sorted = rirekiArticles.history.sort((a, b) => b.timestamp - a.timestamp)
				setSortedArticles(sorted)
			} catch (error) {
				console.error('履歴の取得中にエラーが発生しました:', error)
				return
			}
		}

		fetchRirekiArticles()
	}, [])

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			{sortedArticles.map((article) => (
				<div key={article.id} className="relative">
					<ArticleCard article={article} />
				</div>
			))}
		</div>
	)
}
