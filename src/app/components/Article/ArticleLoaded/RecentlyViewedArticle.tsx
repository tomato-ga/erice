'use client'

import { useArticleViewStore } from '@/app/stores/articleViewStore'
import { useEffect } from 'react'
import { RelatedArticle } from '../../../../../types/types'
import ArticleCard from '../ArticleCard'
import { handleUmamiClick } from '@/lib/umamiTracking'

const RecentlyViewedArticles: React.FC = () => {
	const { articles, isLoading, error, fetchArticles } = useArticleViewStore()

	useEffect(() => {
		fetchArticles()
	}, [fetchArticles])

	if (isLoading) return <p>最近チェックした動画を読み込んでいます...</p>
	if (error) return <p className="text-red-500">{error}</p>

	if (articles.length === 0) return <p>最近チェックした動画がありません</p>

	return (
		<>
			<h3 className="text-3xl font-bold text-center pt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
				最近チェックした動画
			</h3>
			<div className="mt-1.5 p-0.5 rounded-md bg-gradient-to-b from-pink-100 to-pink-200">
				<ul>
					{articles.slice(0, 5).map((article: RelatedArticle) => (
						<li
							key={article.id}
							className="p-1.5"
							onClick={() => handleUmamiClick('Kobetu-RecentlyViewedArticle', 'Recently', article)}
						>
							<ArticleCard article={article} isSmallThumbnail={true} />
						</li>
					))}
				</ul>
			</div>
		</>
	)
}

export default RecentlyViewedArticles
