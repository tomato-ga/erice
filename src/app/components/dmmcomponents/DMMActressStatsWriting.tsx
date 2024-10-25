// src/app/components/dmmcomponents/DMMActressStatsWriting.tsx

import { ActressStats } from '@/_types_dmm/statstype'
import React from 'react'
// import DMMActressRegression from './DMMActressRegression'
import DMMActressRegression from './DMMActressRegression'

type Props = {
	actressName: string
	actressStats: ActressStats | null
}

const DMMActressStatsWriting: React.FC<Props> = ({ actressName, actressStats }) => {
	if (
		!actressStats ||
		!actressStats.metadata ||
		!actressStats.annualData ||
		!actressStats.timeSeriesData
	) {
		return null
	}

	const {
		review_average,
		total_review_count,
		last_updated,
		top_3_popular_items,
		weighted_average,
	} = actressStats.metadata

	const { annual_review_average, annual_review_median, annual_review_std_dev, annual_box_plot } =
		actressStats.annualData

	const { quarterly_trends, cumulative_review_count } =
		actressStats.timeSeriesData.time_series_analysis

	// 必要なデータを処理し、変数に格納
	const overallReviewAverage = review_average
	const totalReviewCount = total_review_count
	const topItems = top_3_popular_items.filter(
		(item): item is NonNullable<typeof item> => item !== null,
	)
	const annualStats = Object.keys(annual_review_average).reduce(
		(acc, year) => {
			acc[year] = {
				average: annual_review_average[year],
				median: annual_review_median[year],
				min: annual_box_plot[year]?.min || 0,
				max: annual_box_plot[year]?.max || 0,
				std_dev: annual_review_std_dev[year],
			}
			return acc
		},
		{} as Record<
			string,
			{ average: number; median: number; min: number; max: number; std_dev: number }
		>,
	)

	// 年度順にソート
	const sortedYears = Object.keys(annualStats).sort()
	const latestYear = sortedYears[sortedYears.length - 1]
	const latestYearStats = annualStats[latestYear]

	// 評価のばらつき分析（年ごとの標準偏差の変動を利用）
	const standardDeviationAnalysis = () => {
		let analysis = ''

		// 最新の年の標準偏差を取得
		const latestYearStdDev = latestYearStats.std_dev

		if (latestYearStdDev > 1) {
			analysis = `${actressName}さんの最新の作品に対する評価は、標準偏差が${latestYearStdDev.toFixed(
				2,
			)}となっており、評価にばらつきが見られます。これは、視聴者の間で作品ごとに好みが分かれている可能性が高いことを示しています。彼女が多様な役柄に挑戦している結果とも言えるでしょう。`
		} else if (latestYearStdDev < 1) {
			analysis = `${actressName}さんの最新の作品は、標準偏差が${latestYearStdDev.toFixed(
				2,
			)}と非常に低く、作品による評価のバラツキが低いことから、視聴者からの評価が一貫して高いことが伺えます。これは、彼女の演技や作品が幅広い視聴者に安定して受け入れられていることを示しています。`
		} else {
			analysis = `${actressName}さんの最新の作品は、標準偏差が${latestYearStdDev.toFixed(
				2,
			)}で、評価が非常に安定していることがわかります。彼女のパフォーマンスは一定の品質を保ち続けているようです。`
		}

		// 最新年の標準偏差の推移を説明として追加
		analysis += ` ${latestYear}年の標準偏差は${latestYearStdDev.toFixed(2)}です。`

		return analysis
	}

	// まとめの文章生成
	const generateConclusion = () => {
		if (overallReviewAverage >= 4.0) {
			return `${actressName}さんの作品は、レビュー平均が${overallReviewAverage.toFixed(
				2,
			)}と高評価を維持しており、特に最近の作品が大きな注目を集めています。評価の安定性が確認されており、初めて彼女の作品を視聴する方にも自信を持っておすすめできます。`
		}

		return `${actressName}さんの作品は、レビュー平均が${overallReviewAverage.toFixed(
			2,
		)}と一定の評価を得ており、今後の活躍が期待されます。様々なジャンルへの挑戦により、さらにファンを増やしていくことでしょう。`
	}

	// Add this function before the return statement
	const evaluateTrend = () => {
		const trendAnalysis =
			sortedYears.length >= 2
				? annualStats[latestYear].average > annualStats[sortedYears[0]].average
					? `${actressName}さんの評価は上昇傾向にあり、特に${latestYear}年は平均${annualStats[latestYear].average.toFixed(2)}と好評を得ています。`
					: `${actressName}さんは安定した評価を維持しており、${latestYear}年は平均${annualStats[latestYear].average.toFixed(2)}となっています。`
				: `${latestYear}年の平均評価は${annualStats[latestYear].average.toFixed(2)}となっています。`

		return trendAnalysis
	}

	// Add this function before the return statement
	const reviewGrowthAnalysis = () => {
		const dates = Object.keys(cumulative_review_count).sort()
		const initialCount = cumulative_review_count[dates[0]]
		const latestCount = cumulative_review_count[dates[dates.length - 1]]

		return `${actressName}さんの作品は${dates[0]}から${dates[dates.length - 1]}までの期間で、レビュー数が${initialCount}件から${latestCount}件まで増加しました。これは着実なファン層の拡大を示しています。`
	}

	return (
		<div className='bg-white rounded-lg p-6 mb-8'>
			<h1 className='text-2xl font-bold mb-6'>
				{actressName}さんのレビュー統計分析と人気作品の傾向
			</h1>

			{/* 概要情報 */}
			<p>
				<strong>総合レビュー平均</strong>：{overallReviewAverage.toFixed(2)} <br />
				<strong>評価バランス平均</strong>：{weighted_average.toFixed(2)} <br />
				<strong>総レビュー数</strong>：{totalReviewCount}件 <br />
				<strong>最終更新日</strong>：{last_updated}
			</p>

			<hr className='my-4' />

			{/* はじめに */}
			{/* <h2 className='text-xl font-bold mb-4'>はじめに</h2> */}
			<p>
				セクシー女優の<strong>{actressName}</strong>
				さんの作品に寄せられたレビューデータをもとに、最近の人気作品やレビュー評価傾向を詳しく分析します。
				<strong>{actressName}</strong>さんの作品を視聴する方の参考になれば幸いです。
			</p>

			{/* レビュースコア分布と人気作品の傾向 */}
			<h2 className='text-xl font-bold mt-6 mb-4'>レビュースコア分布と人気作品の傾向</h2>

			{/* 人気作品トップ3 */}
			<h3 className='text-lg font-bold mb-2'>人気作品トップ3</h3>
			{topItems.map((item, index) => (
				<div key={item.id} className='mb-4'>
					<h4 className='font-bold'>
						{index + 1}. 「{item.title}」
					</h4>
					<ul className='list-disc list-inside ml-4'>
						<li>
							<strong>レビュー数</strong>：{item.review_count}件
						</li>
						<li>
							<strong>平均スコア</strong>：{item.review_average}
						</li>
						<li>
							<strong>リリース日</strong>：{item.release_date}
						</li>
						{item.description && (
							<li>
								<strong>作品概要</strong>：{item.description}
							</li>
						)}
					</ul>
				</div>
			))}

			{/* 時期ごとの評価トレンド */}
			<h2 className='text-xl font-bold mt-6 mb-4'>時期ごとの評価トレンド</h2>
			<p>年間のレビュー平均を分析すると、以下のような傾向が見られます。</p>
			{sortedYears.map(year => (
				<p key={year}>
					<strong>{year}年</strong>：平均スコア{' '}
					<strong>{annualStats[year].average.toFixed(2)}</strong>
				</p>
			))}
			{/* 評価トレンドの分析を追加 */}
			<p className='mt-2'>{evaluateTrend()}</p>

			{/* 累積レビュー数の成長 */}
			<h2 className='text-xl font-bold mt-6 mb-4'>累積レビュー数の成長</h2>
			{(() => {
				const dates = Object.keys(cumulative_review_count).sort()
				const initialDate = dates[0]
				const latestDate = dates[dates.length - 1]
				const initialCount = cumulative_review_count[initialDate]
				const latestCount = cumulative_review_count[latestDate]
				return (
					<>
						<p>累積レビュー数は以下のように推移しています。</p>
						<p>
							<strong>{initialDate}</strong>：{initialCount}件
						</p>
						<p>
							<strong>{latestDate}</strong>：{latestCount}件
						</p>
						<p className='mt-2'>{reviewGrowthAnalysis()}</p>
					</>
				)
			})()}

			{/* 年間統計データと評価のばらつき */}
			<h2 className='text-xl font-bold mt-6 mb-4'>年間統計データと評価のばらつき</h2>
			<p>年間のレビュー中央値や評価の分布から、以下のことが分かります。</p>
			<ul className='list-disc list-inside ml-4'>
				<li>
					<strong>{latestYear}年</strong>： 平均スコア {latestYearStats.average.toFixed(2)}、中央値{' '}
					{latestYearStats.median.toFixed(2)}、標準偏差 {latestYearStats.std_dev.toFixed(2)}
				</li>
			</ul>
			<p className='mt-2'>{standardDeviationAnalysis()}</p>

			{/* 回帰分析 */}
			<DMMActressRegression actressStats={actressStats} />

			{/* まとめ */}
			<h2 className='text-xl font-bold mt-6 mb-4'>まとめ</h2>
			<p>{generateConclusion()}</p>

			<hr className='my-4' />

			{/* <p className='text-sm font-bold'>
				※アダルト動画のレビュー情報を元に、独自の統計処理を施したデータに基づいて作成されています。
			</p> */}
		</div>
	)
}

export default DMMActressStatsWriting
