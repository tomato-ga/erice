// File: app/makers/[...slug]/page.tsx

import { Stats } from '@/_types_dmm/statstype'
import { PaginationResponse } from '@/_types_doujin/doujintypes'
import DMMItemContainerPagination from '@/app/components/dmmcomponents/Pagination/Pagination'
import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

const DynamicDoujinMakerStats = dynamic(
	() => import('@/app/components/dmmcomponents/Stats/DoujinMakerStats'),
)

interface PageProps {
	params: { slug?: string[] }
}

function decodeAndEncodeMakerName(encodedName: string): string {
	try {
		const decodedName = decodeURIComponent(encodedName)
		return encodeURIComponent(decodedName)
	} catch (error) {
		console.error('Failed to decode/encode maker name:', error)
		return encodedName
	}
}

// 共通の型定義
interface MakerData {
	paginationData: PaginationResponse
	statsData?: Stats
}

// 共通のfetch関数
async function fetchMakerData(makername: string, currentPage: number): Promise<MakerData> {
	const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/doujin-maker-pagination?maker=${encodeURIComponent(
		makername,
	)}&page=${currentPage}`

	const response = await fetch(apiUrl, { next: { revalidate: 10080 } })

	if (!response.ok) {
		throw new Error('API request failed.')
	}

	const paginationData = (await response.json()) as PaginationResponse

	// statsDataの取得
	let statsData: Stats | undefined
	if (paginationData.maker_id) {
		const statsResponse = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/api/doujin-maker-stats?maker_id=${paginationData.maker_id}`,
			{ cache: 'force-cache' },
		)
		statsData = await statsResponse.json()
	}

	return { paginationData, statsData }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const [encodedMakerName, , page] = params.slug || []
	const currentPage = page ? Number.parseInt(page, 10) : 1

	if (!encodedMakerName) {
		return {
			title: 'ページが見つかりません',
			description: '指定されたページは存在しません。',
		}
	}

	const makername = decodeURIComponent(decodeAndEncodeMakerName(encodedMakerName))

	try {
		const { statsData } = await fetchMakerData(makername, currentPage)

		const pageTitle = `${makername} ${currentPage > 1 ? ` - ページ ${currentPage}` : ''}`
		const description = `${makername}の同人作品一覧ページです。
		${makername}の総レビュー数は${statsData?.metadata?.total_review_count ? `${statsData.metadata.total_review_count}件、` : ''}${
			statsData?.metadata?.overall_review_average
				? `総レビュー平均点は${statsData.metadata.overall_review_average.toFixed(1)}点、`
				: ''
		}${
			statsData?.metadata?.weighted_average
				? `レビューの加重平均評価は${statsData.metadata.weighted_average.toFixed(1)}点です。`
				: ''
		}`

		return {
			title: pageTitle,
			description: description,
			openGraph: {
				title: pageTitle,
				description: description,
			},
			twitter: {
				card: 'summary',
				title: pageTitle,
				description: description,
			},
		}
	} catch (error) {
		console.error('[Server] Failed to fetch metadata:', error)
		return {
			title: `${makername}`,
			description: `${makername} の作品一覧です。`,
		}
	}
}

export default async function MakerPaginationPage({ params }: PageProps) {
	const { slug = [] } = params
	let currentPage = 1
	let makername: string | undefined

	// URLパターンの解析
	if (slug.length >= 1) {
		const encodedMakerName = slug[0]
		makername = decodeURIComponent(decodeAndEncodeMakerName(encodedMakerName))
		if (slug.length === 3 && slug[1] === 'page') {
			currentPage = Number.parseInt(slug[2], 10)
		} else if (slug.length !== 1) {
			notFound()
		}
	} else {
		notFound()
	}

	if (Number.isNaN(currentPage) || currentPage < 1 || !makername) {
		notFound()
	}

	try {
		const { paginationData, statsData } = await fetchMakerData(makername, currentPage)

		return (
			<section className='max-w-7xl mx-auto'>
				<Suspense fallback={<LoadingSpinner />}>
					{statsData && (
						<DynamicDoujinMakerStats
							makerStatsData={statsData}
							makerName={makername}
							isSummary={false}
						/>
					)}
					<DMMItemContainerPagination
						items={paginationData.items}
						currentPage={paginationData.currentPage}
						totalPages={paginationData.totalPages}
						category={makername}
						categoryType='doujinpagination'
					/>
				</Suspense>
			</section>
		)
	} catch (error) {
		console.error('[Server] Failed to fetch data:', error)
		return <ErrorDisplay message='データの取得に失敗しました。後でもう一度お試しください。' />
	}
}

function LoadingSpinner() {
	return (
		<div className='flex justify-center items-center h-64' aria-label='読み込み中'>
			<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900' />
		</div>
	)
}

function ErrorDisplay({ message }: { message: string }) {
	return (
		<div className='text-center text-red-600 py-8'>
			<p>{message}</p>
		</div>
	)
}
