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
		actress: 'from-blue-50 to-purple-50'
	}

	const titles = {
		actress: `${actress}の動画`
	}

	const itemType = 'actress' // デフォルト値を設定

	return (
		<div
			className={`bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg p-4 sm:p-4 md:p-8 transition duration-300 ease-in-out`}
		>
			<div className="text-center mb-8">
				<h2 className="text-4xl font-extrabold mb-4">
					<span className={`text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500`}>
						{titles[itemType]}
					</span>
				</h2>
			</div>
			<DMMItemList items={items} itemType={itemType} from="pagination" />
			<PaginationComponent currentPage={currentPage} totalPages={totalPages} actress={actress} />{' '}
			{/* actress={actress} を削除 */}
		</div>
	)
}
