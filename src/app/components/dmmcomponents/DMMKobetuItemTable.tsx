import { DMMItemDetailResponse } from '@/types/dmmitemzodschema'
import { fetchItemDetailByContentId } from '../dmmcomponents/fetch/itemFetchers'
import Link from 'next/link'

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
	// console.log('ItemDetailsTable received item:', item)
	const details = [
		{ label: 'タイトル', value: item.title, icon: '🎬' },
		{ label: '発売日', value: item.date ? formatDate(item.date) : '情報なし', icon: '📅' },
		{ label: '女優名', value: item.actress || '情報なし', icon: '😍' },
		{ label: 'ジャンル', value: item.genre || '情報なし', icon: '📚' },
		{ label: '品番', value: item.content_id, icon: '🔢' },
		{ label: 'メーカー', value: item.maker || '情報なし', icon: '🏭' },
		{ label: 'レーベル', value: item.label || '情報なし', icon: '🏷️' },
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
							{(label === '女優名' || label === 'ジャンル') && value !== '情報なし' ? (
								<div>
									{Array.isArray(value) ? (
										value.map((item, index) => (
											<Link
												key={index}
												href={`/${label === '女優名' ? 'actressprofile' : 'genre'}/${encodeURIComponent(item)}`}
												className="text-base text-blue-600 dark:text-gray-100 break-words mr-2 hover:border-b-2 hover:border-blue-500"
												prefetch={true}
											>
												{item}
											</Link>
										))
									) : typeof value === 'string' ? (
										value.split(',').map((item, index) => (
											<Link
												key={index}
												href={`/${label === '女優名' ? 'actressprofile' : 'genre'}/${encodeURIComponent(item.trim())}`}
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
	title: string
	contentId: string
	dbId: number
}

const ProductDetails = async ({ title, contentId, dbId }: ProductDetailsProps) => {
	let item: ExtendedDMMItemDetailResponse = {
		title,
		content_id: contentId
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
		<div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 shadow-lg">
			<h2 className="text-center font-bold mb-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
				<span className="text-2xl">アダルト動画詳細</span>
			</h2>
			<ItemDetailsTable item={item} />
		</div>
	)
}

export default ProductDetails
