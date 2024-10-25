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
		<div className='bg-white rounded-lg p-6 mb-8 max-w-4xl mx-auto'>
			<h2 className='text-2xl font-bold mb-4 text-gray-800 border-b pb-2'>
				次作の予測レビュー平均点
			</h2>
			<div className='space-y-4 text-gray-700 leading-relaxed'>
				<p className='text-lg'>
					次作のレビュー平均点は{' '}
					<strong className='text-gray-800'>{predictedReview.toFixed(2)}</strong> 点と予測されます。
					この予測は、過去の作品に基づいて以下の要因を考慮した分析によって算出しました。
				</p>

				<section>
					<h3 className='text-xl font-semibold mb-2 text-gray-800'>詳細情報</h3>
					<ul className='list-disc list-inside ml-4 bg-gray-50 p-4 rounded-lg'>
						<li>
							<strong className='text-gray-800'>評価バランス平均：</strong>{' '}
							{nextMovie.weightedAverage.toFixed(2)}
						</li>
						<li>
							<strong className='text-gray-800'>標準偏差：</strong> {nextMovie.stdDev.toFixed(2)}
						</li>
						<li>
							<strong className='text-gray-800'>レビュー数：</strong> {nextMovie.reviewCount} 件
						</li>
						<li>
							<strong className='text-gray-800'>過去作品の平均スコア：</strong>{' '}
							{avgPreviousItemScores}
						</li>
					</ul>
				</section>

				<p className='text-lg bg-gray-50 p-4 rounded-lg'>
					これらの要因に基づいて次作のレビュー平均は{' '}
					<strong className='text-gray-800'>{predictedReview.toFixed(2)}</strong>{' '}
					点と予測されています。
				</p>
			</div>
		</div>
	)
}

export default DMMActressRegressionClient
