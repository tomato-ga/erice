import { DMMRelatedGenreItem } from '@/types/dmm-campaignpage-types'
import { formatDate } from '@/utils/dmmUtils'
import Link from 'next/link'
import React from 'react'
import { fetchRelatedGenre } from './fetch/itemFetchers'

const RelatedGenre = async ({ genreName }: { genreName: string }) => {
	const relatedGenreData: DMMRelatedGenreItem | null = await fetchRelatedGenre(genreName)

	return (
		<>
			{relatedGenreData?.items && (
				<>
					<h3 className='text-2xl font-extrabold mb-4'>
						<span className='text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-green-500'>
							{genreName}の最新アイテム
						</span>
					</h3>
					<div className='grid grid-cols-2 gap-6'>
						{relatedGenreData.items.map(item => (
							<div key={item.id} className='bg-white dark:bg-gray-800 shadow-md overflow-hidden'>
								<Link href={`/item/${item.id}`} className='block'>
									<div className='relative aspect-[3/2] w-full'>
										{item.imageURL ? (
											<img
												src={item.imageURL}
												alt={item.title}
												className='w-full h-full object-contain transition-transform duration-300'
											/>
										) : (
											<div className='w-full h-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center'>
												<span className='text-gray-500 dark:text-gray-400'>画像なし</span>
											</div>
										)}
									</div>
								</Link>
								<div className='p-4'>
									<h3 className='text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2 hover:underline'>
										<Link href={`/item/${item.content_id}`}>{item.title}</Link>
									</h3>
									<p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
										発売日:{formatDate(item.release_date)}
									</p>
								</div>
							</div>
						))}
					</div>
				</>
			)}
		</>
	)
}

export default RelatedGenre
