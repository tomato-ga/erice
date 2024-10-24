'use client'

import { ActressStats } from '@/_types_dmm/statstype'
import {
	ArcElement,
	BarElement,
	CategoryScale,
	Chart as ChartJS,
	ChartOptions,
	Legend,
	LineElement,
	LinearScale,
	PointElement,
	Title,
	Tooltip,
} from 'chart.js'
import { useEffect, useState } from 'react'
import { Bar, Chart, Line, Pie } from 'react-chartjs-2'

// BoxPlotControllerをインポートして登録
import { BoxAndWiskers, BoxPlotController } from '@sgratzl/chartjs-chart-boxplot'
import DMMActressStatsWriting from './DMMActressStatsWriting'

// 必要なChart.jsプラグインの登録
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
	BoxPlotController, // BoxPlotControllerを登録
	BoxAndWiskers, // BoxAndWhiskersを登録
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

type Statistics = {
	metadata: {
		review_average: number
		total_review_count: number
		weighted_average: number
		review_score_distribution: Distribution
		top_3_popular_items: TopItem[]
	}
	timeSeriesData: {
		time_series_analysis: TimeSeriesAnalysis
	}
	annualData: {
		annual_review_average: { [year: string]: number }
		annual_review_median: { [year: string]: number }
		annual_review_std_dev: { [year: string]: number }
		annual_box_plot: BoxPlotData
	}
}

// コンポーネントのProps型定義
type ReviewDistributionChartProps = {
	distribution: Distribution | null
}

type MonthlyTrendChartProps = {
	monthlyTrends: { [key: string]: number }
}

type QuarterlyTrendChartProps = {
	quarterlyTrends: { [key: string]: number }
}

type CumulativeReviewChartProps = {
	cumulativeReviews: { [key: string]: number }
}

type PopularItemsChartProps = {
	topItems: (TopItem | null)[]
}

type AnnualStatsChartProps = {
	annualStats: {
		average: { [year: string]: number }
		median: { [year: string]: number }
		std_dev: { [year: string]: number }
	}
}

// BoxPlotDataの型定義
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

// レビュー分布グラフコンポーネント
const ReviewDistributionChart: React.FC<ReviewDistributionChartProps> = ({ distribution }) => {
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
		<div className='w-full md:w-1/2 p-4'>
			<h3 className='text-xl font-bold mb-4'>レビュースコア分布</h3>
			<Pie data={data} />
		</div>
	)
}

// 月間トレンドグラフコンポーネント
const MonthlyTrendChart: React.FC<MonthlyTrendChartProps> = ({ monthlyTrends }) => {
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
		<div className='w-full md:w-1/2 p-4'>
			<h3 className='text-xl font-bold mb-4'>月間レビュートレンド</h3>
			<Line data={data} />
		</div>
	)
}

// 四半期トレンドグラフコンポーネント
const QuarterlyTrendChart: React.FC<QuarterlyTrendChartProps> = ({ quarterlyTrends }) => {
	const sortedLabels = Object.keys(quarterlyTrends).sort((a, b) => {
		const getQuarterStart = (quarterStr: string) => {
			const [q, year] = quarterStr.split(' ')
			let month = 0
			switch (q) {
				case 'Q1':
					month = 1
					break
				case 'Q2':
					month = 4
					break
				case 'Q3':
					month = 7
					break
				case 'Q4':
					month = 10
					break
				default:
					month = 1
			}
			return new Date(`${year}-${month}-01`).getTime()
		}
		// ここを変更: a - b を b - a に変更
		return getQuarterStart(b) - getQuarterStart(a) // この行を変更
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
		<div className='w-full md:w-1/2 p-4'>
			<h3 className='text-xl font-bold mb-4'>3ヶ月ごとのレビュー平均点推移</h3>
			<Line data={data} />
		</div>
	)
}

// 累積レビュー数グラフコンポーネント
const CumulativeReviewChart: React.FC<CumulativeReviewChartProps> = ({ cumulativeReviews }) => {
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
		<div className='w-full md:w-1/2 p-4'>
			<h3 className='text-xl font-bold mb-4'>累積レビュー数推移</h3>
			<Line data={data} />
		</div>
	)
}

// 人気作品レビューグラフコンポーネント
const PopularItemsChart: React.FC<PopularItemsChartProps> = ({ topItems }) => {
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
		<div className='w-full p-4'>
			<h3 className='text-xl font-bold mb-4'>人気作品のレビュー統計</h3>
			<Bar data={data} />
		</div>
	)
}

