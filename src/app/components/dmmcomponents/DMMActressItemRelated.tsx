import { useEffect, useState } from 'react'
import Link from 'next/link'
import { z } from 'zod'
import { fetchActressRelatedItem } from '../dmmcomponents/fetch/itemFetchers'
import { formatDate } from '@/utils/dmmUtils'

const ItemSchema = z.object({
	db_id: z.number(),
	content_id: z.string(),
	title: z.string(),
	url: z.string(),
	affiliate_url: z.string(),
	release_date: z.string(),
	imageURL: z.string()
})

type ActressRelatedItem = z.infer<typeof ItemSchema>

const ActressRelatedItemCard = ({ item }: { item: ActressRelatedItem }) => {
	return (
		<div className="bg-white rounded-lg overflow-hidden transition duration-300 ease-in-out transform shadow-md flex flex-col h-full">
			<Link href={`/item/${item.db_id}`}>
				<div className="relative pt-[56.25%] overflow-hidden bg-gray-100">
					<img src={item.imageURL} alt={item.title} className="absolute top-0 left-0 w-full h-full object-contain" />
				</div>
				<div className="p-4 flex flex-col flex-grow">
					<h2 className="text-lg font-semibold mb-2 line-clamp-2 h-14" title={item.title}>
						{item.title}
					</h2>
					<p className="text-sm text-gray-600 mb-2">発売日: {formatDate(item.release_date)}</p>
				</div>
			</Link>
		</div>
	)
}

const ActressRelatedItems = async ({ actressName }: { actressName: string }) => {
	if (!actressName) {
		return <div>女優名が指定されていません。</div>
	}

	const ActressItemsResult = await fetchActressRelatedItem(actressName)

	if (ActressItemsResult === null) {
		return
	}

	const ActressItemsSchema = z.array(ItemSchema)
	const parseResult = ActressItemsSchema.safeParse(ActressItemsResult)

	if (!parseResult.success) {
		console.error('データの検証に失敗しました:', parseResult.error)
		return (
			<div className="text-center p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
				<p>データの形式が正しくありません。</p>
				<p>管理者にお問い合わせください。</p>
			</div>
		)
	}

	const ActressItems = parseResult.data

	return (
		<div className="bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg p-4 sm:p-4 md:p-8 transition duration-300 ease-in-out">
			<h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
				<span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
					{actressName}の関連作品
				</span>
			</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{ActressItems.map((item) => (
					<ActressRelatedItemCard key={item.db_id} item={item} />
				))}
			</div>
		</div>
	)
}

export default ActressRelatedItems
