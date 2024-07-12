'use client'

import React from 'react'
import Link from 'next/link'
import { HomePageArticle } from '../../../../../types/types' // 適切なパスに調整してください

import { handleClickCount } from '../../handleclick'

interface ArticleCardProps {
	article: HomePageArticle
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
	const handleClick = () => {
		handleClickCount(article.id).catch((error) => console.error('Failed to record click:', error))
	}

	return (
		<div onClick={() => handleClick()}>
			<Link href={`/post/${article.id}`} className="block h-full">
				<div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
					<div className="relative pb-[56.25%]">
						<img src={article.image_url} alt={article.title} className="absolute inset-0 w-full h-full object-cover" />
					</div>
					<div className="p-4 flex-grow">
						<h2 className="text-lg font-semibold mb-2 line-clamp-2">{article.title}</h2>
						<p className="text-sm text-gray-600">{new Date(article.created_at).toLocaleDateString()}</p>
					</div>
				</div>
			</Link>
		</div>
	)
}

export default ArticleCard
