// src/app/components/dmmcomponents/DMMActressStats.tsx

import { ActressStats } from '@/_types_dmm/statstype'
import { DMMActressProfile } from '@/types/APItypes'
import dynamic from 'next/dynamic'
import React, { Suspense } from 'react'
import LoadingSpinner from '../Article/ArticleContent/loadingspinner'
import DMMActressStatsWriting from './DMMActressStatsWriting'

const DMMActressStatsCharts = dynamic(() => import('./DMMActressStatsCharts'), {
	ssr: false,
})

type Props = {
	actress_id: number
	actress_name: string
	isSummary: boolean
	profile: DMMActressProfile // 追加
}

const DMMActressStats: React.FC<Props> = async ({
	actress_id,
	actress_name,
	isSummary,
	profile,
}) => {
	const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/dmm-actress-stats?actress_id=${actress_id}`
	const response = await fetch(apiUrl, { next: { revalidate: 2419200 } })
	const actressStats = (await response.json()) as ActressStats

	if (
		!actressStats ||
		!actressStats.metadata ||
		!actressStats.timeSeriesData ||
		!actressStats.annualData
	) {
		return null
	}

	return (
		<div className='bg-white rounded-lg p-6 mb-8'>
			<DMMActressStatsWriting
				actressName={actress_name}
				actressStats={actressStats}
				isSummary={isSummary}
				profile={profile} // 追加
			/>
			{/* グラフコンポーネントの表示 */}
			<Suspense fallback={<LoadingSpinner />}>
				<DMMActressStatsCharts actressStats={actressStats} actressName={actress_name} />
			</Suspense>
		</div>
	)
}

export default DMMActressStats
