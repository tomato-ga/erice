'use client'

// src/app/components/dmmcomponents/DMMItemList.tsx

import Link from 'next/link'
import { ItemType } from '@/types/dmmtypes'
import { DMMItemProps } from '@/types/dmmtypes'

// PriceDisplay コンポーネント：価格表示部分
// listPrice: 定価 (number 型)
// salePrice: 販売価格 (number 型)
const PriceDisplay = ({ listPrice, salePrice }: { listPrice: string | undefined; salePrice: string }) => {
	return (
		<div className="mb-2">
			<span className="text-gray-500 line-through mr-2">{listPrice}</span>
			<span className="text-red-600 font-bold">{salePrice}</span>
		</div>
	)
}
// GenreTag コンポーネント：ジャンルタグ表示部分
// genre: ジャンル名 (string 型)
const GenreTag = ({ genre }: { genre: string[] }) => {
	return (
		<>
			{genre.map((genreItem, index) => (
				<span
					key={index}
					className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2 inline-block transition-all duration-300 hover:bg-blue-200"
				>
					{genreItem}
				</span>
			))}
		</>
	)
}

// DMMItemCard コンポーネント：個々の商品カード表示部分
// item: 商品情報 (T )
const DMMItemCard = <T extends DMMItemProps>({ item, itemType }: { item: T; itemType: ItemType }) => {
	return (
		<div className="bg-white rounded-lg overflow-hidden transition duration-300 ease-in-out transform shadow-md flex flex-col h-full">
			<Link
				href={
					itemType === 'genre' || itemType === 'actress'
						? `/item/${item.db_id}`
						: `/item/${item.db_id}?itemType=${itemType}`
				}
			>
				<div className="relative overflow-hidden bg-gray-100 p-4">
					<img
						src={item.imageURL?.toString() || ''}
						alt={item.title}
						className="w-full h-auto min-h-[200px] object-contain"
					/>
				</div>
				<div className="p-4 flex flex-col flex-grow">
					<h2 className="text-lg font-semibold mb-2 line-clamp-2 h-14" title={item.title}>
						{item.title}
					</h2>
					{'salecount' in item && 'salePrice' in item && (
						<PriceDisplay listPrice={item.salecount} salePrice={item.salePrice!} />
					)}
					{!('salecount' in item && 'salePrice' in item) && item.price && (
						<div className="mb-2">
							<span className="text-red-600 font-bold">
								{item.price.match(/\d+~円/) ? item.price : item.price.replace(/~/, '円〜')}
							</span>
						</div>
					)}
					<p className="text-sm text-gray-600 mb-2 line-clamp-1" title={item.actress}>
						{item.actress ? `出演: ${item.actress}` : ''}
					</p>
					{/* TODO 一旦外してる　<div className="flex flex-wrap mt-2 overflow-hidden flex-grow">
						<GenreTag genre={Array.isArray(item.genre) ? item.genre : []} />
					</div> */}
				</div>
			</Link>
		</div>
	)
}

// DMMItemList コンポーネント：商品リスト全体表示部分
// items: 商品情報の配列 (T[] 型)
const DMMItemList = <T extends DMMItemProps>({
	items,
	itemType,
	from
}: {
	items: T[]
	itemType: ItemType
	from: string
}) => {
	const displayCount = from === 'top' ? 8 : items.length

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
			{items.slice(0, displayCount).map((item) => (
				<div key={item.content_id}>
					<DMMItemCard item={item} itemType={itemType} />
				</div>
			))}
		</div>
	)
}

export default DMMItemList
