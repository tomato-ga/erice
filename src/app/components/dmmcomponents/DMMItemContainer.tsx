// components/DMMItemContainer.tsx
import Link from 'next/link'
import { DMMItemProps, ItemType } from '../../../../types/dmmtypes'
import DMMItemList from './DMMItemList'
import { ArrowRight } from 'lucide-react'

interface DMMItemContainerProps {
	itemType: ItemType
	from: string
	bgGradient?: string
}

// MEMO todaynewだけキャッシュ期限を付与
async function fetchData(itemType: ItemType): Promise<DMMItemProps[]> {
	let endpoint = ''
	let revalidateTime = 0 // デフォルトは0（キャッシュなし）

	switch (itemType) {
		case 'todaynew':
			endpoint = '/api/dmm-todaynew-getkv'
			revalidateTime = getSecondsUntilMidnight()
			break
		case 'debut':
			endpoint = '/api/dmm-debut-getkv'
			revalidateTime = 3600 // 1時間キャッシュ
			break
		case 'feature':
			endpoint = '/api/dmm-feature-getkv'
			revalidateTime = 3600 // 1時間キャッシュ
			break
		case 'sale':
			endpoint = '/api/dmm-sale-getkv'
			revalidateTime = 1800 // 30分キャッシュ
			break
		default:
			throw new Error(`Invalid itemType: ${itemType}`)
	}

	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
			next: {
				revalidate: revalidateTime
			}
		})

		if (!response.ok) {
			console.error('Error fetching data:', response.status, response.statusText)
			return []
		}

		const data: DMMItemProps[] = await response.json()
		if (!Array.isArray(data)) {
			console.error('Invalid data format received:', data)
			return []
		}
		return data
	} catch (error) {
		console.error('Error fetching data:', error)
		return []
	}
}

function getSecondsUntilMidnight(): number {
	const now = new Date()
	const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
	return Math.floor((midnight.getTime() - now.getTime()) / 1000)
}

export default async function DMMItemContainer({ itemType, from, bgGradient }: DMMItemContainerProps) {
	console.log('itemTypeitemType: ', itemType)

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
		genre: 'from-blue-500 to-purple-500'
	}

	const titles = {
		todaynew: '今日配信の新作',
		debut: 'デビュー作品',
		feature: '注目作品',
		sale: '限定セール',
		actress: 'アクトレス',
		genre: 'ジャンル'
	}

	const linkTexts = {
		todaynew: '全ての新作商品を見る',
		debut: '全てのデビュー作品を見る',
		feature: '全ての注目作品を見る',
		sale: '全ての限定セール商品を見る',
		actress: '全てのアクトレスを見る',
		genre: '全てのジャンルを見る'
	}

	return (
		<div className={`${bgGradient} shadow-lg p-4 sm:p-4 md:p-8 transition duration-300 ease-in-out`}>
			{from !== 'only' && (
				<div className="text-center mb-8">
					<h2 className="text-4xl font-extrabold mb-4">
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
						}-400 focus:ring-opacity-50`}
					>
						{linkTexts[itemType]}
						<ArrowRight className="ml-2 h-5 w-5 animate-bounce" />
					</Link>
				</div>
			)}
			<DMMItemList items={items} itemType={itemType} from={from} />
		</div>
	)
}
