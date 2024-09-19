// /Volumes/SSD_1TB/erice2/erice/src/app/(pages)/[itemType]/page.tsx

import DMMFeaturedItemContainer from '@/app/components/dmmcomponents/DMMFeaturedItemContainer'
import DMMItemContainer from '@/app/components/dmmcomponents/DMMItemContainer'
import { ItemType } from '@/types/dmmtypes'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function DMMGenericPage({ params }: { params: { itemType: string } }) {
	const itemType = params.itemType as ItemType

	// console.log('itemType: ', itemType) // 削除

	const pageTitles: Record<ItemType, string> = {
		todaynew: '今日配信の新作',
		debut: 'デビュー作品',
		feature: '注目作品',
		sale: '限定セール',
		actress: 'アクトレス',
		genre: 'ジャンル',
		last7days: '過去7日間の新作',
		top100: 'TOP',
	}

	const gradients: Record<ItemType, { bg: string; text: string }> = {
		todaynew: { bg: 'from-green-50 to-blue-50', text: 'from-green-500 to-blue-500' },
		debut: { bg: 'from-yellow-50 to-red-50', text: 'from-yellow-500 to-red-500' },
		feature: { bg: 'from-pink-50 to-purple-50', text: 'from-pink-500 to-purple-500' },
		sale: { bg: 'from-blue-50 to-purple-50', text: 'from-blue-500 to-purple-500' },
		actress: { bg: 'from-blue-50 to-purple-50', text: 'from-red-500 to-blue-500' },
		genre: { bg: 'from-blue-50 to-purple-50', text: 'from-red-500 to-blue-500' },
		last7days: { bg: 'from-emerald-50 to-yellow-50', text: 'from-emerald-500 to-yellow-500' }, // Updated gradient
		top100: { bg: 'from-purple-50 to-pink-50', text: 'from-purple-500 to-pink-500' },
	}

	if (!Object.keys(pageTitles).includes(itemType)) {
		return (
			<div className='container mx-auto px-4 py-12'>
				<h1 className='text-3xl font-bold text-red-600 text-center mb-4'>無効な itemType です</h1>
				<p className='text-center'>
					有効な itemType は `todaynew`, `debut`, `feature`, `sale`, `top100` です。
				</p>
			</div>
		)
	}

	// top100 ページ用の処理を追加
	if (itemType === 'top100') {
		return (
			<div className='w-full'>
				<DMMFeaturedItemContainer
					from='top100'
					bgGradient={'bg-gradient-to-r ' + gradients[itemType].bg}
					endpoint='/api/getkv-top100?keywords=くびれ,爆乳'
					title={pageTitles[itemType]}
					linkText='すべて見る'
					linkHref='/top100'
					textGradient={gradients[itemType].text}
					umamifrom={'only-' + itemType}
				/>
			</div>
		)
	}

	// その他のページ用の既存の処理
	return (
		<div className='w-full'>
			<div className='w-full'>
				<DMMFeaturedItemContainer
					from='only'
					bgGradient={`bg-gradient-to-r ${gradients[itemType].bg}`}
					endpoint={`/api/dmm-${itemType}-getkv`}
					title={pageTitles[itemType]}
					linkText='すべて見る'
					linkHref={`/${itemType}` as '/sale' | '/todaynew' | '/debut' | '/feature' | '/last7days'}
					textGradient={gradients[itemType].text}
					umamifrom={`only-${itemType}`}
				/>
			</div>
		</div>
	)
}
