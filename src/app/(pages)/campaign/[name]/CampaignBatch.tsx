// src/app/(pages)/campaign/[name]/CampaignBatch.tsx

import CampaignFeaturedItemGrid from '@/app/components/dmmcomponents/Campaign/CampaignFeaturedItemGrid' // デフォルトインポート
import { fetchCampaignBatch } from '@/app/components/dmmcomponents/fetch/itemFetchers'
import { DMMCampaignItem, DMMItemSchema } from '@/types/dmm-campaignpage-types'
import React, { useEffect, useState } from 'react'

interface CampaignBatchProps {
	campaignName: string
	batchIndex: number
	setHasMoreData: React.Dispatch<React.SetStateAction<boolean>>
	onLoad: () => void
}

const CampaignBatch: React.FC<CampaignBatchProps> = ({
	campaignName,
	batchIndex,
	setHasMoreData,
	onLoad,
}) => {
	const [items, setItems] = useState<DMMCampaignItem[] | null>(null)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		let isMounted = true
		fetchCampaignBatch(campaignName, batchIndex)
			.then(data => {
				if (isMounted) {
					console.log(`CampaignBatch: バッチ ${batchIndex} のデータ取得に成功しました`)
					setItems(data) // APIレスポンスが直接アイテムの配列の場合
					onLoad()
				}
			})
			.catch(error => {
				if (isMounted) {
					console.error(
						`CampaignBatch: バッチ ${batchIndex} のデータ取得に失敗しました: ${error.message}`,
					)
					if (error.message.includes('Batch not found') || error.message.includes('404')) {
						setHasMoreData(false)
					} else {
						setError(error.message)
					}
					onLoad()
				}
			})
		return () => {
			isMounted = false
		}
	}, [campaignName, batchIndex, setHasMoreData, onLoad])

	if (error) {
		return <p className='text-center text-red-500'>エラーが発生しました: {error}</p>
	}

	if (!items) {
		// items が null の間は何も表示しない（LoadingSpinner は親コンポーネントで表示）
		return null
	}

	if (items.length === 0) {
		if (batchIndex === 1) {
			// batchIndex starts at 1
			// 最初のバッチのみ "No items found." を表示
			return <p className='text-center text-gray-500'>No items found.</p>
		}
		// それ以外のバッチでは何も表示しない
		return null
	}

	return (
		<div>
			<CampaignFeaturedItemGrid items={items} campaignName={campaignName} />
		</div>
	)
}

export default CampaignBatch
