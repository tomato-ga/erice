'use client'

import { BoxAndWiskers, BoxPlotController } from '@sgratzl/chartjs-chart-boxplot'
import {
	ArcElement,
	BarElement,
	CategoryScale,
	Chart as ChartJS,
	Legend,
	LineElement,
	LinearScale,
	PointElement,
	Title,
	Tooltip,
} from 'chart.js'
import React from 'react'
import { Bar, Chart, Line, Pie } from 'react-chartjs-2'

import { Stats } from '@/_types_dmm/statstype'

// Chart.jsのプラグインを登録
ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	BarElement,
	ArcElement,
	Title,
	Tooltip,
	Legend,
	BoxPlotController,
	BoxAndWiskers,
)

// 型定義
type Distribution = {
	frequencies: { [key: string]: number }
	histogram: number[]
}

type TopItem = {
	id: number
	title: string
	review_average: number
	review_count: number
	release_date: string
}

type TimeSeriesAnalysis = {
	monthly_trends: { [key: string]: number }
	quarterly_trends: { [key: string]: number }
	cumulative_review_count: { [key: string]: number }
}

type BoxPlotData = Record<
	string,
	{
		min: number
		max: number
		q1: number
		median: number
		q3: number
	} | null
>

// コンポーネントのProps型定義
type DMMStatsChartsProps = {
	stats: Stats
	name: string
}

// グラフコンテナのクラス
const graphContainerClass = 'w-full md:w-1/2 p-2 md:p-4'

// 共通のグラフオプション
const commonChartOptions = {
	responsive: true,
	maintainAspectRatio: false,
	plugins: {
		legend: {
			position: 'bottom' as const,
			labels: {
				font: {
					size: 14,
				},
			},
		},
	},
}

const DMMStatsCharts: React.FC<DMMStatsChartsProps> = ({ stats, name }) => {
	if (!stats || !stats.metadata || !stats.timeSeriesData || !stats.annualData) {
		return null
	}

	const reviewDistribution = stats.metadata.review_score_distribution
	const topItems = stats.metadata.top_3_popular_items

	// 年間統計データの準備
	const annualStats = {
		average: stats.annualData.annual_review_average,
		median: stats.annualData.annual_review_median,
		std_dev: stats.annualData.annual_review_std_dev,
	}

	// 年間箱ひげ図データの準備
	const annualBoxPlotData = stats.annualData.annual_box_plot

	return (
		<>
			{/* 概要統計 */}
			<div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
				<div className='bg-gray-50 p-4 rounded-lg'>
					<h4 className='font-bold'>総合レビュー平均点</h4>
					<p className='text-2xl'>{stats.metadata.review_average.toFixed(2)}</p>
				</div>
				<div className='bg-gray-50 p-4 rounded-lg relative group'>
					<h4 className='font-bold flex items-center'>
						評価バランスを反映したレビュー平均点
						<span className='ml-1 cursor-help'>ⓘ</span>
					</h4>
					<p className='text-2xl'>{stats.metadata.weighted_average.toFixed(2)}</p>
					<div className='invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity absolute z-10 w-72 p-2 bg-gray-800 text-white text-sm rounded-lg -top-24 left-1/2 transform -translate-x-1/2 shadow-lg'>
						この平均は、レビュー数が多い商品をより重視して計算しています。レビューが多い商品ほど平均への影響が大きくなるように調整しています。これにより、全体の評価のバランスが取れるようになっています。
						<div className='absolute -bottom-2 left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-gray-800' />
					</div>
				</div>
				<div className='bg-gray-50 p-4 rounded-lg'>
					<h4 className='font-bold'>総レビュー数</h4>
					<p className='text-2xl'>{stats.metadata.total_review_count}</p>
				</div>
			</div>

			{/* グラフ表示 - コンテナのネガティブマージンを調整 */}
			<div className='flex flex-wrap -mx-2 md:-mx-4'>
				{/* レビュー分布グラフ */}
				<ReviewDistributionChart distribution={reviewDistribution} />
				{/* 月間トレンドグラフ */}
				<MonthlyTrendChart
					monthlyTrends={stats.timeSeriesData.time_series_analysis.monthly_trends}
				/>
				{/* 四半期トレンドグラフ */}
				<QuarterlyTrendChart
					quarterlyTrends={stats.timeSeriesData.time_series_analysis.quarterly_trends}
				/>
				{/* 累積レビュー数グラフ */}
				<CumulativeReviewChart
					cumulativeReviews={stats.timeSeriesData.time_series_analysis.cumulative_review_count}
				/>
				{/* 年間統計と箱ひげ図 */}
				<div className='w-full flex flex-wrap'>
					<AnnualStatsChart annualStats={annualStats} />
					<BoxPlotChart annualBoxPlotData={annualBoxPlotData} />
				</div>
				{/* 季節性パターン分析グラフ */}
				<SeasonalityChart
					quarterlyTrends={stats.timeSeriesData.time_series_analysis.quarterly_trends}
				/>
			</div>

			{/* 人気作品のレビュー統計 */}
			<PopularItemsChart topItems={topItems} />
		</>
	)
}

