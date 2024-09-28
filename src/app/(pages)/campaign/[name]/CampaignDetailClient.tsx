// src/app/(pages)/campaign/[name]/CampaignDetailClient.tsx

'use client'

import { fetchCampaignBatch } from '@/app/components/dmmcomponents/fetch/itemFetchers'
import LoadingSpinner from '@/app/components/dmmcomponents/Campaign/Loadingspinner'
import React, { useEffect, useState, useRef, useCallback } from 'react'
import CampaignBatch from './CampaignBatch' // CampaignBatch を正しくインポート

interface CampaignDetailClientProps {
	name: string
}

const CampaignDetailClient: React.FC<CampaignDetailClientProps> = ({ name }) => {
	const decodedName = decodeURIComponent(name)
	const [batchIndex, setBatchIndex] = useState<number>(1) // 初期バッチを1に設定
	const [hasMoreData, setHasMoreData] = useState<boolean>(true)
	const [isLoading, setIsLoading] = useState<boolean>(false) // 初期ロード時にfalseに設定
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
		if (!hasMoreData) return // データがない場合はオブザーバーを設定しない
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
			// 初回ロード
			setIsLoading(true)
		}
	}, [batchIndex, hasMoreData])

	return (
		<div className='container mx-auto px-4 py-6'>
			{/* 上記のコメントアウトはネストされたコメントが原因でエラーを引き起こしていたため、完全に削除しました。 */}

			<div>
				{Array.from({ length: batchIndex }).map((_, idx) => (
					<div key={idx}>
						<CampaignBatch
							campaignName={decodedName}
							batchIndex={idx + 1} // 1-based index
							setHasMoreData={setHasMoreData}
							onLoad={handleBatchLoad}
						/>
					</div>
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

export default CampaignDetailClient
