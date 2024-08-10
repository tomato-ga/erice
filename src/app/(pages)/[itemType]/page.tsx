import { ItemType } from '@/app/components/dmmcomponents/DMMItemContainer'
import DMMItemContainer from '@/app/components/dmmcomponents/DMMItemContainer'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default async function DMMGenericPage({ params }: { params: { itemType: string } }) {
	const itemType = params.itemType as ItemType

	const pageTitles: Record<ItemType, string> = {
		todaynew: '今日配信の新作',
		debut: 'デビュー作品',
		feature: '注目作品',
		sale: '限定セール'
	}

	const gradients: Record<ItemType, string> = {
		todaynew: 'from-green-500 to-blue-500',
		debut: 'from-yellow-500 to-red-500',
		feature: 'from-pink-500 to-purple-500',
		sale: 'from-blue-500 to-purple-500'
	}

	if (!Object.keys(pageTitles).includes(itemType)) {
		return (
			<div className="container mx-auto px-4 py-12">
				<h1 className="text-3xl font-bold text-red-600 text-center mb-4">無効な itemType です</h1>
				<p className="text-center">有効な itemType は `todaynew`, `debut`, `feature`, `sale` です。</p>
			</div>
		)
	}

	return (
		<>
			<div className="container mx-auto px-4 py-12">
				<div className="text-center mb-12">
					<h1 className="text-4xl font-extrabold mb-4">
						<span className={`text-transparent bg-clip-text bg-gradient-to-r ${gradients[itemType]}`}>
							{pageTitles[itemType]}
						</span>
					</h1>
					<p className="text-xl text-gray-600 mb-6">
						最新の{pageTitles[itemType]}をチェックしましょう。お気に入りの作品が見つかるかもしれません！
					</p>
				</div>
				<div id="items">
					<DMMItemContainer itemType={itemType} from="only" />
				</div>
			</div>
		</>
	)
}
