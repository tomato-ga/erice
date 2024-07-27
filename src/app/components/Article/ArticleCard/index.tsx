'use client'

import React from 'react'
import { HomePageArticle, RelatedArticle } from '../../../../../types/types'
import { handlePageClickCount } from '../../handleclick'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { handleUmamiClick } from '@/lib/umamiTracking'

const FavoriteButton = dynamic(() => import('../../Fav/FavButton'), { ssr: false })

interface ArticleCardProps {
	article: HomePageArticle | RelatedArticle
	isSmallThumbnail?: boolean
	source?: 'Top' | 'Pagination' | 'Popular' | 'Kobetu-Recently' | 'TagPagination' | 'Kobetu-Related'
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, isSmallThumbnail = false, source = '' }) => {
	const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
		e.preventDefault()
		handlePageClickCount(article.id).catch((error) => console.error('Failed to record click:', error))

		handleUmamiClick(source, article)
	}

	return (
		<div className="relative">
			<div onClick={handleClick} className="block h-full cursor-pointer">
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
								{/* <FavoriteButton articleId={article.id} /> */}
							</div>
						</div>
					</div>
				</Link>
			</div>
		</div>
	)
}

function formatDate(dateString: string): string {
	const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
	return new Date(dateString).toLocaleDateString('ja-JP', options)
}

export default ArticleCard
