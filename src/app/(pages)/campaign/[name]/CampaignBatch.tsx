// src/app/campaign/[name]/CampaignBatch.tsx

import CampaignFeaturedItemGrid from '@/app/components/dmmcomponents/Campaign/CampaignFeaturedItemGrid'
import LoadingSpinner from '@/app/components/dmmcomponents/Campaign/Loadingspinner'
import { fetchCampaignBatchData } from '@/app/components/dmmcomponents/fetch/itemFetchers'
import { DMMCampaignItem } from '@/types/dmm-campaignpage-types'
import React, { useEffect, useState } from 'react'

interface CampaignBatchProps {
	campaignName: string
	batchIndex: number
	setHasMoreData: (hasMore: boolean) => void
	onLoad: () => void
}

const CampaignBatch: React.FC<CampaignBatchProps> = ({
	campaignName,
	batchIndex,
	setHasMoreData,
	onLoad,
}) => {
	const [items, setItems] = useState<DMMCampaignItem[]>([])
	const [isLoading, setIsLoading] = useState<boolean>(true)

	useEffect(() => {
		const fetchData = async () => {
			const data = await fetchCampaignBatchData(campaignName, batchIndex)
			if (data?.items && data.items.length > 0) {
				setItems(data.items)
			} else {
				setHasMoreData(false)
			}
			setIsLoading(false)
			onLoad()
		}
		fetchData()
	}, [campaignName, batchIndex, setHasMoreData, onLoad])

	if (isLoading) {
		return <LoadingSpinner />
	}

	return items.length > 0 ? (
		<CampaignFeaturedItemGrid items={items} campaignName={campaignName} />
	) : null
}

export default React.memo(CampaignBatch)
