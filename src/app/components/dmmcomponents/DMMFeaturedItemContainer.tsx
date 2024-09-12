import { DMMFeaturedItemProps } from '@/types/dmmtypes'
import { UmamiTrackingFromType } from '@/types/umamiTypes'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { UmamiTracking } from './UmamiTracking'

interface DMMFeaturedItemContainerProps<T extends DMMFeaturedItemProps> {
	from: string
	bgGradient?: string
	endpoint: string
	title: string
	linkText: string
	linkHref: '/sale' | '/todaynew' | '/debut' | '/feature'
	textGradient: string
	umamifrom: UmamiTrackingFromType
}

async function fetchData<T extends DMMFeaturedItemProps>(endpoint: string): Promise<T[]> {
	console.log('fetchData endpoint:', endpoint)

	const fetchOptions = { next: { revalidate: 43200 } }

	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, fetchOptions)
		if (!response.ok) return []
		const data: T[] = await response.json()
		return Array.isArray(data) ? data : []
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

const DMMFeaturedItemCard = <T extends DMMFeaturedItemProps>({
	item,
	type,
	from,
	umamifrom,
}: {
	item: T
	type: '/sale' | '/todaynew' | '/debut' | '/feature'
	from: string
	umamifrom: UmamiTrackingFromType
}) => (
	<div className='bg-white rounded-lg overflow-hidden transition duration-300 ease-in-out transform shadow-md flex flex-col h-full'>
		<UmamiTracking
			trackingData={{ dataType: 'item', from: umamifrom, featureType: type, item: item }}>
			<Link href={`/item/${item.db_id}`}>
				<div className='relative overflow-hidden bg-gray-100 p-4'>
					<img
						src={item.imageURL?.toString() || ''}
						alt={item.title}
						className='w-full h-auto min-h-[200px] object-contain'
					/>
				</div>
				<div className='p-4 flex flex-col flex-grow'>
					<h2 className='text-lg font-semibold mb-2 line-clamp-2 h-14' title={item.title}>
						{item.title}
					</h2>
					{'salecount' in item && 'salePrice' in item && item.salePrice && (
						<PriceDisplay listPrice={item.salecount} salePrice={item.salePrice} />
					)}
					{!('salecount' in item && 'salePrice' in item) && item.price && (
						<div className='mb-2'>
							<span className='text-red-600 font-bold'>
								{item.price.match(/\d+~円/) ? item.price : item.price.replace(/~/, '円〜')}
							</span>
						</div>
					)}
					<p className='text-sm text-gray-600 mb-2 line-clamp-1' title={item.actress}>
						{item.actress ? `出演: ${item.actress}` : ''}
					</p>
				</div>
			</Link>
		</UmamiTracking>
	</div>
)

const DMMFeaturedItemList = <T extends DMMFeaturedItemProps>({
	items,
	from,
	type,
	umamifrom,
}: {
	items: T[]
	from: string
	type: string
	umamifrom: UmamiTrackingFromType
}) => {
	const displayCount = from === 'top' ? 8 : items.length
	return (
		<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
			{items.slice(0, displayCount).map(item => (
				<div key={item.content_id}>
					<DMMFeaturedItemCard
						item={item}
						from={from}
						type={type as '/sale' | '/todaynew' | '/debut' | '/feature'}
						umamifrom={umamifrom}
					/>
				</div>
			))}
		</div>
	)
}

export default async function DMMFeaturedItemContainer<T extends DMMFeaturedItemProps>({
	from,
	bgGradient,
	endpoint,
	title,
	linkText,
	linkHref,
	textGradient,
	umamifrom,
}: DMMFeaturedItemContainerProps<T>) {
	const items = await fetchData<T>(endpoint)

	console.log('DMMFeaturedItemContainer items:', items)

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
					href={linkHref}
					className={`inline-flex items-center px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r ${textGradient} shadow-lg transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50`}>
					{linkText}
					<ArrowRight className='ml-2 h-5 w-5 animate-bounce' />
				</Link>
			</div>
			<DMMFeaturedItemList items={items} from={from} type={linkHref} umamifrom={umamifrom} />
		</div>
	)
}

export const revalidate = 43200