// 以下、各グラフコンポーネントを定義

// レビュー分布グラフコンポーネント
const ReviewDistributionChart: React.FC<{ distribution: Distribution | null }> = ({
	distribution,
}) => {
	if (!distribution) return null

	const backgroundColors = [
		'rgba(255, 99, 132, 0.6)',
		'rgba(54, 162, 235, 0.6)',
		'rgba(255, 206, 86, 0.6)',
		'rgba(75, 192, 192, 0.6)',
		'rgba(153, 102, 255, 0.6)',
		'rgba(255, 159, 64, 0.6)',
		'rgba(199, 199, 199, 0.6)',
		'rgba(83, 102, 255, 0.6)',
		'rgba(255, 99, 71, 0.6)',
		'rgba(60, 179, 113, 0.6)',
	]

	const data = {
		labels: Object.keys(distribution.frequencies),
		datasets: [
			{
				data: Object.values(distribution.frequencies),
				backgroundColor: backgroundColors.slice(0, Object.keys(distribution.frequencies).length),
			},
		],
	}

	return (
		<div className={graphContainerClass}>
			<h3 className='text-xl font-bold mb-4'>レビュースコア分布</h3>
			{/* スマホでは高さを大きく、PCではやや小さめに */}
			<div className='h-[400px] md:h-[300px]'>
				<Pie data={data} options={commonChartOptions} />
			</div>
		</div>
	)
}

// 月間トレンドグラフコンポーネント
const MonthlyTrendChart: React.FC<{ monthlyTrends: { [key: string]: number } }> = ({
	monthlyTrends,
}) => {
	const sortedLabels = Object.keys(monthlyTrends).sort(
		(a, b) => new Date(a).getTime() - new Date(b).getTime(),
	)
	const sortedData = sortedLabels.map(label => monthlyTrends[label])

	const data = {
		labels: sortedLabels,
		datasets: [
			{
				label: '月間平均レビュースコア',
				data: sortedData,
				borderColor: 'rgb(75, 192, 192)',
				tension: 0.1,
			},
		],
	}

	return (
		<div className={graphContainerClass}>
			<h3 className='text-xl font-bold mb-4'>月間レビュー平均点トレンド</h3>
			<div className='h-[400px] md:h-[300px]'>
				<Line data={data} options={commonChartOptions} />
			</div>
		</div>
	)
}

// 四半期トレンドグラフコンポーネント
const QuarterlyTrendChart: React.FC<{ quarterlyTrends: { [key: string]: number } }> = ({
	quarterlyTrends,
}) => {
	const sortedLabels = Object.keys(quarterlyTrends).sort((a, b) => {
		const [qA, yearA] = a.split(' ')
		const [qB, yearB] = b.split(' ')

		// まず年で比較
		if (yearA !== yearB) {
			return Number.parseInt(yearA) - Number.parseInt(yearB) // 昇順のまま
		}

		// 年が同じ場合は四半期で比較（Q1→Q2→Q3→Q4の順）
		const quarterMap = { Q1: 1, Q2: 2, Q3: 3, Q4: 4 }
		return quarterMap[qA as keyof typeof quarterMap] - quarterMap[qB as keyof typeof quarterMap] // 昇順のまま
	})
	const sortedData = sortedLabels.map(label => quarterlyTrends[label])

	const data = {
		labels: sortedLabels,
		datasets: [
			{
				label: '3ヶ月ごとのレビュー平均点',
				data: sortedData,
				borderColor: 'rgb(153, 102, 255)',
				tension: 0.1,
			},
		],
	}

	return (
		<div className={graphContainerClass}>
			<h3 className='text-xl font-bold mb-4'>3ヶ月ごとのレビュー平均点推移</h3>
			<div className='h-[400px] md:h-[300px]'>
				<Line data={data} options={commonChartOptions} />
			</div>
		</div>
	)
}

