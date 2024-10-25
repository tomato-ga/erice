import { ActressStats } from '@/_types_dmm/statstype'
import MultivariateLinearRegression from 'ml-regression-multivariate-linear'
import React from 'react'
import DMMActressRegressionClient from './DMMActressRegressionC'

// 型定義
type ReviewData = {
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

type RegressionResult = {
	predictedReview: number
	regressionEquation: string
	nextMovie: {
		weightedAverage: number
		stdDev: number
		reviewCount: number
		previousItemScores: number[]
	}
	errorMessage: string | null
}

// 標準化のためのヘルパー関数
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
			if (stds[i] === 0 || Math.abs(stds[i]) < 1e-6) {
				// 標準偏差が非常に小さい場合、標準化を行わずにゼロを返す
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
): { mlr: MultivariateLinearRegression; scaler: StandardScaler } => {
	// X を二次元配列として明示的に型付け
	const X: number[][] = data.map(item => [
		item.weightedAverage,
		item.stdDev,
		Math.log(1 + item.reviewCount), // 対数変換
		item.previousItemScores.length > 0
			? item.previousItemScores.reduce((a, b) => a + b, 0) / item.previousItemScores.length
			: 0,
	])

	// y を二次元配列として型付け
	const y: number[][] = data.map(item => [item.reviewAverage])

	console.log('X:', X)
	console.log('y:', y)

	// 標準化
	const means = calculateMeans(X)
	const stds = calculateStds(X, means)
	const scaler: StandardScaler = { means, stds }

	// 標準偏差が 0 の場合は標準化を行わない
	const X_normalized = standardizeData(X, scaler)

	console.log('Normalized X:', X_normalized)
	console.log('Scaler Means:', means)
	console.log('Scaler Stds:', stds)

	// 回帰モデルの訓練
	const mlr = new MultivariateLinearRegression(X_normalized, y, { intercept: true })

	// ここでログを追加して、係数がどのように変化しているかを確認する
	console.log('mlr.weights:', mlr.weights)

	return { mlr, scaler }
}

// 予測を行う関数
const predictNextReview = (
	mlr: MultivariateLinearRegression,
	nextMovie: ReviewData,
	scaler: StandardScaler,
): number => {
	// 新しいデータを標準化
	const nextMovieFeatures: number[] = [
		nextMovie.weightedAverage,
		nextMovie.stdDev,
		Math.log(1 + nextMovie.reviewCount), // 対数変換
		nextMovie.previousItemScores.length > 0
			? nextMovie.previousItemScores.reduce((a, b) => a + b, 0) /
				nextMovie.previousItemScores.length
			: 0,
	]

	// 標準化の再確認
	const nextMovieNormalized: number[][] = [
		nextMovieFeatures.map((value, index) => {
			if (scaler.stds[index] === 0 || Math.abs(scaler.stds[index]) < 1e-6) return 0
			return (value - scaler.means[index]) / scaler.stds[index]
		}),
	]

	console.log('Normalized nextMovieData:', nextMovieNormalized)

	// モデルの predict メソッドを使用
	const predictions: number[][] = mlr.predict(nextMovieNormalized)
	const rawPrediction: number = predictions[0][0]
	console.log('Raw prediction:', rawPrediction)

	// 予測値が0から5の範囲内に収まるように調整
	const prediction: number = Math.max(0, Math.min(rawPrediction, 5))
	console.log('Validated prediction:', prediction)

	return prediction
}

// サーバーコンポーネント
type DMMActressRegressionProps = {
	actressStats: ActressStats
}

const getPreviousMonthCumulativeCount = (
	sortedMonths: string[],
	cumulativeReviewCount: { [date: string]: number },
	currentIndex: number,
): number => {
	// 最初の月の場合、前月はないため0を返す
	if (currentIndex === 0) return 0

	// 前月の月を取得
	const previousMonth = sortedMonths[currentIndex - 1]

	// 累積レビュー数から前月のデータを取得
	const previousMonthDates = Object.keys(cumulativeReviewCount).filter(date =>
		date.startsWith(previousMonth),
	)

	// 前月にデータがない場合は0を返す
	if (previousMonthDates.length === 0) return 0

	// 最後の日付の累積レビュー数を返す
	const lastDate = previousMonthDates[previousMonthDates.length - 1]
	return cumulativeReviewCount[lastDate]
}

const DMMActressRegression = async ({ actressStats }: DMMActressRegressionProps) => {
	let regressionResult: RegressionResult = {
		predictedReview: 0,
		regressionEquation: '',
		nextMovie: {
			weightedAverage: 0,
			stdDev: 0,
			reviewCount: 0,
			previousItemScores: [],
		},
		errorMessage: null,
	}

	try {
		// データのバリデーション
		if (
			!actressStats ||
			!actressStats.metadata ||
			!actressStats.annualData ||
			!actressStats.timeSeriesData ||
			!actressStats.timeSeriesData.time_series_analysis ||
			!actressStats.timeSeriesData.time_series_analysis.monthly_trends ||
			!actressStats.timeSeriesData.time_series_analysis.cumulative_review_count
		) {
			regressionResult.errorMessage = 'アクターの統計データが不足しています。'
			return <DMMActressRegressionClient {...regressionResult} />
		}

		const metadata = actressStats.metadata
		const monthlyTrends = actressStats.timeSeriesData.time_series_analysis.monthly_trends
		const cumulativeReviewCount =
			actressStats.timeSeriesData.time_series_analysis.cumulative_review_count

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

		console.log('reviewData:', reviewData)

		// 回帰分析の実行
		const { mlr, scaler } = performRegressionAnalysis(reviewData)
		console.log('回帰分析結果: model', mlr)

		// 回帰係数の取得
		const weights = mlr.weights // number[][]
		const modelWeights = weights.flat()

		if (modelWeights.length < 5) {
			throw new Error('回帰係数の数が不足しています。')
		}

		const intercept = modelWeights[0]
		const coefWeightedAverage = modelWeights[1]
		const coefStdDev = modelWeights[2]
		const coefLogReviewCount = modelWeights[3]
		const coefAvgPrevScores = modelWeights[4]

		const regressionEquation = `y = ${intercept.toFixed(4)} + (${coefWeightedAverage.toFixed(
			4,
		)}) * weightedAverage + (${coefStdDev.toFixed(4)}) * stdDev + (${coefLogReviewCount.toFixed(
			4,
		)}) * log(1 + reviewCount) + (${coefAvgPrevScores.toFixed(4)}) * avgPreviousItemScores`

		// 次作の予測データを構築
		const nextMovieData: ReviewData = {
			weightedAverage: metadata.weighted_average || 0,
			reviewAverage: 0, // 予測値を設定するため未使用
			reviewCount: metadata.total_review_count || 0,
			stdDev: metadata.review_std_dev || 0,
			previousItemScores: previousItemScores,
		}

		console.log('nextMovieData:', nextMovieData)

		// 予測値の計算
		const prediction = predictNextReview(mlr, nextMovieData, scaler)
		console.log('予測値:', prediction)

		// 結果の設定
		regressionResult = {
			predictedReview: prediction,
			regressionEquation,
			nextMovie: {
				weightedAverage: nextMovieData.weightedAverage,
				stdDev: nextMovieData.stdDev,
				reviewCount: nextMovieData.reviewCount,
				previousItemScores: nextMovieData.previousItemScores,
			},
			errorMessage: null,
		}
	} catch (error) {
		console.error(error)
		regressionResult.errorMessage = '回帰分析中にエラーが発生しました。'
	}

	return <DMMActressRegressionClient {...regressionResult} />
}

export default DMMActressRegression
