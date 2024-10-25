// DMMActressRegressionClient.tsx
'use client'

import React from 'react'

type NextMovie = {
	weightedAverage: number
	stdDev: number
	reviewCount: number
	previousItemScores: number[]
}

type DMMActressRegressionClientProps = {
	predictedReview: number
	regressionEquation: string
	nextMovie: NextMovie
	errorMessage: string | null
}

const DMMActressRegressionClient: React.FC<DMMActressRegressionClientProps> = ({
	predictedReview,
	regressionEquation,
	nextMovie,
	errorMessage,
}) => {
	if (errorMessage) {
		return <div>{errorMessage}</div>
	}

	if (predictedReview === 0 && regressionEquation === '' && nextMovie.reviewCount === 0) {
		return <div>予測中...</div>
	}

	const avgPreviousItemScores =
		nextMovie.previousItemScores.length > 0
			? (
					nextMovie.previousItemScores.reduce((a, b) => a + b, 0) /
					nextMovie.previousItemScores.length
				).toFixed(2)
			: 'データなし'

	return (
		<div className='bg-white rounded-lg p-6 mb-8'>
			<h2 className='text-xl font-bold mt-6 mb-4'>次作の予測レビュー平均点</h2>
			<p>
				次作のレビュー平均点は <strong>{predictedReview.toFixed(2)}</strong> 点と予測されます。
				この予測は、過去の作品に基づいて以下の要因を考慮した多変量回帰分析によって算出しました。
			</p>

			{/* 回帰直線の式 */}
			<h3 className='text-lg font-bold mt-4 mb-2'>回帰直線の式</h3>
			<p className='italic mb-4'>{regressionEquation}</p>

			{/* 詳細情報 */}
			<h3 className='text-lg font-bold mt-4 mb-2'>詳細情報</h3>
			<ul className='list-disc list-inside ml-4 mb-4'>
				<li>
					<strong>評価バランス平均：</strong> {nextMovie.weightedAverage.toFixed(2)}
				</li>
				<li>
					<strong>標準偏差：</strong> {nextMovie.stdDev.toFixed(2)}
				</li>
				<li>
					<strong>レビュー数：</strong> {nextMovie.reviewCount} 件
				</li>
				<li>
					<strong>過去作品の平均スコア：</strong> {avgPreviousItemScores}
				</li>
			</ul>

			<p>
				これらの要因に基づいて次作のレビュー平均は <strong>{predictedReview.toFixed(2)}</strong>{' '}
				点と予測されています。
			</p>
		</div>
	)
}

export default DMMActressRegressionClient