// 累積レビュー数グラフコンポーネント
const CumulativeReviewChart: React.FC<{ cumulativeReviews: { [key: string]: number } }> = ({
	cumulativeReviews,
}) => {
	const sortedLabels = Object.keys(cumulativeReviews).sort(
		(a, b) => new Date(a).getTime() - new Date(b).getTime(),
	)
	const sortedData = sortedLabels.map(label => cumulativeReviews[label])

	const data = {
		labels: sortedLabels,
		datasets: [
			{
				label: '累積レビュー数',
				data: sortedData,
				borderColor: 'rgb(255, 99, 132)',
				tension: 0.1,
			},
		],
	}

	return (
		<div className={graphContainerClass}>
			<h3 className='text-xl font-bold mb-4'>累積レビュー数推移</h3>
			<div className='h-[400px] md:h-[300px]'>
				<Line data={data} options={commonChartOptions} />
			</div>
		</div>
	)
}

// 年間統計グラフコンポーネント
const AnnualStatsChart: React.FC<{
	annualStats: {
		average: { [year: string]: number }
		median: { [year: string]: number }
		std_dev: { [year: string]: number }
	}
}> = ({ annualStats }) => {
	const years = Object.keys(annualStats.average).sort()

	const data = {
		labels: years,
		datasets: [
			{
				label: '平均値',
				data: years.map(year => annualStats.average[year]),
				backgroundColor: 'rgba(75, 192, 192, 0.6)',
			},
			{
				label: '中央値',
				data: years.map(year => annualStats.median[year]),
				backgroundColor: 'rgba(54, 162, 235, 0.6)',
			},
			{
				label: '標準偏差',
				data: years.map(year => annualStats.std_dev[year]),
				backgroundColor: 'rgba(153, 102, 255, 0.6)',
			},
		],
	}

	const options = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: 'top' as const,
			},
			title: {
				display: true,
				text: '年間レビュー統計',
			},
		},
		scales: {
			y: {
				beginAtZero: true,
				title: {
					display: true,
					text: 'スコア',
				},
			},
			x: {
				title: {
					display: true,
					text: '年度',
				},
			},
		},
	}

	return (
		<div className={graphContainerClass}>
			<h3 className='text-xl font-bold mb-4'>年間レビュー統計</h3>
			<div className='h-[400px] md:h-[300px]'>
				<Bar data={data} options={options} />
			</div>
		</div>
	)
}

// 箱ひげ図グラフコンポーネント
const BoxPlotChart: React.FC<{ annualBoxPlotData: BoxPlotData }> = ({ annualBoxPlotData }) => {
	const labels = Object.keys(annualBoxPlotData)
		.sort()
		.map(year => `${year}年`)

	const data = {
		labels: labels,
		datasets: [
			{
				label: 'レビューの箱ひげ図',
				data: Object.keys(annualBoxPlotData)
					.map(key => {
						const stats = annualBoxPlotData[key]
						return stats ? [stats.min, stats.q1, stats.median, stats.q3, stats.max] : null
					})
					.filter((data): data is number[] => data !== null),
				// 色を他のグラフと統一
				backgroundColor: 'rgba(75, 192, 192, 0.6)', // 変更
				borderColor: 'rgba(75, 192, 192, 1)', // 変更
				outlierColor: 'rgba(75, 192, 192, 0.8)', // 変更
			},
		],
	}

	const options = {
		responsive: true,
		maintainAspectRatio: false, // この設定を追加
		plugins: {
			legend: {
				position: 'top' as const,
			},
			title: {
				display: true,
				text: '年間レビュースコアの箱ひげ図',
			},
		},
		scales: {
			y: {
				beginAtZero: true,
				title: {
					display: true,
					text: 'レビュースコア',
				},
			},
			x: {
				title: {
					display: true,
					text: '年度',
				},
			},
		},
	}

	return (
		<div className={graphContainerClass}>
			<div className='flex items-center mb-4'>
				<h3 className='text-xl font-bold'>年間レビュースコアの箱ひげ図</h3>
				<span className='ml-1 cursor-help relative group'>
					ⓘ
					<div className='invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity absolute z-10 w-72 p-2 bg-gray-800 text-white text-sm rounded-lg -top-24 left-1/2 transform -translate-x-1/2 shadow-lg'>
						この箱ひげ図は、各年度のレビュースコアの分布を示しています。中央値、四分位数、最小値および最大値を視覚的に比較できます。
						<div className='absolute -bottom-2 left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-gray-800' />
					</div>
				</span>
			</div>
			<div className='relative group h-[400px] md:h-[300px]'>
				<Chart type='boxplot' data={data} options={options} />
			</div>
		</div>
	)
}

