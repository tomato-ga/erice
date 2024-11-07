// src/app/components/dmmcomponents/DMMActressStats.tsx

import { Stats } from '@/_types_dmm/statstype'
import { DMMActressProfile } from '@/types/APItypes'
import dynamic from 'next/dynamic'
import React, { Suspense } from 'react'
import LoadingSpinner from '../../Article/ArticleContent/loadingspinner'
import DMMSeriesStatsWriting from './DMMSeriesStatsWriting'

const DMMStatsCharts = dynamic(() => import('../DMMStatsCharts'), {
	ssr: false,
})

type Props = {
	series_id: number
	series_name: string
	isSummary: boolean
}

const DMMActressStats: React.FC<Props> = async ({ series_id, series_name, isSummary }) => {
	const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/dmm-series-stats?series_id=${series_id}`
	const response = await fetch(apiUrl, { next: { revalidate: 2419200 } })
	const Stats = (await response.json()) as Stats

	if (
		!Stats ||
		!Stats.metadata ||
		!Stats.timeSeriesData ||
		!Stats.annualData
	) {
		return null
	}

	return (
		<div className='bg-white rounded-lg p-6 mb-8'>
			<DMMSeriesStatsWriting name={series_name} stats={Stats} isSummary={isSummary} />
			{/* グラフコンポーネントの表示 */}
			<Suspense fallback={<LoadingSpinner />}>
				<DMMStatsCharts actressStats={Stats} actressName={series_name} />
			</Suspense>
		</div>
	)
}

export default DMMActressStats
