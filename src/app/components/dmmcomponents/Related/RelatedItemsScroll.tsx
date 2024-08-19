'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { DMMItemProps } from '@/types/dmmtypes'
import { ItemType } from '@/types/dmmtypes'
import { ArrowLeft, ArrowRight } from 'lucide-react'

interface RelatedItemsScrollProps {
	items: DMMItemProps[]
	itemType: ItemType
	title: string
}

const RelatedItemsScroll: React.FC<RelatedItemsScrollProps> = ({ items, itemType, title }) => {
	const scrollRef = useRef<HTMLDivElement>(null)
	const [shuffledItems, setShuffledItems] = useState<DMMItemProps[]>([])

	// アイテムをシャッフルする関数
	const shuffleArray = (array: DMMItemProps[]) => {
		const shuffled = [...array]
		for (let i = shuffled.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1))
			;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
		}
		return shuffled
	}

	// コンポーネントのマウント時にアイテムをシャッフル
	useEffect(() => {
		setShuffledItems(shuffleArray(items))
	}, [items])

	const gradients = {
		todaynew: 'from-green-500 to-blue-500',
		debut: 'from-yellow-500 to-red-500',
		feature: 'from-pink-500 to-purple-500',
		sale: 'from-blue-500 to-purple-500',
		actress: 'from-blue-500 to-purple-500',
		genre: 'from-blue-500 to-purple-500'
	}

	const scroll = (direction: 'left' | 'right') => {
		if (scrollRef.current) {
			const { current } = scrollRef
			const scrollAmount = current.clientWidth
			if (direction === 'left') {
				current.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
			} else {
				current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
			}
		}
	}

	return (
		<div className="relative">
			<h3 className={`text-2xl font-extrabold mb-4`}>
				<span className={`text-transparent bg-clip-text bg-gradient-to-r ${gradients[itemType]}`}>{title}</span>
			</h3>
			<div className="relative overflow-hidden">
				<div
					ref={scrollRef}
					className="flex overflow-x-auto space-x-4 scrollbar-hide scroll-smooth"
					style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
				>
					{shuffledItems.map((item) => (
						<div key={item.content_id} className="flex-none w-64">
							<Link href={`/item/${item.content_id}?itemType=${itemType}`}>
								<div className="bg-white overflow-hidden">
									<img src={item.imageURL} alt={item.title} className="w-full h-40 object-contain" />
									<div className="p-4">
										<h4 className="text-sm font-semibold mb-2 line-clamp-2">{item.title}</h4>
										<p className="text-xs text-gray-600">
											{item.price?.match(/\d+~円/) ? item.price : item.price?.replace(/~/, '円〜') ?? ''}
										</p>
									</div>
								</div>
							</Link>
						</div>
					))}
				</div>
				<button
					onClick={() => scroll('left')}
					className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2"
					aria-label="Scroll left"
				>
					<ArrowLeft className="w-6 h-6" />
				</button>
				<button
					onClick={() => scroll('right')}
					className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2"
					aria-label="Scroll right"
				>
					<ArrowRight className="w-6 h-6" />
				</button>
			</div>
		</div>
	)
}

export default RelatedItemsScroll