// 季節性パターン分析グラフコンポーネント
const SeasonalityChart: React.FC<{ quarterlyTrends: { [key: string]: number } }> = ({
	quarterlyTrends,
}) => {
	// 四半期データを季節ごとに集計
	const seasonalData = Object.entries(quarterlyTrends).reduce(
		(acc, [quarter, value]) => {
			const q = quarter.split(' ')[0] // "Q1 2023" → "Q1"
			if (!acc[q]) {
				acc[q] = { sum: 0, count: 0 }
			}
			acc[q].sum += value
			acc[q].count += 1
			return acc
		},
		{} as Record<string, { sum: number; count: number }>,
	)

	// 平均値を計算
	const averages = Object.entries(seasonalData).map(([quarter, data]) => ({
		quarter,
		average: data.sum / data.count,
	}))

	// グラフデータの準備
	const data = {
		labels: ['Q1 (1-3月)', 'Q2 (4-6月)', 'Q3 (7-9月)', 'Q4 (10-12月)'],
		datasets: [
			{
				label: '四半期ごとの平均レビュースコア',
				data: averages.map(a => a.average),
				backgroundColor: 'rgba(153, 102, 255, 0.6)',
				borderColor: 'rgba(153, 102, 255, 1)',
				borderWidth: 1,
			},
		],
	}

	const options = {
		...commonChartOptions,
		scales: {
			y: {
				beginAtZero: true,
				title: {
					display: true,
					text: '平均レビュースコア',
				},
			},
		},
		plugins: {
			tooltip: {
				callbacks: {
					label: (context: { parsed: { y: number } }) => {
						return `平均スコア: ${context.parsed.y.toFixed(2)}`
					},
				},
			},
		},
	}

	return (
		<div className={graphContainerClass}>
			<h3 className='text-xl font-bold mb-4'>
				季節性パターン分析
				<span className='ml-1 cursor-help relative group'>
					ⓘ
					<div className='invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity absolute z-10 w-72 p-2 bg-gray-800 text-white text-sm rounded-lg -top-24 left-1/2 transform -translate-x-1/2 shadow-lg'>
						各四半期のレビュースコア平均を比較し、季節による評価の傾向を分析します。
						<div className='absolute -bottom-2 left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-gray-800' />
					</div>
				</span>
			</h3>
			<div className='h-[400px] md:h-[300px]'>
				<Bar data={data} options={options} />
			</div>
		</div>
	)
}

// 人気作品レビューグラフコンポーネント
const PopularItemsChart: React.FC<{ topItems: (TopItem | null)[] }> = ({ topItems }) => {
	const validItems = topItems.filter((item): item is TopItem => item !== null)

	const data = {
		labels: validItems.map(item =>
			item.title.length > 20 ? item.title.substring(0, 20) + '...' : item.title,
		),
		datasets: [
			{
				label: 'レビュー平均',
				data: validItems.map(item => item.review_average),
				backgroundColor: 'rgba(75, 192, 192, 0.6)',
			},
			{
				label: 'レビュー数',
				data: validItems.map(item => item.review_count),
				backgroundColor: 'rgba(255, 99, 132, 0.6)',
			},
		],
	}

	return (
		<div className={graphContainerClass}>
			<h3 className='text-xl font-bold mb-4'>人気作品のレビュー統計</h3>
			{/* 高さを他のグラフと同様に制御 */}
			<div className='h-[400px] md:h-[300px]'>
				<Bar data={data} options={commonChartOptions} />
			</div>
		</div>
	)
}

export default DMMStatsCharts
