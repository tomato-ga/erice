// src/app/campaign/[name]/page.tsx

import CampaignFeaturedItemGrid from '@/app/components/dmmcomponents/Campaign/CampaignFeaturedItemGrid' // 正しいパスからインポート
import { fetchCampaignData } from '@/app/components/dmmcomponents/fetch/itemFetchers'
import { DMMCampaignItem } from '@/types/dmm-campaignpage-types'
import { formatDateCampaign } from '@/utils/dmmUtils'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'
import CampaignDetailClient from './CampaignDetailClient' // クライアントコンポーネントをインポート

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
		console.error('Campaign data not found for:', decodedName) // エラーメッセージを表示
		notFound()
	}

	const { items, createdAt } = campaignDataResponse

	return (
		<div className='container mx-auto px-1 py-4'>
			<div className='px-3'>
				<h1 className='text-4xl font-extrabold mb-4 text-slate-800'>
					【{formatDateCampaign(createdAt)}最新】 FANZAキャンペーン:{decodedName}
				</h1>
				<p className='pb-2 font-semibold'>
					{decodedName}
					のおすすめアイテムを厳選してご紹介します。最新のエロ動画セール情報をチェックして、お得な商品を手に入れましょう。
				</p>
				{/* <p className='pb-2 font-semibold'>
          今すぐサンプル視聴可能！ダウンロードやストリーミングで、いつでもどこでも快感をお届けします。
          <br />
          お得な価格で手に入れた{decodedName}作品で、
          想像以上の興奮と刺激的な体験があなたを待っています。
        </p> */}
				<p className='text-sm text-gray-600 mb-8'>
					最終更新日時: {createdAt ? formatDateCampaign(createdAt) : ''}
					{/* Use formatDate utility to format the createdAt string */}
				</p>
			</div>
			{items.length > 0 ? (
				<CampaignFeaturedItemGrid items={items} campaignName={decodedName} />
			) : (
				<p className='text-center'>このキャンペーンに該当するアイテムはありません。</p>
			)}

			{/* クライアントコンポーネントをレンダリング */}
			<CampaignDetailClient name={decodedName} />
		</div>
	)
}

export const revalidate = 60 * 60 * 24 * 7 // 1週間

export default CampaignDetailPage
