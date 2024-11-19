// import { DoujinItemType } from '@/_types_doujin/doujintypes'
// import DMMFeaturedItemContainer from '@/app/components/dmmcomponents/DMMFeaturedItemContainer'
// import DMMItemContainer from '@/app/components/dmmcomponents/DMMItemContainer'
// import DMMDoujinFeaturedItemContainer from '@/app/components/doujincomponents/DMMDoujinFeaturedItemContainer'
// import { DMMDoujinFeaturedItemType } from '@/types/umamiTypes'
// import { ArrowRight } from 'lucide-react'
// import Link from 'next/link'

// export default function DMMGenericPage({ params }: { params: { itemType: DoujinItemType } }) {
// 	const itemType = params.itemType

// 	// console.log('itemType: ', itemType) // 削除

// 	const endpointObject = (itemType: DoujinItemType): string => {
// 		switch (itemType) {
// 			case 'newrank':
// 				return '/api/doujin-get-top-newrank-items'
// 			case 'newrelease':
// 				return '/api/doujin-get-top-newrelease-items'
// 			case 'review':
// 				return '/api/doujin-get-top-review-items'
// 			case 'sale':
// 				return '/api/doujin-get-top-sale-items'

// 		}
// 	}

// 	const pageTitles: Record<DoujinItemType, string> = {
// 		newrank: '新着ランキング',
// 		newrelease: '新着作品',
// 		review: '注目作品',
// 		sale: '限定セール',
// 	}

// 	const gradients: Record<DoujinItemType, { bg: string; text: string }> = {
// 		newrank: { bg: 'from-green-50 to-blue-50', text: 'from-green-500 to-blue-500' },
// 		newrelease: { bg: 'from-yellow-50 to-red-50', text: 'from-yellow-500 to-red-500' },
// 		review: { bg: 'from-pink-50 to-purple-50', text: 'from-pink-500 to-purple-500' },
// 		sale: { bg: 'from-blue-50 to-purple-50', text: 'from-blue-500 to-purple-500' },
// 	}

// 	if (!Object.keys(pageTitles).includes(itemType)) {
// 		return (
// 			<div className='container mx-auto px-4 py-12'>
// 				<h1 className='text-3xl font-bold text-red-600 text-center mb-4'>無効な itemType です</h1>
// 				<p className='text-center'>
// 					有効な itemType は `todaynew`, `debut`, `feature`, `sale` です。
// 				</p>
// 			</div>
// 		)
// 	}

// 	return (
// 		<div className='w-full'>
// 			<div className='w-full'>
// 				<DMMDoujinFeaturedItemContainer
// 					from='only'
// 					bgGradient={`bg-gradient-to-r ${gradients[itemType].bg}`}
// 					endpoint={endpointObject(itemType)}
// 					title={pageTitles[itemType]}
// 					linkText='すべて見る'
// 					linkHref={`/${itemType}` satisfies DMMDoujinFeaturedItemType}
// 					textGradient={gradients[itemType].text}
// 					umamifrom={`only-${itemType}`}
// 				/>
// 			</div>
// 		</div>
// 	)
// }
