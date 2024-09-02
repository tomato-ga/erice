import DMMItemContainerPagination from '@/app/components/dmmcomponents/Pagination/Pagination'
import { DMMItemProps } from '@/types/dmmtypes'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

interface PageProps {
	params: { slug?: string[] }
}

const SITE_NAME = 'エロコメスト'

function decodeAndEncodeStyleName(encodedName: string): string {
	try {
		const decodedName = decodeURIComponent(encodedName)
		console.log('Decoded Name:', decodedName) // デコードされた名前をログに出力
		const reEncodedName = encodeURIComponent(decodedName)
		console.log('Re-encoded Name:', reEncodedName) // 再エンコードされた名前をログに出力
		return reEncodedName
	} catch (error) {
		console.error('Failed to decode/encode style name:', error)
		return encodedName
	}
}

export function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const [encodedStyleName, , page] = params.slug || []
	const currentPage = page ? Number.parseInt(page, 10) : 1

	if (!encodedStyleName) {
		return Promise.resolve({
			title: 'ページが見つかりません | ' + SITE_NAME,
			description: '指定されたページは存在しません。',
		})
	}

	const stylename = decodeURIComponent(decodeAndEncodeStyleName(encodedStyleName))

	try {
		const pageTitle = `${stylename} ${currentPage > 1 ? ` - ページ ${currentPage}` : ''} | ${SITE_NAME}`
		const description = `${stylename} の動画一覧です。${currentPage}ページ目を表示しています。`

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
			title: `${stylename} | ${SITE_NAME}`,
			description: `${stylename} の動画一覧です。`,
		})
	}
}

export default async function StylePaginationPage({ params }: PageProps) {
	const { slug = [] } = params
	let currentPage = 1
	let stylename: string | undefined

	// URLパターンの解析
	if (slug.length >= 1) {
		const encodedStyleName = slug[0]
		console.log('Encoded Style Name:', encodedStyleName) // エンコードされたスタイル名をログに出力
		stylename = decodeURIComponent(decodeAndEncodeStyleName(encodedStyleName))
		console.log('Style Name:', stylename) // スタイル名をログに出力
		if (slug.length === 3 && slug[1] === 'page') {
			currentPage = Number.parseInt(slug[2], 10)
		} else if (slug.length !== 1) {
			notFound()
		}
	} else {
		notFound()
	}

	if (Number.isNaN(currentPage) || currentPage < 1 || !stylename) {
		notFound()
	}

	try {
		// APIリクエストのURLを出力
		const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/dmm-style-pagination?style=${encodeURIComponent(
			stylename,
		)}&page=${currentPage}`
		console.log('APIリクエストURL:', apiUrl) // リクエストURLを出力

		const response = await fetch(apiUrl)

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
		console.log('APIレスポンスデータ:', data) // レスポンスデータを出力

		// 画像URLの優先順位を考慮して新しいプロパティを追加
		const itemsWithPriorityImage = data.items.map(item => {
			const { imageURL } = item
			const priorityImageURL = imageURL.large || imageURL.small || imageURL.list
			return { ...item, priorityImageURL }
		})

		return (
			<section className='max-w-7xl mx-auto'>
				<Suspense fallback={<LoadingSpinner />}>
					{/* DMMItemContainerPagination に props を渡す */}
					<DMMItemContainerPagination
						items={itemsWithPriorityImage}
						currentPage={data.currentPage}
						totalPages={data.totalPages}
						category={stylename}
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
