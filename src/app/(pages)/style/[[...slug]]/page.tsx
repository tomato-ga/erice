import DMMItemContainerPagination from '@/app/components/dmmcomponents/Pagination/Pagination'
import { DMMItemProps, ImageURLs } from '@/types/dmmtypes'
import next, { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense, cache } from 'react'

interface PageProps {
	params: { slug?: string[] }
}

const SITE_NAME = 'エロコメスト'

export function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const [encodedStyleName, , page] = params.slug || []
	const currentPage = page ? Number.parseInt(page, 10) : 1

	if (!encodedStyleName) {
		return Promise.resolve({
			title: 'ページが見つかりません | ' + SITE_NAME,
			description: '指定されたページは存在しません。',
		})
	}

	const styleName = decodeURIComponent(encodedStyleName)

	try {
		const pageTitle = `${styleName} ${currentPage > 1 ? ` - ページ ${currentPage}` : ''} | ${SITE_NAME}`
		const description = `${styleName} の動画一覧です。${currentPage}ページ目を表示しています。`

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
			title: `${styleName} | ${SITE_NAME}`,
			description: `${styleName} の動画一覧です。`,
		})
	}
}

export default async function StylePaginationPage({ params }: PageProps) {
	const { slug = [] } = params
	let currentPage = 1
	let styleName: string | undefined

	// URLパターンの解析
	if (slug.length >= 1) {
		const encodedStyleName = slug[0]
		styleName = decodeURIComponent(encodedStyleName)
		console.log('Decoded Style Name:', styleName)
		if (slug.length === 3 && slug[1] === 'page') {
			currentPage = Number.parseInt(slug[2], 10)
		} else if (slug.length !== 1) {
			notFound()
		}
	} else {
		notFound()
	}

	if (Number.isNaN(currentPage) || currentPage < 1 || !styleName) {
		notFound()
	}

	try {
		// APIリクエストのURLを出力
		const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/dmm-style-pagination?style=${encodeURIComponent(styleName)}&page=${currentPage}`
		console.log('APIリクエストURL:', apiUrl)

		const response = await fetch(apiUrl, { next: { revalidate: 10080 } })

		// レスポンスのステータスコードを出力
		console.log('スタイルレスポンスステータスコード:', response.status)

		if (!response.ok) {
			throw new Error('API request failed.')
		}

		const data = (await response.json()) as {
			items: DMMItemProps[]
			currentPage: number
			totalPages: number
			style?: string
		}

		// レスポンスデータを出力
		console.log('APIレスポンスデータ:', data.items[0])

		return (
			<section className='max-w-7xl mx-auto'>
				<Suspense fallback={<LoadingSpinner />}>
					<DMMItemContainerPagination
						items={data.items}
						currentPage={data.currentPage}
						totalPages={data.totalPages}
						category={styleName}
						categoryType='style'
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
		<div className='text-center text-red-600 py-8' role='alert'>
			<p>{message}</p>
		</div>
	)
}
