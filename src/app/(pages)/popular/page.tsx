import React from 'react'
import { getPopularArticles } from '../../components/fetch/GetPopularArticles'
import ArticleCard from '../../components/Article/ArticleCard'
import { PopularArticlesResponse } from '../../../../types/types'

export default async function PopularArticlesPage() {
	const popularArticles = await getPopularArticles()
	// 人気記事の順位を付ける
	const rankedArticles = popularArticles.data.articles.map((article, index) => ({
		...article,
		rank: index + 1
	}))

	// ランキングを表示するための関数
	const renderRanking = (rank: number) => {
		const bgColor =
			rank === 1 ? 'bg-yellow-400' : rank === 2 ? 'bg-gray-300' : rank === 3 ? 'bg-orange-300' : 'bg-gray-100'
		return (
			<div
				className={`absolute top-2 left-2 ${bgColor} text-gray-800 font-bold w-8 h-8 flex items-center justify-center rounded-full shadow-md z-10`}
			>
				{rank}
			</div>
		)
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="pb-2 text-3xl font-bold text-center pt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
				人気動画ランキング
			</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{rankedArticles.map((article) => (
					<div key={article.id} className="relative">
						{renderRanking(article.rank)}
						<ArticleCard article={article} />
					</div>
				))}
			</div>
		</div>
	)
}
