'use client'

import Link from 'next/link'
import { DMMItemProps } from '@/types/dmmtypes'
import DMMItemList from '../DMMItemList'
import { ArrowRight } from 'lucide-react'
import PaginationComponent from '../../Pagination'

export type ItemType = 'todaynew' | 'debut' | 'feature' | 'sale' | 'actress' | 'genre' // genre を追加

interface DMMItemContainerPaginationProps {
	items: DMMItemProps[]
	currentPage: number
	totalPages: number
	category: string | undefined // actress または genre を保持
	categoryType: 'actress' | 'genre' | 'style' | 'type' // カテゴリーの種類を指定
}

export default function DMMItemContainerPagination({
	items,
	currentPage,
	totalPages,
	category, // actress または genre を受け取る
	categoryType // カテゴリーの種類を受け取る
}: DMMItemContainerPaginationProps) {
	if (!items || items.length === 0) {
		return null
	}

	const gradients = {
		actress: 'from-blue-50 to-purple-50',
		genre: 'from-green-50 to-blue-50',
		style: 'from-yellow-50 to-orange-50',
		type: 'from-red-50 to-pink-50'
	}

	const titles = {
		actress: `${category}の動画`,
		genre: `${category}の動画`,
		style: `${category}の動画`,
		type: `${category}の動画`
	}

	return (
		<div
			className={`bg-gradient-to-r ${gradients[categoryType]} shadow-lg p-4 sm:p-4 md:p-8 transition duration-300 ease-in-out`}
		>
			<div className="text-center mb-8">
				<h2 className="text-4xl font-extrabold mb-4">
					<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
						{titles[categoryType]}
					</span>
				</h2>
			</div>
			<DMMItemList items={items} itemType={categoryType} from="pagination" />
			<PaginationComponent
				currentPage={currentPage}
				totalPages={totalPages}
				category={category}
				categoryType={categoryType}
			/>
		</div>
	)
}
