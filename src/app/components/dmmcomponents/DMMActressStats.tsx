// DMMActressStats.tsx（サーバーコンポーネント）

import { ActressStats } from '@/_types_dmm/statstype'
import dynamic from 'next/dynamic'
import DMMActressStatsWriting from './DMMActressStatsWriting'

const DMMActressStatsCharts = dynamic(() => import('./DMMActressStatsCharts'), {
	ssr: false,
})

type Props = {
	actress_id: number
	actress_name: string
	isSummary: boolean
}

const DMMActressStats = async ({ actress_id, actress_name, isSummary = false }: Props) => {
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
			/>

			{/* グラフコンポーネントの表示 */}
			<DMMActressStatsCharts actressStats={actressStats} actressName={actress_name} />
		</div>
	)
}

export default DMMActressStats
