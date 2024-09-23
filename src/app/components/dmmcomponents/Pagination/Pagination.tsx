'use client'

import { PaginationItem } from '@/_types_doujin/doujintypes'
import { DMMItemProps, ImageURLs } from '@/types/dmmtypes'
import Link from 'next/link'
import PaginationComponent from '../../Pagination'

export type ItemType = 'todaynew' | 'debut' | 'feature' | 'sale' | 'actress' | 'genre'

interface DMMItemContainerPaginationProps {
	items: DMMItemProps[] | PaginationItem[]
	currentPage: number
	totalPages: number
	category: string | undefined
	categoryType: 'actress' | 'genre' | 'style' | 'type' | 'doujinpagination'
}

// 型ガード関数
function isDMMItemProps(item: DMMItemProps | PaginationItem): item is DMMItemProps {
	return 'imageURL' in item
}

export default function DMMItemContainerPagination({
	items,
	currentPage,
	totalPages,
	category,
	categoryType,
}: DMMItemContainerPaginationProps) {
	console.log('DMMItemContainerPagination categoryType:', categoryType)
	if (!items || items.length === 0) {
		return null
	}

	const gradients = {
		actress: 'from-blue-50 to-purple-50',
		genre: 'from-green-50 to-blue-50',
		style: 'from-yellow-50 to-orange-50',
		type: 'from-red-50 to-pink-50',
		doujinpagination: 'from-pink-50 to-red-50',
	}

	const titles = {
		actress: `${category}の動画`,
		genre: `${category}の動画`,
		style: `${category}の動画`,
		type: `${category}の動画`,
		doujinpagination: `${category}の同人作品一覧`,
	}

	const getImageURL = (imageURL: string | ImageURLs): string => {
		if (typeof imageURL === 'object' && imageURL !== null) {
			return imageURL.large ?? imageURL.small ?? imageURL.list ?? ''
		}
		return imageURL || ''
	}

	const getItemLink = (dbId: string | number) => {
		return categoryType === 'doujinpagination' ? `/doujin/itemd/${dbId}` : `/item/${dbId}`
	}

	return (
		<div
			className={`bg-gradient-to-r ${gradients[categoryType]} shadow-lg p-4 sm:p-4 md:p-8 transition duration-300 ease-in-out`}>
			<div className='text-center mb-8'>
				<h2 className='text-4xl font-extrabold mb-4'>
					<span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500'>
						{titles[categoryType]}
					</span>
				</h2>
			</div>
			<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
				{items.map(item => (
					<div key={item.db_id} className='bg-white dark:bg-gray-800 shadow-md overflow-hidden'>
						<Link href={getItemLink(item.db_id)} className='block'>
							<div className='relative aspect-[3/2] w-full'>
								{isDMMItemProps(item)
									? item.imageURL && (
											<img
												src={getImageURL(item.imageURL)}
												alt={item.title}
												className='w-full h-full object-contain transition-transform duration-300'
											/>
										)
									: item.package_images && (
											<img
												src={item.package_images}
												alt={item.title}
												className='w-full h-full object-contain transition-transform duration-300'
											/>
										)}
								{!(
									(isDMMItemProps(item) && item.imageURL) ||
									(!isDMMItemProps(item) && item.package_images)
								) && (
									<div className='w-full h-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center'>
										<span className='text-gray-500 dark:text-gray-400'>画像なし</span>
									</div>
								)}
							</div>
						</Link>
						<div className='p-4'>
							<h3 className='text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2 hover:underline'>
								<Link href={getItemLink(item.db_id)}>{item.title}</Link>
							</h3>
							{/* ... 他の情報を表示 ... */}
						</div>
					</div>
				))}
			</div>
			<PaginationComponent
				currentPage={currentPage}
				totalPages={totalPages}
				category={category}
				categoryType={categoryType}
			/>
		</div>
	)
}
