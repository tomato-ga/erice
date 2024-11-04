import { ExtendedDMMItem, ItemType } from '@/types/dmmtypes'
import Link from 'next/link'
import React from 'react'

interface RelatedItemsScrollProps {
	items: ExtendedDMMItem[]
	itemType: ItemType
	title: string
}

const RelatedItemsScroll: React.FC<RelatedItemsScrollProps> = ({ items, itemType, title }) => {
	const gradients: Record<ItemType, string> = {
		todaynew: 'from-green-500 to-blue-500',
		debut: 'from-yellow-500 to-red-500',
		feature: 'from-pink-500 to-purple-500',
		sale: 'from-blue-500 to-purple-500',
		actress: 'from-blue-500 to-purple-500',
		genre: 'from-blue-500 to-purple-500',
		last7days: 'from-yellow-500 to-red-500',
		top100: 'from-purple-500 to-pink-500',
	}

	// 画像URLを取得する関数
	const getImageUrl = (item: ExtendedDMMItem): string => {
		if (typeof item.imageURL === 'string') {
			return item.imageURL
		}
		return item.imageURL?.large ?? ''
	}

	return (
		<div className='relative'>
			<h3 className='text-2xl font-extrabold mb-4'>
				<span className={`text-transparent bg-clip-text bg-gradient-to-r ${gradients[itemType]}`}>
					{title}
				</span>
			</h3>
			<div className='relative overflow-hidden'>
				<div
					className='flex overflow-x-auto space-x-4 scrollbar-hide scroll-smooth'
					style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
					{items.map(item => (
						<div key={item.db_id} className='flex-none w-64'>
							<Link href={`/item/${item.db_id}`} prefetch={true}>
								<div className='bg-white overflow-hidden'>
									<img
										src={getImageUrl(item)}
										alt={item.title}
										className='w-full h-40 object-contain'
										loading='lazy'
									/>
									<div className='p-4'>
										<h4 className='text-sm font-semibold mb-2 line-clamp-2'>{item.title}</h4>
										<p className='text-xs text-gray-600'>
											{item.prices?.price
												? item.prices.price.match(/\d+~円/)
													? item.prices.price
													: item.prices.price.replace(/~/, '円〜')
												: ''}
										</p>
									</div>
								</div>
							</Link>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default RelatedItemsScroll
