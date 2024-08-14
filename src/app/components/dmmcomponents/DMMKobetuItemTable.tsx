import { useEffect, useState } from 'react'
import Link from 'next/link'
import { DMMItemDetailResponse } from '../../../../types/dmmitemzodschema'
import { fetchItemDetailByContentId } from '../dmmcomponents/fetch/itemFetchers'

const formatDate = (dateString: string) => {
	const date = new Date(dateString)
	return date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })
}

interface ItemDetailsTableProps {
	label: string
	value: string | string[] | undefined | null
	icon: string
}

const ItemDetailsTable = ({ item }: { item: DMMItemDetailResponse & { title: string; content_id: string } }) => {
	const details = [
		{ label: 'タイトル', value: item.title, icon: '🎬' },
		{ label: '発売日', value: item.date ? formatDate(item.date) : '情報なし', icon: '📅' },
		{ label: '出演者', value: item.actress || '情報なし', icon: '😍' },
		{ label: 'ジャンル', value: item.genre || '情報なし', icon: '📚' },
		{ label: '品番', value: item.content_id, icon: '🔢' },
		{ label: 'メーカー', value: item.maker, icon: '🏭' },
		{ label: 'レーベル', value: item.label, icon: '🏷️' },
		{ label: 'シリーズ', value: item.series && item.series.length > 0 ? item.series : '情報なし', icon: '📺' },
		{ label: '監督', value: item.director || '情報なし', icon: '🎬' }
	] satisfies ItemDetailsTableProps[]

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
							{(label === '出演者' || label === 'ジャンル') && value !== '情報なし' ? (
								<div>
									{Array.isArray(value) ? (
										value.map((item, index) => (
											<Link
												key={index}
												href={`/${label === '出演者' ? 'actress' : 'genre'}/${encodeURIComponent(item)}`}
												className="text-base text-blue-600 dark:text-gray-100 break-words mr-2 hover:border-b-2 hover:border-blue-500"
											>
												{item}
											</Link>
										))
									) : typeof value === 'string' ? (
										value.split(',').map((item, index) => (
											<Link
												key={index}
												href={`/${label === '出演者' ? 'actress' : 'genre'}/${encodeURIComponent(item.trim())}`}
												className="text-base text-blue-600 dark:text-gray-100 break-words mr-2 hover:border-b-2 hover:border-blue-500"
											>
												{item.trim()}
											</Link>
										))
									) : (
										<p className="text-base text-gray-900 dark:text-gray-100 break-words">情報なし</p>
									)}
								</div>
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

interface ProductDetailsProps {
	contentId: string
	title: string
}

const ProductDetails = async ({ contentId, title }: ProductDetailsProps) => {
	const itemDetails = await fetchItemDetailByContentId(contentId)
	console.log('fetchItemDetailByContentId関数を呼び出します', itemDetails)

	if (!itemDetails) {
		return <div>商品詳細を読み込めませんでした。</div>
	}

	const combinedItem = {
		...itemDetails,
		title,
		content_id: contentId
	}

	return (
		<div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 shadow-lg">
			<h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
				商品詳細
			</h2>
			<ItemDetailsTable item={combinedItem} />
		</div>
	)
}

export default ProductDetails
