import { DMMItemDetailResponse } from '@/types/dmmitemzodschema'
import { UmamiTrackingData, UmamiTrackingDataType, UmamiTrackingFromType } from '@/types/umamiTypes'
import Link from 'next/link'
import React from 'react'
import { fetchItemDetailByContentId } from '../dmmcomponents/fetch/itemFetchers'
import { UmamiTracking } from './UmamiTracking'

// shadcnのテーブルコンポーネントをインポート
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'

const formatDate = (dateString: string) => {
	const date = new Date(dateString)
	return date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })
}

interface ItemDetailsTableProps {
	label: string
	value: string | string[] | undefined | null
	icon: string
}

interface ExtendedDMMItemDetailResponse extends DMMItemDetailResponse {
	title: string
	content_id: string
}

const ItemDetailsTable = ({ item }: { item: ExtendedDMMItemDetailResponse }) => {
	const details = [
		{ label: 'タイトル', value: item.title, icon: '🎬' },
		{ label: '発売日', value: item.date ? formatDate(item.date) : '情報なし', icon: '📅' },
		{ label: '女優名', value: item.actress || '情報なし', icon: '😍' },
		{ label: 'ジャンル', value: item.genre || '情報なし', icon: '📚' },
		{ label: '品番', value: item.content_id, icon: '🔢' },
		{ label: 'メーカー', value: item.maker || '情報なし', icon: '🏭' },
		{ label: 'レーベル', value: item.label || '情報なし', icon: '🏷️' },
		{
			label: 'シリーズ',
			value: item.series && item.series.length > 0 ? item.series : '情報なし',
			icon: '📺',
		},
		{ label: '監督', value: item.director || '情報なし', icon: '🎬' },
	] satisfies ItemDetailsTableProps[]

	const getUmamiTrackingData = (label: string, value: string): UmamiTrackingData => {
		const dataType: UmamiTrackingDataType =
			label === '女優名' ? 'actress-name' : label === 'ジャンル' ? 'genre' : 'other'
		return {
			dataType,
			from: 'kobetu-item-detail' as UmamiTrackingFromType,
			otherData: {
				label,
				value,
			},
		}
	}

	// 関数を定義してラベルに基づいてクラス名を取得
	const getLinkClassName = (label: string) => {
		if (label === 'ジャンル') {
			return 'bg-pink-50 text-pink-600 px-3 py-1 rounded text-sm font-semibold hover:bg-pink-100 transition-colors'
		}
		if (label === '女優名') {
			return 'text-base text-blue-600 dark:text-gray-100 break-words mr-2 hover:border-b-2 hover:border-blue-500'
		}
		return 'text-base break-words mr-2' // デフォルトのクラス名
	}

	return (
		<Table className='w-full mt-3'>
			<TableBody>
				{details.map(({ label, value, icon }) => (
					<TableRow key={label} className='bg-white dark:bg-gray-800'>
						<TableCell className='whitespace-nowrap p-4 flex items-center'>
							<span className='text-2xl mr-4 opacity-80' aria-hidden='true'>
								{icon}
							</span>
							<span className='text-sm font-medium text-gray-600 dark:text-gray-400'>{label}</span>
						</TableCell>
						<TableCell className='p-4'>
							{(label === '女優名' || label === 'ジャンル') && value !== '情報なし' ? (
								<div className='flex flex-wrap gap-2'>
									{Array.isArray(value) ? (
										value.map((itemValue, index) => (
											<UmamiTracking
												key={index}
												trackingData={getUmamiTrackingData(label, itemValue)}>
												<Link
													href={`/${label === '女優名' ? 'actressprofile' : 'genre'}/${encodeURIComponent(itemValue)}`}
													className={getLinkClassName(label)}
													prefetch={true}>
													{itemValue}
												</Link>
											</UmamiTracking>
										))
									) : typeof value === 'string' ? (
										value.split(',').map((itemValue, index) => (
											<UmamiTracking
												key={index}
												trackingData={getUmamiTrackingData(label, itemValue.trim())}>
												<Link
													href={`/${label === '女優名' ? 'actressprofile' : 'genre'}/${encodeURIComponent(
														itemValue.trim(),
													)}`}
													className={getLinkClassName(label)}
													prefetch={true}>
													{itemValue.trim()}
												</Link>
											</UmamiTracking>
										))
									) : (
										<p className='text-base text-gray-900 dark:text-gray-100 break-words'>
											情報なし
										</p>
									)}
								</div>
							) : (
								<p className='text-base text-gray-900 dark:text-gray-100 break-words'>
									{value || '情報なし'}
								</p>
							)}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}

interface ProductDetailsProps {
	title: string
	contentId: string
	dbId: number
}

export const ProductDetails = async ({ title, contentId, dbId }: ProductDetailsProps) => {
	let item: ExtendedDMMItemDetailResponse = {
		title,
		content_id: contentId,
	}

	try {
		const detailData = await fetchItemDetailByContentId(dbId)
		if (detailData) {
			item = { ...item, ...detailData }
		}
	} catch (error) {
		console.error('Error fetching item details:', error)
		return
	}

	return (
		<div className='bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 shadow-lg'>
			<h2 className='text-center font-bold mb-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text'>
				<span className='text-2xl'>アダルト動画詳細</span>
			</h2>
			<ItemDetailsTable item={item} />
		</div>
	)
}

export default React.memo(ProductDetails)
