// /app/series_timeline/page.tsx
import { TimelineApiResponse } from '@/_types_doujin/doujintypes'
import Timeline from './Timeline'

interface SeriesTimelinePageProps {
	searchParams: { series_id?: string; series_name?: string }
}

const SeriesTimelinePage = async ({ searchParams }: SeriesTimelinePageProps) => {
	const seriesId = searchParams.series_id
	const seriesName = searchParams.series_name

	if (!seriesId && !seriesName) {
		return
	}

	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/api/doujin-series-timeline?series_id=${seriesId}`,
			{
				cache: 'force-cache',
			},
		)

		if (!response.ok) {
			console.error('Failed to fetch data from API:', response.statusText)
			return (
				<div className='text-center p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded'>
					<p>データの取得に失敗しました。</p>
				</div>
			)
		}

		const data: TimelineApiResponse = await response.json()

		// Handle empty data
		if (data.length === 0) {
			return (
				<div className='text-center p-4 bg-green-100 border border-green-400 text-green-700 rounded'>
					<p>指定されたシリーズの作品が見つかりませんでした。</p>
				</div>
			)
		}

		return <Timeline items={data} title={`${seriesName}シリーズの発売作品タイムライン`} />
	} catch (error) {
		console.error('Error fetching data:', error)
		return (
			<div className='text-center p-4 bg-red-100 border border-red-400 text-red-700 rounded'>
				<p>エラーが発生しました。</p>
				<p>管理者にお問い合わせください。</p>
			</div>
		)
	}
}

export default SeriesTimelinePage
