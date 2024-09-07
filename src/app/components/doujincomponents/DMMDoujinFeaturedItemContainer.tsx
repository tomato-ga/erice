import { isValidObject } from '@/utils/typeGuards'

import { DoujinTopApiResponse, DoujinTopItem } from '@/_types_doujin/doujintypes'
import { UmamiTrackingFromType } from '@/types/umamiTypes'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { UmamiTracking } from '../dmmcomponents/UmamiTracking'

type DMMDoujinFeaturedItemType =
	| '/doujin-sale'
	| '/doujin-newrank'
	| '/doujin-newrelease'
	| '/doujin-popular-circles'
	| '/doujin-review'

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

async function fetchData(endpoint: string): Promise<DoujinTopItem[]> {
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
		const data: DoujinTopApiResponse = await response.json()

		return data.result.items
	} catch (error) {
		console.error('データの取得に失敗しました:', error)
		return []
	}
}

const PriceDisplay = ({ listPrice, salePrice }: { listPrice: string | undefined; salePrice: string }) => (
	<div className="mb-2">
		<span className="text-gray-500 line-through mr-2">{listPrice}</span>
		<span className="text-red-600 font-bold">{salePrice}</span>
	</div>
)

const DMMDoujinFeaturedItemCard = ({
	item,
	type,
	from,
	umamifrom
}: {
	item: DoujinTopItem
	type: string
	from: string
	umamifrom: UmamiTrackingFromType
}) => {
	const getImageUrl = (packageImages: unknown): string => {
		if (packageImages && isValidObject<{ list?: string; large?: string }>(packageImages, ['list', 'large'])) {
			return packageImages.large || packageImages.list || ''
		}
		return ''
	}

	const formatPrice = (price: unknown): string => {
		if (typeof price === 'string' || typeof price === 'number') {
			// 数値を日本円フォーマットに変換
			return new Intl.NumberFormat('ja-JP', { currency: 'JPY' }).format(Number(price))
		}
		return ''
	}

	return (
		<div className="bg-white rounded-lg overflow-hidden transition duration-300 ease-in-out transform shadow-md flex flex-col h-full">
			<UmamiTracking
				trackingData={{
					dataType: 'item',
					from: umamifrom,
					featureType: type as DMMDoujinFeaturedItemType,
					item: item
				}}
			>
				<Link href={`/doujin/itemd/${item.db_id}`}>
					<div className="relative overflow-hidden bg-gray-100 p-4">
						<img
							src={getImageUrl(item.package_images)}
							alt={item.title}
							className="w-full h-auto min-h-[200px] object-contain"
						/>
					</div>
					<div className="p-4 flex flex-col flex-grow">
						<h2 className="text-lg font-semibold mb-2 line-clamp-2 h-14" title={item.title}>
							{item.title}
						</h2>
						{isValidObject(item.prices, ['list_price', 'price']) && (
							<div className="mb-2">
								{formatPrice(item.prices.list_price) !== formatPrice(item.prices.price) && (
									<span className="text-gray-500 line-through mr-2">{formatPrice(item.prices.list_price)}円</span>
								)}
								<span className="text-red-600 font-bold">{formatPrice(item.prices.price)}円</span>
							</div>
						)}
						<p
							className="text-sm text-gray-600 mb-2 line-clamp-1"
							title={isValidObject(item.makers?.[0], ['name']) ? `メーカー: ${item.makers[0].name}` : ''}
						>
							{isValidObject(item.makers?.[0], ['name']) ? `メーカー: ${item.makers[0].name}` : ''}
						</p>
					</div>
				</Link>
			</UmamiTracking>
		</div>
	)
}

const DMMDoujinFeaturedItemList = ({
	items,
	from,
	type,
	umamifrom
}: {
	items: DoujinTopItem[]
	from: string
	type: DMMDoujinFeaturedItemType
	umamifrom: UmamiTrackingFromType | undefined
}) => {
	const displayCount = from === 'top' ? 8 : items.length
	const defaultUmamiFrom: UmamiTrackingFromType = 'other'

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
			{items.slice(0, displayCount).map((item) => (
				<div key={item.content_id}>
					<DMMDoujinFeaturedItemCard item={item} from={from} type={type} umamifrom={umamifrom || defaultUmamiFrom} />
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
	umamifrom
}: DMMDoujinFeaturedItemContainerProps) {
	const items = await fetchData(endpoint)

	console.log('DMMDoujinFeaturedItemContainer items:', items)

	return (
		<div className={`bg-gradient-to-r ${bgGradient} shadow-lg p-4 sm:p-4 md:p-8 transition duration-300 ease-in-out`}>
			<div className="text-center mb-8">
				<h2 className="text-4xl font-extrabold mb-4">
					<span className={`text-transparent bg-clip-text bg-gradient-to-r ${textGradient}`}>{title}</span>
				</h2>
				<Link
					href={linkHref}
					className={`inline-flex items-center px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r ${textGradient} shadow-lg transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50`}
				>
					{linkText}
					<ArrowRight className="ml-2 h-5 w-5 animate-bounce" />
				</Link>
			</div>
			<DMMDoujinFeaturedItemList items={items} from={from} type={linkHref} umamifrom={umamifrom} />
		</div>
	)
}

export const revalidate = 43200
