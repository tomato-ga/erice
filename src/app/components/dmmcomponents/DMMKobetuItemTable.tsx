'use client'

import Link from 'next/link'
import { DMMItem } from '../../../../types/dmmitemzodschema'
import { formatDate } from '@/utils/dmmUtils'

const ItemDetailsTable = ({ item }: { item: DMMItem }) => {
	const details = [
		{ label: 'タイトル', value: item.title, icon: '🎬' },
		{ label: '発売日', value: item.date ? formatDate(item.date) : '情報なし', icon: '📅' },
		{ label: '出演者', value: item.actress, icon: '🌟' },
		{ label: '品番', value: item.content_id, icon: '🔢' },
		{ label: 'メーカー', value: item.maker, icon: '🏭' },
		{ label: 'レーベル', value: item.label, icon: '🏷️' },
		{ label: 'シリーズ', value: item.series, icon: '📚' },
		{ label: '監督', value: item.director, icon: '🎬' }
	]

	return (
		<div className="space-y-3">
			{details.map(({ label, value, icon }) => (
				<div key={label} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
					<div className="flex items-start">
						<span className="text-2xl mr-4 opacity-80" aria-hidden="true">
							{icon}
						</span>
						<div className="flex-grow">
							<h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{label}</h3>
							{label === '出演者' && value ? ( // 出演者の場合のみ Link コンポーネントで囲む
								<Link
									href={`/actress/${encodeURIComponent(value)}`}
									className="text-base text-gray-900 dark:text-gray-100 break-words"
								>
									{value}
								</Link>
							) : (
								<p className="text-base text-gray-900 dark:text-gray-100 break-words">{value || '情報なし'}</p>
							)}
						</div>
					</div>
				</div>
			))}
		</div>
	)
}

// 呼び出し元のコンポーネント
const ProductDetails = ({ Item }: { Item: DMMItem }) => (
	<div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 shadow-lg">
		<h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
			商品詳細
		</h2>
		<ItemDetailsTable item={Item} />
	</div>
)

export default ProductDetails
