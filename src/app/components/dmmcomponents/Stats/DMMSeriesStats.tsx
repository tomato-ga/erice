// src/app/components/dmmcomponents/DMMActressStats.tsx

import { Stats } from '@/_types_dmm/statstype'

import dynamic from 'next/dynamic'
import React, { Suspense } from 'react'
import LoadingSpinner from '../../Article/ArticleContent/loadingspinner'

import DMMSeriesStatsWriting from './DMMSeriesStatsWriting'

const DMMActressStatsCharts = dynamic(() => import('../DMMStatsCharts'), {
	ssr: false,
})

type Props = {
	seriesStatsData: Stats
	seriesName: string
	isSummary: boolean
}

const DMMSeriesStats: React.FC<Props> = async ({ seriesStatsData, seriesName, isSummary }) => {
	return (
		<div className='bg-white rounded-lg p-6 mb-8'>
			<DMMSeriesStatsWriting
				seriesName={seriesName}
				seriesStats={seriesStatsData}
				isSummary={isSummary}
			/>
			{/* グラフコンポーネントの表示 */}
			<Suspense fallback={<LoadingSpinner />}>
				<DMMActressStatsCharts stats={seriesStatsData} name={seriesName} />
			</Suspense>
		</div>
	)
}

export default DMMSeriesStats
