// src/app/components/dmmcomponents/DMMActressStats.tsx

import { Stats } from '@/_types_dmm/statstype'
import dynamic from 'next/dynamic'
import React, { Suspense } from 'react'
import LoadingSpinner from '../../Article/ArticleContent/loadingspinner'
import DoujinMakerStatsWriting from './DoujinMakerStatsWriting'

const DynamicDoujinStatsCharts = dynamic(() => import('./DoujinStatsCharts'), {
	ssr: false,
})

type Props = {
	makerStatsData: Stats
	makerName: string
	isSummary: boolean
}

const DoujinMakerStats: React.FC<Props> = async ({ makerStatsData, makerName, isSummary }) => {
	return (
		<div className='bg-white rounded-lg p-6 mb-8'>
			<Suspense fallback={<LoadingSpinner />}>
				<DoujinMakerStatsWriting
					makerName={makerName}
					makerStatsData={makerStatsData}
					isSummary={isSummary}
				/>
			</Suspense>
			{/* グラフコンポーネントの表示 */}
			<Suspense fallback={<LoadingSpinner />}>
				<DynamicDoujinStatsCharts stats={makerStatsData} name={makerName} />
			</Suspense>
		</div>
	)
}

export default DoujinMakerStats
