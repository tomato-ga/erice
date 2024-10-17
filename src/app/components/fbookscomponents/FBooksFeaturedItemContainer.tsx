import { formatPrice, isValidObject } from '@/utils/typeGuards'

import { FbooksItemType, FbooksTopApiResponse, FbooksTopItem } from '@/_types_fbooks/fbookstype'
import { DMMDoujinFeaturedItemType, UmamiTrackingFromType } from '@/types/umamiTypes'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { UmamiTracking } from '../dmmcomponents/UmamiTracking'

interface FBooksFeaturedItemContainerProps {
	from: string
	bgGradient?: string
	endpoint: string
	title: string
	linkText: string
	linkHref: DMMDoujinFeaturedItemType
	textGradient: string
	umamifrom?: UmamiTrackingFromType
}

async function fetchData(endpoint: string): Promise<FbooksTopItem[]> {
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
		const data: FbooksTopApiResponse = await response.json()

		// console.log('API Response:', data) // 追加: レスポンス内容をログ出力

		return data.result.items
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
		<span className='text-gray-500 line-through mr-2'>{listPrice}</span>
		<span className='text-red-600 font-bold'>{salePrice}</span>
	</div>
)

const FBooksFeaturedItemCard = ({
	item,
	type,
	from,
	umamifrom,
}: {
	item: FbooksTopItem
	type: string
	from: string
	umamifrom: UmamiTrackingFromType
}) => {
	return (
		<div className='bg-white rounded-lg overflow-hidden transition duration-300 ease-in-out transform shadow-md flex flex-col h-full'>
			<Link href={`/fbooks/itemd/${item.content_id}`}>
				<div className='relative overflow-hidden bg-gray-100 p-4'>
					<img
						src={item.imageURL?.large || ''}
						alt={item.title || ''}
						className='w-full h-auto min-h-[200px] object-contain'
					/>
				</div>
				<div className='p-4 flex flex-col flex-grow'>
					<h2 className='text-lg font-semibold mb-2 line-clamp-2 h-14' title={item.title || ''}>
						{item.title}
					</h2>
					{item.prices && (
						<div className='mb-2'>
							<span className='text-red-600 font-bold'>{formatPrice(item.prices)}円</span>
						</div>
					)}
					<p
						className='text-sm text-gray-600 mb-2 line-clamp-1'
						title={
							Array.isArray(item.manufacture_names) && item.manufacture_names.length > 0
								? `メーカー: ${item.manufacture_names.join(', ')}`
								: ''
						}>
						{Array.isArray(item.manufacture_names) && item.manufacture_names.length > 0
							? `メーカー: ${item.manufacture_names.join(', ')}`
							: ''}
					</p>
				</div>
			</Link>
		</div>
	)
}

const FBooksFeaturedItemList = ({
	items,
	from,
	type,
	umamifrom,
}: {
	items: FbooksTopItem[]
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
					<FBooksFeaturedItemCard
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

export default async function FBooksFeaturedItemContainer({
	from,
	bgGradient,
	endpoint,
	title,
	linkText,
	linkHref,
	textGradient,
	umamifrom,
}: FBooksFeaturedItemContainerProps) {
	const items = await fetchData(endpoint)

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
					href={'/doujin' + `${linkHref}`}
					className={`inline-flex items-center px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r ${textGradient} shadow-lg transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50`}>
					{linkText}
					<ArrowRight className='ml-2 h-5 w-5 animate-bounce' />
				</Link>
			</div>
			<FBooksFeaturedItemList items={items} from={from} type={linkHref} umamifrom={umamifrom} />
		</div>
	)
}

export const revalidate = 43200
