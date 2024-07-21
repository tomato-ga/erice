'use client'

import React from 'react'
import Link from 'next/link'
import { HomePageArticle, RelatedArticle } from '../../../../../types/types'
import { handlePageClickCount } from '../../handleclick'

interface ArticleCardProps {
	article: HomePageArticle | RelatedArticle
	isSmallThumbnail?: boolean
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, isSmallThumbnail = false }) => {
	const handleClick = () => {
		handlePageClickCount(article.id).catch((error) => console.error('Failed to record click:', error))
	}

	return (
		<div onClick={handleClick}>
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
					<div className={`p-4 flex-grow ${isSmallThumbnail ? 'w-2/3' : ''}`}>
						<h2 className={`font-semibold mb-2 line-clamp-2 text-lg`}>{article.title}</h2>
						<p className="text-sm text-gray-600">{new Date(article.created_at).toLocaleDateString()}</p>
					</div>
				</div>
			</Link>
		</div>
	)
}

export default ArticleCard
