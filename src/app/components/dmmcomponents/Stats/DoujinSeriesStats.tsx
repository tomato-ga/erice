// src/app/components/dmmcomponents/DMMActressStats.tsx

import { Stats } from '@/_types_dmm/statstype'

import dynamic from 'next/dynamic'
import React, { Suspense } from 'react'
import LoadingSpinner from '../../Article/ArticleContent/loadingspinner'
import DoujinSeriesStatsWriting from './DoujinSeriesStatsWriting'

const DynamicDoujinStatsCharts = dynamic(() => import('./DoujinStatsCharts'), {
	ssr: false,
})

type Props = {
	seriesStatsData: Stats
	seriesName: string
	isSummary: boolean
}

const DoujinSeriesStats: React.FC<Props> = async ({ seriesStatsData, seriesName, isSummary }) => {
	return (
		<div className='bg-white rounded-lg p-6 mb-8'>
			<Suspense fallback={<LoadingSpinner />}>
				<DoujinSeriesStatsWriting
					seriesName={seriesName}
					seriesStats={seriesStatsData}
					isSummary={isSummary}
				/>
			</Suspense>
			{/* グラフコンポーネントの表示 */}
			<Suspense fallback={<LoadingSpinner />}>
				<DynamicDoujinStatsCharts stats={seriesStatsData} name={seriesName} />
			</Suspense>
		</div>
	)
}

export default DoujinSeriesStats
