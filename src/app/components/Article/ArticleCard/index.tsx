import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { HomePageArticle } from '../../../../../types/types'
import { formatDate } from '@/app/utils/postUtils'

interface ArticleCardProps {
	article: HomePageArticle
}

const ArticleCard: React.FC<ArticleCardProps> = React.memo(({ article }) => {
	return (
		<div className="bg-white rounded-lg overflow-hidden shadow m-2 h-full flex flex-col justify-between">
			<Link href={`/post/${article.id}`} className="flex flex-col h-full">
				<div className="relative w-full h-48">
					{article.image_url ? (
						<Image
							src={article.image_url}
							alt={article.title}
							fill
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
							className="object-cover"
						/>
					) : (
						<div className="w-full h-full bg-gray-200 flex items-center justify-center">
							<span>No Image</span>
						</div>
					)}
				</div>
				<div className="px-4 py-4 flex-grow">
					<h2 className="text-black text-lg md:text-xl mb-2 mt-2">{article.title}</h2>
				</div>
				<div className="px-4 py-4 mt-auto">
					<div className="flex justify-between items-center">
						<p className="text-gray-600 text-xs md:text-sm">{formatDate(article.created_at)}</p>
					</div>
				</div>
			</Link>
		</div>
	)
})

ArticleCard.displayName = 'ArticleCard'

export default ArticleCard
