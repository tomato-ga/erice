// src/app/components/dmmcomponents/DMMActressRegression.tsx

'use client'

import { Stats } from '@/_types_dmm/statstype'
import { generateActressPageStructuredData } from '@/app/components/json-ld/jsonld'
import { DMMActressProfile } from '@/types/APItypes'
import MultivariateLinearRegression from 'ml-regression-multivariate-linear'
import React, { useEffect, useState, useRef } from 'react'
import { Article, WithContext } from 'schema-dts'

// 型定義
export type ReviewData = {
	weightedAverage: number
	reviewAverage: number
	reviewCount: number
	stdDev: number
	previousItemScores: number[]
}

type StandardScaler = {
	means: number[]
	stds: number[]
}

// スタンダードスケーラーのヘルパー関数
const calculateMeans = (data: number[][]): number[] => {
	const numColumns = data[0].length
	const means: number[] = Array(numColumns).fill(0)

	for (const row of data) {
		for (let i = 0; i < numColumns; i++) {
			means[i] += row[i]
		}
	}

	return means.map(mean => mean / data.length)
}

const calculateStds = (data: number[][], means: number[]): number[] => {
	const numColumns = data[0].length
	const stds: number[] = Array(numColumns).fill(0)

	for (const row of data) {
		for (let i = 0; i < numColumns; i++) {
			stds[i] += (row[i] - means[i]) ** 2
		}
	}

	return stds.map(std => Math.sqrt(std / data.length))
}

const standardizeData = (data: number[][], scaler: StandardScaler): number[][] => {
	const { means, stds } = scaler
	const standardizedData: number[][] = []

	for (const row of data) {
		const standardizedRow: number[] = []
		for (let i = 0; i < row.length; i++) {
			if (stds[i] === 0) {
				standardizedRow.push(0)
			} else {
				standardizedRow.push((row[i] - means[i]) / stds[i])
			}
		}
		standardizedData.push(standardizedRow)
	}

	return standardizedData
}

const performRegressionAnalysis = (
	data: ReviewData[],
	scaler: React.MutableRefObject<StandardScaler | null>,
): MultivariateLinearRegression => {
	const X: number[][] = data.map(item => [
		item.weightedAverage,
		item.stdDev,
		Math.log(1 + item.reviewCount),
		item.previousItemScores.length > 0
			? item.previousItemScores.reduce((a, b) => a + b, 0) / item.previousItemScores.length
			: 0,
	])

	const y: number[][] = data.map(item => [item.reviewAverage])

	const means = calculateMeans(X)
	const stds = calculateStds(X, means)
	const scalerData: StandardScaler = { means, stds }
	scaler.current = scalerData

	const X_normalized = standardizeData(X, scalerData)

	const mlr = new MultivariateLinearRegression(X_normalized, y, { intercept: true })

	return mlr
}

const predictNextReview = (
	mlr: MultivariateLinearRegression,
	nextMovie: ReviewData,
	scaler: StandardScaler,
): number => {
	const nextMovieFeatures: number[] = [
		nextMovie.weightedAverage,
		nextMovie.stdDev,
		Math.log(1 + nextMovie.reviewCount),
		nextMovie.previousItemScores.length > 0
			? nextMovie.previousItemScores.reduce((a, b) => a + b, 0) /
				nextMovie.previousItemScores.length
			: 0,
	]

	const nextMovieNormalized: number[][] = [
		nextMovieFeatures.map((value, index) => {
			if (scaler.stds[index] === 0) return 0
			return (value - scaler.means[index]) / scaler.stds[index]
		}),
	]

	const predictions: number[][] = mlr.predict(nextMovieNormalized)
	const rawPrediction: number = predictions[0][0]
	const prediction: number = Math.max(0, Math.min(rawPrediction, 5))

	return prediction
}