// 年間統計をGrouped Bar Chartで表示するコンポーネント
const AnnualStatsChart: React.FC<AnnualStatsChartProps> = ({ annualStats }) => {
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

	const options: ChartOptions<'bar'> = {
		responsive: true,
		plugins: {
			legend: {
				position: 'top',
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
		<div className='w-full md:w-1/2 p-4'>
			<h3 className='text-xl font-bold mb-4'>年間レビュー統計</h3>
			<Bar data={data} options={options} />
		</div>
	)
}

// 箱ひげ図コンポーネントの修正
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

	const options: ChartOptions<'boxplot'> = {
		responsive: true,
		plugins: {
			legend: {
				position: 'top',
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
		<div className='w-full md:w-1/2 p-4'>
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
			<div className='relative group'>
				<Chart type='boxplot' data={data} options={options} />
			</div>
		</div>
	)
}

// メインの統計表示コンポーネント
const DMMActressStats: React.FC<{ actress_id: number; actress_name: string }> = ({
	actress_id,
	actress_name,
}) => {
	const [actressStats, setActressStats] = useState<ActressStats | null>(null)

	useEffect(() => {
		const fetchStats = async () => {
			const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/dmm-actress-stats?actress_id=${actress_id}`
			const response = await fetch(apiUrl, { next: { revalidate: 2419200 } })
			const data = (await response.json()) as ActressStats
			setActressStats(data)
		}

		fetchStats()
	}, [actress_id])

	if (!actressStats?.metadata || !actressStats?.timeSeriesData || !actressStats?.annualData) {
		return null
	}

	const reviewDistribution = actressStats.metadata.review_score_distribution
	const topItems = actressStats.metadata.top_3_popular_items

	// 年間統計データの準備
	const annualStats = {
		average: actressStats.annualData.annual_review_average,
		median: actressStats.annualData.annual_review_median,
		std_dev: actressStats.annualData.annual_review_std_dev,
	}

	// 年間箱ひげ図データの準備
	const annualBoxPlotData = actressStats.annualData.annual_box_plot

	return (
		<div className='bg-white rounded-lg p-6 mb-8'>
			<h2 className='text-2xl font-bold mb-6'>セクシー女優「{actress_name}」さんの統計データ</h2>

			<DMMActressStatsWriting actressName={actress_name} actressStats={actressStats} />

			{/* 概要統計 */}
			<div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
				<div className='bg-gray-50 p-4 rounded-lg'>
					<h4 className='font-bold'>総合レビュー平均</h4>
					<p className='text-2xl'>{actressStats.metadata.review_average.toFixed(2)}</p>
				</div>
				<div className='bg-gray-50 p-4 rounded-lg relative group'>
					<h4 className='font-bold flex items-center'>
						評価バランスを反映した平均
						<span className='ml-1 cursor-help'>ⓘ</span>
					</h4>
					<p className='text-2xl'>{actressStats.metadata.weighted_average.toFixed(2)}</p>
					<div className='invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity absolute z-10 w-72 p-2 bg-gray-800 text-white text-sm rounded-lg -top-24 left-1/2 transform -translate-x-1/2 shadow-lg'>
						この平均は、レビュー数が多い商品をより重視して計算しています。レビューが多い商品ほど平均への影響が大きくなるように調整しています。これにより、全体の評価のバランスが取れるようになっています。
						<div className='absolute -bottom-2 left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-gray-800' />
					</div>
				</div>
				<div className='bg-gray-50 p-4 rounded-lg'>
					<h4 className='font-bold'>総レビュー数</h4>
					<p className='text-2xl'>{actressStats.metadata.total_review_count}</p>
				</div>
			</div>

			{/* グラフ表示 */}
			<div className='flex flex-wrap -mx-4'>
				<ReviewDistributionChart distribution={reviewDistribution} />
				<MonthlyTrendChart
					monthlyTrends={actressStats.timeSeriesData.time_series_analysis.monthly_trends}
				/>
				<QuarterlyTrendChart
					quarterlyTrends={actressStats.timeSeriesData.time_series_analysis.quarterly_trends}
				/>
				<CumulativeReviewChart
					cumulativeReviews={
						actressStats.timeSeriesData.time_series_analysis.cumulative_review_count
					}
				/>
				{/* 年間計と箱ひげ図を横並びに配置 */}
				<div className='w-full flex flex-wrap -mx-4'>
					<AnnualStatsChart annualStats={annualStats} />
					<BoxPlotChart annualBoxPlotData={annualBoxPlotData} />
				</div>
			</div>

			{/* 人気作品のレビュー統計 */}
			<PopularItemsChart topItems={topItems} />
		</div>
	)
}

export default DMMActressStats
