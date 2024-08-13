'use client'

import Link from 'next/link'
import { DMMItemProps } from '../../../../../types/dmmtypes'
import DMMItemList from '../DMMItemList'
import { ArrowRight } from 'lucide-react'
import PaginationComponent from '../../Pagination'

export type ItemType = 'todaynew' | 'debut' | 'feature' | 'sale' | 'actress'

interface DMMItemContainerPaginationProps {
	items: DMMItemProps[]
	currentPage: number
	totalPages: number
	actress: string
}

export default function DMMItemContainerPagination({
	items,
	currentPage,
	totalPages,
	actress
}: DMMItemContainerPaginationProps) {
	if (!items || items.length === 0) {
		return null
	}

	const gradients = {
		todaynew: 'from-green-500 to-blue-500',
		debut: 'from-yellow-500 to-red-500',
		feature: 'from-pink-500 to-purple-500',
		sale: 'from-blue-500 to-purple-500',
		actress: 'from-blue-500 to-purple-500'
	}

	const titles = {
		todaynew: '今日配信の新作',
		debut: 'デビュー作品',
		feature: '注目作品',
		sale: '限定セール',
		actress: 'アクトレス'
	}

	const linkTexts = {
		todaynew: '全ての新作商品を見る',
		debut: '全てのデビュー作品を見る',
		feature: '全ての注目作品を見る',
		sale: '全ての限定セール商品を見る',
		actress: '全てのアクトレスを見る'
	}

	const itemType = 'actress' // デフォルト値を設定

	return (
		<div
			className={`bg-gradient-to-r ${gradients[itemType]} shadow-lg p-4 sm:p-4 md:p-8 transition duration-300 ease-in-out`}
		>
			<div className="text-center mb-8">
				<h2 className="text-4xl font-extrabold mb-4">
					<span className={`text-transparent bg-clip-text bg-gradient-to-r ${gradients[itemType]}`}>
						{titles[itemType]}
					</span>
				</h2>
				<Link
					href={`/${itemType}`}
					className={`inline-flex items-center px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r ${
						gradients[itemType]
					}  shadow-lg transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-${
						gradients[itemType].split('-')[1]
					}-400 focus:ring-opacity-50`}
				>
					{linkTexts[itemType]}
					<ArrowRight className="ml-2 h-5 w-5 animate-bounce" />
				</Link>
			</div>
			<DMMItemList items={items} itemType={itemType} from="pagination" />
			<PaginationComponent currentPage={currentPage} totalPages={totalPages} actress={actress} />{' '}
			{/* actress={actress} を削除 */}
		</div>
	)
}
