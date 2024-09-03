import { DMMItemProps, ItemType } from '@/types/dmmtypes'
import { ArrowRight } from 'lucide-react'
import { revalidateTag } from 'next/cache'
// components/DMMItemContainer.tsx
import Link from 'next/link'
import DMMItemList from './DMMItemList'

interface DMMItemContainerProps {
	itemType: ItemType
	from: string
	bgGradient?: string
}

// MEMO todaynewだけキャッシュ期限を付与
async function fetchData(itemType: ItemType): Promise<DMMItemProps[]> {
	let endpoint = ''
	let fetchOptions: RequestInit & { next?: NextFetchRequestConfig } = {}

	switch (itemType) {
		case 'todaynew': {
			endpoint = '/api/dmm-todaynew-getkv'
			fetchOptions = { cache: 'no-store' }
			break
		}
		case 'debut': {
			endpoint = '/api/dmm-debut-getkv'
			fetchOptions = { next: { revalidate: 43200 } }
			break
		}
		case 'feature': {
			endpoint = '/api/dmm-feature-getkv'
			fetchOptions = { next: { revalidate: 43200 } }
			break
		}
		case 'sale': {
			endpoint = '/api/dmm-sale-getkv'
			fetchOptions = { next: { revalidate: 43200 } }
			break
		}
		default: {
			throw new Error(`Invalid itemType: ${itemType}`)
		}
	}

	try {
		console.log(`Fetching data for ${itemType} from ${endpoint}`)

		const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, fetchOptions)

		if (!response.ok) {
			console.error(`Error fetching data for ${itemType}:`, response.status, response.statusText)
			return []
		}

		const data: DMMItemProps[] = await response.json()
		if (!Array.isArray(data)) {
			console.error(`Invalid data format received for ${itemType}:`, data)
			return []
		}

		console.log(`Successfully fetched ${data.length} items for ${itemType}`)
		return data
	} catch (error) {
		console.error(`Error fetching data for ${itemType}:`, error)
		return []
	}
}

export default async function DMMItemContainer({
	itemType,
	from,
	bgGradient,
}: DMMItemContainerProps) {
	console.log('DMMItemContainer itemType: ', itemType)

	const items = await fetchData(itemType)

	if (!items || items.length === 0) {
		return null
	}

	const gradients = {
		todaynew: 'from-green-500 to-blue-500',
		debut: 'from-yellow-500 to-red-500',
		feature: 'from-pink-500 to-purple-500',
		sale: 'from-blue-500 to-purple-500',
		actress: 'from-blue-500 to-purple-500',
		genre: 'from-blue-500 to-purple-500',
	}

	const titles = {
		todaynew: '今日配信の新作',
		debut: 'デビュー作品',
		feature: '注目作品',
		sale: '限定セール',
		actress: 'アクトレス',
		genre: 'ジャンル',
	}

	const linkTexts = {
		todaynew: '全ての新作商品を見る',
		debut: '全てのデビュー作品を見る',
		feature: '全ての注目作品を見る',
		sale: '全ての限定セール商品を見る',
		actress: '全てのアクトレスを見る',
		genre: '全てのジャンルを見る',
	}

	return (
		<div className={`${bgGradient} shadow-lg p-4 sm:p-4 md:p-8 transition duration-300 ease-in-out`}>
			{from !== 'only' && (
				<div className='text-center mb-8'>
					<h2 className='text-4xl font-extrabold mb-4'>
						<span className={`text-transparent bg-clip-text bg-gradient-to-r ${gradients[itemType]}`}>
							{titles[itemType]}
						</span>
					</h2>
					<Link
						href={`/${itemType}`}
						className={`inline-flex items-center px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r ${
							gradients[itemType]
						}  shadow-lg transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-${
							gradients[itemType].split('-')[1]
						}-400 focus:ring-opacity-50`}>
						{linkTexts[itemType]}
						<ArrowRight className='ml-2 h-5 w-5 animate-bounce' />
					</Link>
				</div>
			)}
			<DMMItemList items={items} itemType={itemType} from={from} />
		</div>
	)
}

// // 12時間キャッシュ
// export const revalidate = 43200
