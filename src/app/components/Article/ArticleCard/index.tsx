import React from 'react'
import Link from 'next/link'
import { HomePageArticle, RelatedArticle } from '../../../../../types/types'
import dynamic from 'next/dynamic'

const FavoriteButton = dynamic(() => import('../../Fav/FavButton'), { ssr: false })
const ArticleCardClient = dynamic(() => import('./ArticleCardClient'), { ssr: false })

interface ArticleCardProps {
	article: HomePageArticle | RelatedArticle
	isSmallThumbnail?: boolean
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, isSmallThumbnail = false }) => {
	return (
		<div className="relative">
			<Link href={`/post/${article.id}`} className="block h-full" prefetch={true}>
				<div
					className={`bg-white rounded-lg shadow-md overflow-hidden h-full flex ${
						isSmallThumbnail ? 'flex-row' : 'flex-col'
					}`}
				>
					<div className={`relative ${isSmallThumbnail ? 'w-1/3' : 'pb-[56.25%]'}`}>
						<img
							src={article.image_url}
							alt={article.title}
							className={`${
								isSmallThumbnail ? 'object-cover w-full h-full' : 'absolute inset-0 w-full h-full object-cover'
							}`}
						/>
					</div>
					<div className={`p-3 flex-grow ${isSmallThumbnail ? 'w-2/3' : ''}`}>
						<h2 className={`mb-2 line-clamp-2 text-lg`}>{article.title}</h2>
						<div className="flex justify-between items-center">
							<p className="text-sm text-gray-600">{formatDate(article.created_at)}</p>
							<FavoriteButton articleId={article.id} />
						</div>
					</div>
				</div>
			</Link>
			<ArticleCardClient article={article} />
		</div>
	)
}

function formatDate(dateString: string): string {
	const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
	return new Date(dateString).toLocaleDateString('ja-JP', options)
}

export default ArticleCard
