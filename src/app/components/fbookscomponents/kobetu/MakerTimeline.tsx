import { Stats } from '@/_types_dmm/statstype'
import { TimelineApiResponse } from '@/_types_doujin/doujintypes'
import dynamic from 'next/dynamic'

const DynamicDoujinMakerStats = dynamic(
	() => import('../../dmmcomponents/Stats/DoujinMakerStats'),
	{
		loading: () => <LoadingSpinner />,
	},
)
const DynamicTimeline = dynamic(() => import('./Timeline'), {
	loading: () => <LoadingSpinner />,
})

interface MakerTimelinePageProps {
	searchParams: { maker_id?: string; maker_name?: string }
}

function LoadingSpinner() {
	return (
		<div className='flex justify-center items-center h-64' aria-label='読み込み中'>
			<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900' />
		</div>
	)
}

const MakerTimelinePage = async ({ searchParams }: MakerTimelinePageProps) => {
	const makerId = searchParams.maker_id
	const makerName = searchParams.maker_name

	if (!makerId && !makerName) {
		return (
			<div className='text-center p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded'>
				<p>メーカーIDまたはメーカー名が必要です。</p>
			</div>
		)
	}

	if (!process.env.NEXT_PUBLIC_API_URL) {
		throw new Error('API URL is not configured')
	}

	try {
		const [timelineResponse, statsResponse] = await Promise.all([
			fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/doujin-maker-timeline?maker_id=${makerId}`, {
				cache: 'force-cache',
			}),
			fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/doujin-maker-stats?maker_id=${makerId}`, {
				cache: 'force-cache',
			}),
		])

		if (!timelineResponse.ok || !statsResponse.ok) {
			throw new Error(
				`API request failed: ${timelineResponse.statusText} ${statsResponse.statusText}`,
			)
		}

		const timelineData = (await timelineResponse.json()) as TimelineApiResponse
		const statsData = (await statsResponse.json()) as Stats

		if (timelineData.length === 0) {
			return (
				<div className='text-center p-4 bg-green-100 border border-green-400 text-green-700 rounded'>
					<p>指定されたメーカーの作品が見つかりませんでした。</p>
				</div>
			)
		}

		return (
			<>
				<DynamicDoujinMakerStats
					makerStatsData={statsData}
					makerName={makerName || ''}
					isSummary={false}
				/>
				<DynamicTimeline items={timelineData} title={`${makerName}の発売作品タイムライン`} />
			</>
		)
	} catch (error) {
		console.error('Error fetching data:', error)
		return (
			<div className='text-center p-4 bg-red-100 border border-red-400 text-red-700 rounded'>
				<p>エラーが発生しました。</p>
				<p>管理者にお問い合わせください。</p>
				{process.env.NODE_ENV === 'development' && (
					<p className='mt-2 text-sm'>{(error as Error).message}</p>
				)}
			</div>
		)
	}
}

export default MakerTimelinePage
