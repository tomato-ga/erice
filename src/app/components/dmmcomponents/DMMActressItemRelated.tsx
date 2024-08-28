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

const ActressRelatedItemTimelineCard = ({ item }: { item: ActressRelatedItem }) => {
	return (
		<div className="flex items-center mb-8">
			<div className="w-1/4 pr-4 flex justify-end">
				<div className="bg-white rounded-full p-3 shadow-md text-center">
					<span className="text-lg font-bold text-gray-800">{formatDate(item.release_date)}</span>
				</div>
			</div>
			<div className="w-3/4 pl-4">
				<Link href={`/item/${item.db_id}`}>
					<div className="bg-white rounded-lg overflow-hidden transition duration-300 ease-in-out transform shadow-lg">
						<div className="relative pt-[56.25%] overflow-hidden bg-gray-100">
							<img
								src={item.imageURL}
								alt={`${item.title} ${item.content_id}の画像です。`}
								className="absolute top-0 left-0 w-full h-full object-contain"
							/>
						</div>
						<div className="p-4">
							<h2 className="text-lg font-semibold mb-2 line-clamp-2" title={item.title}>
								{item.title}
							</h2>
						</div>
					</div>
				</Link>
			</div>
		</div>
	)
}

const ActressRelatedItems = async ({ actressName }: { actressName: string }) => {
	if (!actressName) {
		return <div>女優名が指定されていません。</div>
	}

	const ActressItemsResult = await fetchActressRelatedItem(actressName)

	if (ActressItemsResult === null) {
		return null
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
		<div className="bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg p-4 sm:p-8 md:p-12">
			<h2 className="text-3xl font-bold mb-12 text-center">
				<span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
					{actressName}の出演作品タイムライン
				</span>
			</h2>
			<div className="relative">
				<div className="absolute left-1/4 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500 to-pink-500"></div>
				{ActressItems.map((item) => (
					<ActressRelatedItemTimelineCard key={item.db_id} item={item} />
				))}
			</div>
		</div>
	)
}

export default ActressRelatedItems
