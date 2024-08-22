// components/DMMItemContainer.tsx
import Link from 'next/link'
import { DMMItemProps, ItemType } from '@/types/dmmtypes'
import DMMItemList from './DMMItemList'
import { ArrowRight } from 'lucide-react'
import { revalidateTag } from 'next/cache'

interface DMMItemContainerProps {
	from: string
	bgGradient?: string
}

async function fetchData(): Promise<DMMItemProps[]> {
	const endpoint = '/api/dmm-sale-getkv'
	const fetchOptions = { next: { revalidate: 43200 } }

	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, fetchOptions)

		if (!response.ok) {
			return []
		}

		const data: DMMItemProps[] = await response.json()
		if (!Array.isArray(data)) {
			return []
		}

		return data
	} catch (error) {
		return []
	}
}

export default async function DMMSaleItemContainer({ from, bgGradient }: DMMItemContainerProps) {
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

	const saleItems = await fetchData()

	return (
		<div className={`${bgGradient} shadow-lg p-4 sm:p-4 md:p-8 transition duration-300 ease-in-out`}>
			(
			<div className="text-center mb-8">
				<h2 className="text-4xl font-extrabold mb-4">
					<span className={`text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500`}>
						限定セール
					</span>
				</h2>
				<Link
					href={`/sale`}
					className={`inline-flex items-center px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500  shadow-lg transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 
					}-400 focus:ring-opacity-50`}
				>
					全ての限定セール商品を見る
					<ArrowRight className="ml-2 h-5 w-5 animate-bounce" />
				</Link>
			</div>
			){/* <DMMItemList items={items} itemType={itemType} from={from} /> */}
		</div>
	)
}

// // 12時間キャッシュ
// export const revalidate = 43200
