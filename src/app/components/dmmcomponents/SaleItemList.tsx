// /Volumes/SSD_1TB/erice2/erice/src/app/components/dmmcomponents/SaleItemList.tsx

'use client'

import { useState } from 'react'
import { DMMSaleItem } from '../../../../types/dmmtypes'
import Link from 'next/link'

// PriceDisplay コンポーネント：価格表示部分
// listPrice: 定価 (number 型)
// salePrice: 販売価格 (number 型)
function PriceDisplay({ listPrice, salePrice }: { listPrice: string | undefined; salePrice: string }) {
	return (
		<div className="mb-2">
			<span className="text-gray-500 line-through mr-2">{listPrice}</span>
			<span className="text-red-600 font-bold">{salePrice}</span>
		</div>
	)
}

// GenreTag コンポーネント：ジャンルタグ表示部分
// genre: ジャンル名 (string 型)
function GenreTag({ genre }: { genre: string[] }) {
	return (
		<>
			{genre.map((genreItem, index) => (
				<span
					key={index}
					className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mr-2 transition-all duration-300 hover:bg-blue-200 "
				>
					{genreItem}
				</span>
			))}
		</>
	)
}

// SaleItemCard コンポーネント：個々の商品カード表示部分
// item: 商品情報 (DMMSaleItem 型)
function SaleItemCard({ item }: { item: DMMSaleItem }) {
	// console.log('SaleItemCard item: ', item)

	return (
		<div className="bg-white shadow-lg rounded-lg overflow-hidden transition duration-300 ease-in-out transform flex flex-col h-full">
			<Link href={`/item/${item.content_id}`}>
				<div className="relative pt-[56.25%] overflow-hidden bg-gray-100">
					{' '}
					{/* 16:9のアスペクト比 */}
					<img
						src={item.imageURL?.toString() || ''}
						alt={item.title}
						className="absolute top-0 left-0 w-full h-full object-contain"
					/>
				</div>
				<div className="p-4 flex flex-col flex-grow">
					<h2 className="text-lg font-semibold mb-2 line-clamp-2 h-14" title={item.title}>
						{item.title}
					</h2>
					<PriceDisplay listPrice={item.salecount} salePrice={item.salePrice} />
					<p className="text-sm text-gray-600 mb-2 line-clamp-1" title={item.actress}>
						{item.actress ? `出演: ${item.actress}` : ''}
					</p>
					{/* <div className="flex flex-wrap gap-1 mt-2 overflow-hidden flex-grow">
					<GenreTag genre={Array.isArray(item.genre) ? item.genre : []} />
				</div> */}
				</div>
			</Link>
		</div>
	)
}

// SaleItemList コンポーネント：商品リスト全体表示部分
// items: 商品情報の配列 (DMMSaleItem[] 型)
export default function SaleItemList({ items }: { items: DMMSaleItem[] }) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-3">
			{items.slice(0, 5).map((item) => (
				<div key={item.content_id}>
					<SaleItemCard item={item} />
				</div>
			))}
		</div>
	)
}
