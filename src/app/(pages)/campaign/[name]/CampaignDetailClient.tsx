// src/app/campaign/[name]/CampaignDetailClient.tsx

'use client'

import LoadingSpinner from '@/app/components/dmmcomponents/Campaign/Loadingspinner'
import dynamic from 'next/dynamic'
import React, { useEffect, useState, useRef, useCallback } from 'react'

// CampaignBatch を動的インポート
const CampaignBatch = dynamic(() => import('./CampaignBatch'), {
	loading: () => <LoadingSpinner />,
})

interface CampaignDetailClientProps {
	name: string
}

const CampaignDetailClient: React.FC<CampaignDetailClientProps> = ({ name }) => {
	const decodedName = decodeURIComponent(name)
	const [batchIndex, setBatchIndex] = useState<number>(1)
	const [hasMoreData, setHasMoreData] = useState<boolean>(true)
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const observer = useRef<IntersectionObserver | null>(null)
	const lastBatchRef = useRef<HTMLDivElement | null>(null)

	// バッチロード後に呼び出されるコールバック
	const handleBatchLoad = useCallback(() => {
		setIsLoading(false)
	}, [])

	// 次のバッチをロードする関数
	const loadMoreData = useCallback(() => {
		if (isLoading || !hasMoreData) return
		setIsLoading(true)
		setBatchIndex(prevIndex => prevIndex + 1)
	}, [isLoading, hasMoreData])

	// IntersectionObserver の設定
	useEffect(() => {
		if (!hasMoreData) return
		if (observer.current) observer.current.disconnect()
		observer.current = new IntersectionObserver(
			entries => {
				if (entries[0].isIntersecting && hasMoreData && !isLoading) {
					loadMoreData()
				}
			},
			{
				root: null,
				rootMargin: '100px',
				threshold: 0.1,
			},
		)
		if (lastBatchRef.current) {
			observer.current.observe(lastBatchRef.current)
		}
		return () => {
			if (observer.current) observer.current.disconnect()
		}
	}, [loadMoreData, hasMoreData, isLoading])

	// 初回バッチロードをトリガー
	useEffect(() => {
		if (batchIndex === 1 && hasMoreData) {
			setIsLoading(true)
		}
	}, [batchIndex, hasMoreData])

	return (
		<div className='container mx-auto px-4 py-6'>
			<div>
				{Array.from({ length: batchIndex }).map((_, idx) => (
					<React.Fragment key={idx}>
						<CampaignBatch
							campaignName={decodedName}
							batchIndex={idx + 1}
							setHasMoreData={setHasMoreData}
							onLoad={handleBatchLoad}
						/>
					</React.Fragment>
				))}
				{/* 監視用の要素 */}
				{hasMoreData && <div ref={lastBatchRef} />}
			</div>

			{isLoading && <LoadingSpinner />}

			{!hasMoreData && (
				<p className='text-center mt-4 text-gray-500'>これ以上のデータはありません。</p>
			)}
		</div>
	)
}

export default React.memo(CampaignDetailClient)
