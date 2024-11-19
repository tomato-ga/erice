// /src/app/components/doujincomponents/DMMDoujinFeaturedItemContainer.tsx

import { DoujinKVApiResponse, DoujinTopItem } from '@/_types_doujin/doujintypes'
import { DMMDoujinFeaturedItemType, UmamiTrackingFromType } from '@/types/umamiTypes'
import { formatPrice, isValidObject } from '@/utils/typeGuards'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { UmamiTracking } from '../dmmcomponents/UmamiTracking'

interface DMMDoujinFeaturedItemContainerProps {
	from: string
	bgGradient?: string
	endpoint: string
	title: string
	linkText: string
	linkHref: DMMDoujinFeaturedItemType
	textGradient: string
	umamifrom?: UmamiTrackingFromType
}

async function fetcDoujinTopData(endpoint: string): Promise<DoujinTopItem[]> {
	const fetchOptions = { next: { revalidate: 43200 } }
	const apiUrl = process.env.NEXT_PUBLIC_API_URL

	if (!apiUrl) {
		console.error('API URL is not defined')
		return []
	}

	try {
		const response = await fetch(`${apiUrl}${endpoint}`, fetchOptions)
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}
		const data: DoujinKVApiResponse = await response.json()

		// デバッグ用: レスポンス内容をログ出力
		console.log('API Response:', data.kvDatas[0], data.kvDatas[1])

		return data.kvDatas
	} catch (error) {
		console.error('データの取得に失敗しました:', error)
		return []
	}
}

const PriceDisplay = ({
	listPrice,
	salePrice,
}: { listPrice: string | undefined; salePrice: string }) => (
	<div className='mb-2'>
		{listPrice && <span className='text-gray-500 line-through mr-2'>{listPrice}円</span>}
		<span className='text-red-600 font-bold'>{salePrice}円</span>
	</div>
)

const DMMDoujinFeaturedItemCard = ({
	item,
	type,
	from,
	umamifrom,
}: {
	item: DoujinTopItem
	type: string
	from: string
	umamifrom: UmamiTrackingFromType
}) => {
	return (
		<div className='bg-white rounded-lg overflow-hidden transition duration-300 ease-in-out transform shadow-md flex flex-col h-full'>
			<Link href={`/doujin/itemd/${item.db_id}`}>
				<div className='relative overflow-hidden bg-gray-100 p-4'>
					<img
						src={item.imageURL?.large || ''}
						alt={item.title}
						className='w-full h-auto min-h-[200px] object-contain'
					/>
				</div>
				<div className='p-4 flex flex-col flex-grow'>
					<h2 className='text-lg font-semibold mb-2 line-clamp-2 h-14' title={item.title}>
						{item.title}
					</h2>
					{item.prices && (
						<PriceDisplay
							listPrice={
								item.prices.list_price !== item.prices.price
									? formatPrice(item.prices.list_price)
									: undefined
							}
							salePrice={formatPrice(item.prices.price)}
						/>
					)}
					<p
						className='text-sm text-gray-600 mb-2 line-clamp-1'
						title={item.makers?.[0]?.name ? `メーカー: ${item.makers[0].name}` : ''}>
						{item.makers?.[0]?.name ? `メーカー: ${item.makers[0].name}` : ''}
					</p>
				</div>
			</Link>
		</div>
	)
}

const DMMDoujinFeaturedItemList = ({
	items,
	from,
	type,
	umamifrom,
}: {
	items: DoujinTopItem[]
	from: string
	type: DMMDoujinFeaturedItemType
	umamifrom: UmamiTrackingFromType | undefined
}) => {
	const displayCount = from === 'top' ? 8 : items.length
	const defaultUmamiFrom: UmamiTrackingFromType = 'other'

	return (
		<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
			{items.slice(0, displayCount).map(item => (
				<div key={item.content_id}>
					<DMMDoujinFeaturedItemCard
						item={item}
						from={from}
						type={type}
						umamifrom={umamifrom || defaultUmamiFrom}
					/>
				</div>
			))}
		</div>
	)
}

export default async function DMMDoujinFeaturedItemContainer({
	from,
	bgGradient,
	endpoint,
	title,
	linkText,
	linkHref,
	textGradient,
	umamifrom,
}: DMMDoujinFeaturedItemContainerProps) {
	const items = await fetcDoujinTopData(endpoint)

	console.log('DMMDoujinFeaturedItemContainer endpoint:', endpoint)
	console.log('DMMDoujinFeaturedItemContainer items:', items[0], items[1])

	// itemsが空の場合にエラーメッセージを表示
	if (!items || items.length === 0) {
		return (
			<div
				className={`bg-gradient-to-r ${bgGradient} shadow-lg p-4 sm:p-4 md:p-8 transition duration-300 ease-in-out`}>
				<div className='text-center mb-8'>
					<h2 className='text-4xl font-extrabold mb-4'>
						<span className={`text-transparent bg-clip-text bg-gradient-to-r ${textGradient}`}>
							{title}
						</span>
					</h2>
					<Link
						href={`/doujin${linkHref}`}
						className={`inline-flex items-center px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r ${textGradient} shadow-lg transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50`}>
						{linkText}
						<ArrowRight className='ml-2 h-5 w-5 animate-bounce' />
					</Link>
				</div>
				<p>表示するアイテムがありません。</p>
			</div>
		)
	}

	return (
		<div
			className={`bg-gradient-to-r ${bgGradient} shadow-lg p-4 sm:p-4 md:p-8 transition duration-300 ease-in-out`}>
			<div className='text-center mb-8'>
				<h2 className='text-4xl font-extrabold mb-4'>
					<span className={`text-transparent bg-clip-text bg-gradient-to-r ${textGradient}`}>
						{title}
					</span>
				</h2>
				<Link
					href={`/doujin${linkHref}`}
					className={`inline-flex items-center px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r ${textGradient} shadow-lg transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50`}>
					{linkText}
					<ArrowRight className='ml-2 h-5 w-5 animate-bounce' />
				</Link>
			</div>
			<DMMDoujinFeaturedItemList items={items} from={from} type={linkHref} umamifrom={umamifrom} />
		</div>
	)
}

export const revalidate = 43200
