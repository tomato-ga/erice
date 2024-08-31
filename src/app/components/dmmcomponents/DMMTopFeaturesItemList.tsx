import Link from 'next/link'
import { DMMItemProps } from '@/types/dmmtypes'
import { ArrowRight } from 'lucide-react'
import { UmamiTracking } from './UmamiTracking'

interface DMMFeaturesItemContainerProps<T extends DMMItemProps> {
	from: string
	bgGradient?: string
	endpoint: string
	title: string
	linkText: string
	linkHref: '/sale' | '/todaynew' | '/debut' | '/feature'
	textGradient: string
}

async function fetchData<T extends DMMItemProps>(endpoint: string): Promise<T[]> {
	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, { cache: 'no-store' })
		if (!response.ok) return []
		const data: T[] = await response.json()
		return Array.isArray(data) ? data : []
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

const DMMFeaturesItemCard = <T extends DMMItemProps>({ item, type, from }: { item: T; type: string; from: string }) => (
	<div className="bg-white rounded-lg overflow-hidden transition duration-300 ease-in-out transform shadow-md flex flex-col h-full">
		<UmamiTracking trackingData={{ dataType: 'item', from: 'top', item: item }}>
			<Link href={`/item/${item.db_id}`}>
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
				</div>
			</Link>
		</UmamiTracking>
	</div>
)

const DMMFeaturesItemList = <T extends DMMItemProps>({
	items,
	from,
	type
}: {
	items: T[]
	from: string
	type: string
}) => {
	const displayCount = from === 'top' ? 8 : items.length
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
			{items.slice(0, displayCount).map((item) => (
				<div key={item.content_id}>
					<DMMFeaturesItemCard item={item} from={from} type={type} />
				</div>
			))}
		</div>
	)
}

export default async function DMMFeaturesItemContainer<T extends DMMItemProps>({
	from,
	bgGradient,
	endpoint,
	title,
	linkText,
	linkHref,
	textGradient
}: DMMFeaturesItemContainerProps<T>) {
	const items = await fetchData<T>(endpoint)

	// console.log('DMMFeaturesItemContainer items:', items)

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
			<DMMFeaturesItemList items={items} from={from} type={linkHref} />
		</div>
	)
}
