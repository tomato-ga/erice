import { GetKVTop100Response } from '@/types/dmm-keywordpage'
// app/components/dmmcomponents/DMMFeaturedItemContainer.tsx
import { DMMFeaturedItemProps } from '@/types/dmmtypes'
import { UmamiTrackingFromType } from '@/types/umamiTypes'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { UmamiTracking } from './UmamiTracking'
import { fetchData } from './fetch/itemFetchers'

// shuffleArray 関数を追加
const shuffleArray = <T,>(array: T[]): T[] => {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[array[i], array[j]] = [array[j], array[i]]
	}
	return array
}

interface DMMFeaturedItemContainerProps<T extends DMMFeaturedItemProps> {
	from: string
	bgGradient?: string
	endpoint: string
	title: string
	linkText: string
	linkHref: '/sale' | '/todaynew' | '/debut' | '/feature' | '/last7days' | '/top100'
	textGradient: string
	umamifrom: UmamiTrackingFromType
	keywords?: string[] // 追加: キーワードをオプションで受け取る
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
	type: '/sale' | '/todaynew' | '/debut' | '/feature' | '/last7days' | '/top100'
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
	// {{ edit_1 }} ロジックの修正開始
	if (from === 'top') {
		if (type === '/last7days') {
			// トップページから /last7days を呼び出す場合、16件目以降の8件を表示
			return (
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
					{shuffleArray(items)
						.slice(16, 24) // 16件目から24件目（8件）
						.map(item => (
							<div key={item.content_id}>
								<DMMFeaturedItemCard
									item={item}
									from={from}
									type={
										type as '/sale' | '/todaynew' | '/debut' | '/feature' | '/last7days' | '/top100'
									}
									umamifrom={umamifrom}
								/>
							</div>
						))}
				</div>
			)
		}
		// トップページからその他のタイプを呼び出す場合、8件のみ表示
		return (
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
				{shuffleArray(items)
					.slice(0, 8) // 最初の8件
					.map(item => (
						<div key={item.content_id}>
							<DMMFeaturedItemCard
								item={item}
								from={from}
								type={
									type as '/sale' | '/todaynew' | '/debut' | '/feature' | '/last7days' | '/top100'
								}
								umamifrom={umamifrom}
							/>
						</div>
					))}
			</div>
		)
	}

	if (type === '/last7days') {
		// /last7days ページから呼び出す場合、全て表示
		return (
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
				{shuffleArray(items).map(item => (
					<div key={item.content_id}>
						<DMMFeaturedItemCard
							item={item}
							from={from}
							type={
								type as '/sale' | '/todaynew' | '/debut' | '/feature' | '/last7days' | '/top100'
							}
							umamifrom={umamifrom}
						/>
					</div>
				))}
			</div>
		)
	}

	// その他の場合は全件表示
	return (
		<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
			{shuffleArray(items).map(item => (
				<div key={item.content_id}>
					<DMMFeaturedItemCard
						item={item}
						from={from}
						type={type as '/sale' | '/todaynew' | '/debut' | '/feature' | '/last7days' | '/top100'}
						umamifrom={umamifrom}
					/>
				</div>
			))}
		</div>
	)
	// {{ edit_1 }} ロジックの修正終了
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
	keywords, // 追加
}: DMMFeaturedItemContainerProps<T>) {
	let items: T[] = []
	let createdAt: string | undefined = undefined

	if (from === 'top100') {
		try {
			const top100Response = await fetchData<GetKVTop100Response>(
				'/api/getkv-top100',
				keywords ? { keywords: keywords.join(',') } : undefined, // 修正
			)
			if (top100Response) {
				items = top100Response.items as unknown as T[]
				createdAt = top100Response.createdAt
			}
		} catch (error) {
			console.error('Failed to fetch Top 100 data:', error)
			items = []
		}
	} else {
		const data = await fetchData<T[]>(endpoint)
		if (data) {
			items = data
		}
	}

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
			{from === 'top100' && createdAt && <p className='text-sm'>更新日時: {createdAt}</p>}
			<DMMFeaturedItemList items={items} from={from} type={linkHref} umamifrom={umamifrom} />
		</div>
	)
}
