// File: app/makers/[...slug]/page.tsx

import { PaginationResponse } from '@/_types_doujin/doujintypes'
import DMMItemContainerPagination from '@/app/components/dmmcomponents/Pagination/Pagination'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

interface PageProps {
	params: { slug?: string[] }
}

const SITE_NAME = 'エロコメスト'

function decodeAndEncodeMakerName(encodedName: string): string {
	try {
		const decodedName = decodeURIComponent(encodedName)
		return encodeURIComponent(decodedName)
	} catch (error) {
		console.error('Failed to decode/encode maker name:', error)
		return encodedName
	}
}

export function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const [encodedMakerName, , page] = params.slug || []
	const currentPage = page ? Number.parseInt(page, 10) : 1

	if (!encodedMakerName) {
		return Promise.resolve({
			title: 'ページが見つかりません | ' + SITE_NAME,
			description: '指定されたページは存在しません。',
		})
	}

	const makername = decodeURIComponent(decodeAndEncodeMakerName(encodedMakerName))

	try {
		const pageTitle = `${makername} ${currentPage > 1 ? ` - ページ ${currentPage}` : ''} | ${SITE_NAME}`
		const description = `${makername} の作品一覧です。${currentPage}ページ目を表示しています。`

		return Promise.resolve({
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
		})
	} catch (error) {
		console.error('[Server] Failed to fetch metadata:', error)
		return Promise.resolve({
			title: `${makername} | ${SITE_NAME}`,
			description: `${makername} の作品一覧です。`,
		})
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
		// APIリクエストのURLを出力
		const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/doujin-maker-pagination?maker=${encodeURIComponent(
			makername,
		)}&page=${currentPage}`
		console.log('APIリクエストURL:', apiUrl) // リクエストURLを出力

		const response = await fetch(apiUrl, { next: { revalidate: 10080 } })

		// レスポンスのステータスコードを出力
		console.log('メーカー レスポンスステータスコード:', response.status)

		if (!response.ok) {
			throw new Error('API request failed.')
		}

		const data = (await response.json()) as PaginationResponse

		// レスポンスデータを出力
		console.log('APIレスポンスデータ:', data) // レスポンスデータを出力

		return (
			<section className='max-w-7xl mx-auto'>
				<Suspense fallback={<LoadingSpinner />}>
					{/* DMMItemContainerPagination に props を渡す */}
					<DMMItemContainerPagination
						items={data.items}
						currentPage={data.currentPage}
						totalPages={data.totalPages}
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
