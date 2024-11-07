import { Stats } from '@/_types_dmm/statstype'
import { generateIndependentStatsStructuredData } from '@/app/components/json-ld/jsonld' // 構造化データ生成関数をインポート
import React from 'react'

interface ActressStatsStructuredDataProps {
	actressName: string
	actressStats: Stats
}

const ActressStatsStructuredData: React.FC<ActressStatsStructuredDataProps> = ({
	actressName,
	actressStats,
}) => {
	if (!actressStats || !actressStats.metadata) {
		return null
	}

	try {
		const statsData = generateIndependentStatsStructuredData(actressName, actressStats)
		const jsonLdString = JSON.stringify(statsData)

		return (
			<script
				id={`structured-data-actress-stats-${actressName}`}
				type='application/ld+json'
				dangerouslySetInnerHTML={{ __html: jsonLdString }}
			/>
		)
	} catch (error) {
		console.error('Error generating structured data:', error)
		return null
	}
}

export default ActressStatsStructuredData