const DMMActressRegression: React.FC<{
	stats: Stats
	name: string
	profile?: DMMActressProfile
}> = ({ stats, name, profile }) => {
	const [predictedReview, setPredictedReview] = useState<number | null>(null)
	const [errorMessage, setErrorMessage] = useState<string | null>(null)
	const [nextMovie, setNextMovie] = useState<ReviewData | null>(null)
	const [combinedJsonLd, setCombinedJsonLd] = useState<WithContext<Article> | string | null>(null)

	const scalerRef = useRef<StandardScaler | null>(null)

	useEffect(() => {
		if (
			!stats ||
			!stats.metadata ||
			!stats.timeSeriesData ||
			!stats.timeSeriesData.time_series_analysis ||
			!stats.timeSeriesData.time_series_analysis.monthly_trends ||
			!stats.timeSeriesData.time_series_analysis.cumulative_review_count
		) {
			setErrorMessage('アクターの統計データが不足しています。')
			return
		}

		const { actress } = profile || {} // ネストされた依存関係を避けるために分割代入

		const metadata = stats.metadata

		// 月次データの収集
		const monthlyTrends = stats.timeSeriesData.time_series_analysis.monthly_trends
		const cumulativeReviewCount = stats.timeSeriesData.time_series_analysis.cumulative_review_count

		// 月を昇順にソート
		const sortedMonths = Object.keys(monthlyTrends).sort(
			(a, b) => new Date(a).getTime() - new Date(b).getTime(),
		)

		// 各月のレビュー数を計算
		const sortedDates = Object.keys(cumulativeReviewCount).sort(
			(a, b) => new Date(a).getTime() - new Date(b).getTime(),
		)

		const monthlyReviewCounts: { [month: string]: number } = {}

		sortedMonths.forEach((month, index) => {
			// 月の開始と終了の累積レビュー数を取得
			const monthDates = sortedDates.filter(date => date.startsWith(month))
			if (monthDates.length === 0) {
				monthlyReviewCounts[month] = 0
			} else {
				const firstDate = monthDates[0]
				const lastDate = monthDates[monthDates.length - 1]
				const firstCount = cumulativeReviewCount[firstDate]
				const lastCount = cumulativeReviewCount[lastDate]
				const reviewCount =
					lastCount -
					(index === 0
						? 0
						: getPreviousMonthCumulativeCount(sortedMonths, cumulativeReviewCount, index))
				monthlyReviewCounts[month] = reviewCount
			}
		})

		function getPreviousMonthCumulativeCount(
			sortedMonths: string[],
			cumulativeReviewCount: { [date: string]: number },
			currentIndex: number,
		): number {
			if (currentIndex === 0) return 0
			const previousMonth = sortedMonths[currentIndex - 1]
			const previousMonthDates = Object.keys(cumulativeReviewCount).filter(date =>
				date.startsWith(previousMonth),
			)
			if (previousMonthDates.length === 0) return 0
			const lastDate = previousMonthDates[previousMonthDates.length - 1]
			return cumulativeReviewCount[lastDate]
		}

		// 過去作品のスコア（トップ3のレビュー平均）
		const previousItemScores =
			metadata.top_3_popular_items && metadata.top_3_popular_items.length > 0
				? metadata.top_3_popular_items.map(item => item?.review_average || 0)
				: []

		// ReviewDataの作成
		const reviewData: ReviewData[] = sortedMonths.map(month => ({
			weightedAverage: metadata.weighted_average || 0,
			reviewAverage: monthlyTrends[month],
			reviewCount: monthlyReviewCounts[month] || 0,
			stdDev: metadata.review_std_dev || 0,
			previousItemScores,
		}))

		// 回帰分析の実行
		let mlr: MultivariateLinearRegression
		try {
			mlr = performRegressionAnalysis(reviewData, scalerRef)
		} catch (error) {
			console.error(error)
			setErrorMessage('回帰分析中にエラーが発生しました。')
			return
		}

		// 次作の予測データを構築
		const { weighted_average, total_review_count, top_3_popular_items } = metadata

		const latestTop3Scores =
			top_3_popular_items && top_3_popular_items.length > 0
				? top_3_popular_items.map(item => item?.review_average || 0)
				: []

		const nextMovieData: ReviewData = {
			weightedAverage: weighted_average || 0,
			reviewAverage: 0, // 予測値を設定するため未使用
			reviewCount: total_review_count || 0,
			stdDev: metadata.review_std_dev || 0,
			previousItemScores: latestTop3Scores,
		}

		if (!scalerRef.current) {
			setErrorMessage('スケーラーの初期化に失敗しました。')
			return
		}

		// 予測値の計算
		const prediction = predictNextReview(mlr, nextMovieData, scalerRef.current)

		setPredictedReview(prediction)
		setNextMovie(nextMovieData)

		// 構造化データの生成

		if (profile) {
			const generateStructuredData = async () => {
				try {
					// Article構造化データの生成
					const generatedArticleJsonLd = await generateActressPageStructuredData(
						`セクシー女優「${profile?.actress.name}」のエロ動画が${metadata.total_review_count}作品あります`,
						`セクシー女優${profile?.actress.name}さんのプロフィールと作品一覧、レビュー統計データを見ることができるページです。`,
						profile,
						stats,
						prediction,
						nextMovieData,
					)

					if (!generatedArticleJsonLd) {
						throw new Error('構造化データの生成に失敗しました。')
					}

					setCombinedJsonLd(JSON.stringify(generatedArticleJsonLd))
				} catch (error) {
					console.error('構造化データ生成エラー:', error)
				}
			}
			generateStructuredData()
		}
	}, [stats, profile])

	if (errorMessage) {
		return <div>{errorMessage}</div>
	}

	if (predictedReview === null || nextMovie === null) {
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
		<div className='bg-white rounded-lg p-1 mb-8 max-w-4xl mx-auto'>
			<div className='relative group'>
				<h3 className='text-2xl font-bold mb-4 text-gray-800 border-b pb-2'>
					次回作の予測レビュー平均点
					<span className='ml-1 cursor-help'>ⓘ</span>
				</h3>
				<div className='invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity absolute z-10 w-80 p-3 bg-gray-800 text-white text-sm rounded-lg -top-16 left-1/2 transform -translate-x-1/2 shadow-lg'>
					この予測は過去の月次データから、評価バランス、標準偏差、レビュー数、過去作品のスコアなどの要因がレビュー平均点にどのように影響するかを学習し、次回作の予測を行っています。そのため、予測が外れる可能性もあります。
					<div className='absolute -bottom-2 left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-gray-800' />
				</div>
			</div>
			<div className='space-y-4 text-gray-700 leading-relaxed'>
				<p className='text-lg'>
					次回作のレビュー平均点は{' '}
					<strong className='text-gray-800'>{predictedReview.toFixed(2)}</strong> 点と予測されます。
					この予測は、過去の作品に基づいて以下の要因を考慮した分析によって算出しました。
				</p>
				<section>
					<h4 className='text-xl font-semibold mb-2 text-gray-800'>分析要素</h4>
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
					これらの要因に基づいて次回作のレビュー平均は{' '}
					<strong className='text-gray-800'>{predictedReview.toFixed(2)}</strong>{' '}
					点と予測されています。
				</p>
			</div>
			{/* 構造化データの統合スクリプトタグ */}
			{combinedJsonLd && (
				<script
					id={`structured-data-${name}-person`}
					type='application/ld+json'
					dangerouslySetInnerHTML={{
						__html: combinedJsonLd,
					}}
				/>
			)}
		</div>
	)
}

export default DMMActressRegression
