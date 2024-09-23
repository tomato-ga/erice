'use client'

import { handleUmamiClick } from '@/lib/umamiTracking'
import { DMMSaleItem } from '@/types/dmmtypes'
import { HomePageArticle, RelatedArticle } from '@/types/types'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import React from 'react'
import { handlePageClickCount } from '../../handleclick'

const FavoriteButton = dynamic(() => import('../../Fav/FavButton'), { ssr: false })

interface DMMArticleCardProps {
	item: DMMSaleItem
	isSmallThumbnail?: boolean
	source?: 'Top' | 'Pagination' | 'Popular' | 'Kobetu-Recently' | 'TagPagination' | 'Kobetu-Related'
}

const DMMArticleCard: React.FC<DMMArticleCardProps> = ({
	item,
	isSmallThumbnail = false,
	source = '',
}) => {
	// const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
	// 	e.preventDefault()
	// 	handlePageClickCount(article.id).catch((error) => console.error('Failed to record click:', error))

	// 	handleUmamiClick(source, article)
	// }

	return (
		<div className='relative'>
			<div className='block h-full cursor-pointer'>
				<Link href={`/post/${item.content_id}`} className='block h-full' prefetch={true}>
					<div
						className={`bg-white rounded-lg shadow-md overflow-hidden h-full flex ${
							isSmallThumbnail ? 'flex-row' : 'flex-col'
						}`}>
						<div className={`relative ${isSmallThumbnail ? 'w-1/3' : 'pb-[56.25%]'}`}>
							<img
								src={item.imageURL?.toString() || ''}
								alt={item.title}
								className={`${
									isSmallThumbnail
										? 'object-contain w-full h-full'
										: 'absolute inset-0 w-full h-full object-contain'
								}`}
							/>
						</div>
						<div className={`p-3 flex-grow ${isSmallThumbnail ? 'w-2/3' : ''}`}>
							<h2 className={'mb-2 line-clamp-2 text-lg'}>{item.title}</h2>
							<div className='flex justify-between items-center'>
								<p className='text-sm text-gray-600'>{formatDate(item.date || '')}</p>
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

export default DMMArticleCard
