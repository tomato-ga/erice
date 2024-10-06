// src/app/campaign/[name]/page.tsx

import CampaignFeaturedItemGrid from '@/app/components/dmmcomponents/Campaign/CampaignFeaturedItemGrid'
import { fetchCampaignData } from '@/app/components/dmmcomponents/fetch/itemFetchers'
import { formatDateCampaign } from '@/utils/dmmUtils'
import dynamic from 'next/dynamic'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

// CampaignDetailClient を動的インポート
const CampaignDetailClient = dynamic(() => import('./CampaignDetailClient'), {
	loading: () => <p>読み込み中...</p>,
	ssr: false, // クライアントサイドでのみレンダリング
})

/**
 * CampaignDetailPageコンポーネント
 * キャンペーンの詳細ページを表示します。
 *
 * @param {Object} props - コンポーネントのプロパティ
 * @param {Object} props.params - URLパラメータ
 * @param {string} props.params.name - キャンペーン名
 * @returns {Promise<JSX.Element>} JSX要素
 */
const CampaignDetailPage = async ({ params }: { params: { name: string } }) => {
	const { name } = params
	const decodedName = decodeURIComponent(name)
	const campaignDataResponse = await fetchCampaignData(name)

	if (!campaignDataResponse) {
		console.error('Campaign data not found for:', decodedName)
		notFound()
	}

	const { items, createdAt } = campaignDataResponse

	return (
		<div className='container mx-auto px-1 py-4'>
			<div className='px-3'>
				<h1 className='text-4xl font-extrabold mb-4 text-slate-800'>
					【{formatDateCampaign(createdAt)}最新】 FANZAキャンペーン: {decodedName}
				</h1>
				<p className='pb-2 font-semibold'>
					{decodedName}
					のおすすめアイテムを厳選してご紹介します。最新のセール情報をチェックして、お得な商品を手に入れましょう。
				</p>
				<p className='text-sm text-gray-600 mb-8'>
					最終更新日時: {createdAt ? formatDateCampaign(createdAt) : ''}
				</p>
			</div>
			{items.length > 0 ? (
				<CampaignFeaturedItemGrid items={items} campaignName={decodedName} />
			) : (
				<p className='text-center'>このキャンペーンに該当するアイテムはありません。</p>
			)}

			{/* クライアントコンポーネントを遅延読み込み */}
			<Suspense fallback={<p>読み込み中...</p>}>
				<CampaignDetailClient name={decodedName} />
			</Suspense>
		</div>
	)
}

export const revalidate = 60 * 60 * 24 // 1日

export default CampaignDetailPage
