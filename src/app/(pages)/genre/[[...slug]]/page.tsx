// /Volumes/SSD_1TB/erice2/erice/src/app/(pages)/genre/[[...slug]]/page.tsx

import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import DMMItemContainerPagination from '@/app/components/dmmcomponents/Pagination/Pagination'
import { Metadata } from 'next'
import { DMMItemProps } from '../../../../../types/dmmtypes'

interface PageProps {
	params: { slug?: string[] }
}

const SITE_NAME = 'エロコメスト'

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const [genrename, , page] = params.slug || []
	const currentPage = page ? parseInt(page, 10) : 1

	if (!genrename) {
		return {
			title: 'ページが見つかりません | ' + SITE_NAME,
			description: '指定されたページは存在しません。'
		}
	}

	try {
		// APIリクエストを行い、女優名とページ番号から必要なメタデータを取得する
		// ここでは仮のタイトルと説明を設定
		const pageTitle = `${genrename} ${currentPage > 1 ? ` - ページ ${currentPage}` : ''}`
		const description = `${genrename} の動画一覧です。${currentPage}ページ目を表示しています。`

		return {
			title: pageTitle,
			description: description,
			openGraph: {
				title: pageTitle,
				description: description
			},
			twitter: {
				title: pageTitle,
				description: description
			}
		}
	} catch (error) {
		console.error('[Server] Failed to fetch metadata:', error)
		return {
			title: `${genrename}`,
			description: `${genrename} の動画一覧です。`
		}
	}
}

export default async function GenrePaginationPage({ params }: PageProps) {
	const { slug = [] } = params
	let currentPage = 1
	let genrename: string | undefined

	// URLパターンの解析
	if (slug.length >= 1) {
		genrename = decodeURIComponent(slug[0])
		if (slug.length === 3 && slug[1] === 'page') {
			currentPage = parseInt(slug[2], 10)
		} else if (slug.length !== 1) {
			notFound()
		}
	} else {
		notFound()
	}

	if (isNaN(currentPage) || currentPage < 1 || !genrename) {
		notFound()
	}

	try {
		// APIリクエストのURLを出力
		const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/dmm-genre-pagination?genre=${encodeURIComponent(
			genrename
		)}&page=${currentPage}`
		console.log('APIリクエストURL:', apiUrl) // リクエストURLを出力

		const response = await fetch(apiUrl)

		// レスポンスのステータスコードを出力
		console.log('レスポンスステータスコード:', response.status)

		if (!response.ok) {
			throw new Error('API request failed.')
		}

		const data = (await response.json()) as {
			items: DMMItemProps[]
			currentPage: number
			totalPages: number
			genre?: string
		}

		// レスポンスデータを出力
		// console.log('APIレスポンスデータ:', data) // レスポンスデータを出力

		return (
			<section className="max-w-7xl mx-auto">
				<Suspense fallback={<LoadingSpinner />}>
					{/* DMMItemContainerPagination に props を渡す */}
					<DMMItemContainerPagination
						items={data.items}
						currentPage={data.currentPage}
						totalPages={data.totalPages}
						category={genrename}
						categoryType="genre"
					/>
				</Suspense>
			</section>
		)
	} catch (error) {
		console.error('[Server] Failed to fetch data:', error)
		return <ErrorDisplay message="データの取得に失敗しました。後でもう一度お試しください。" />
	}
}

function LoadingSpinner() {
	return (
		<div className="flex justify-center items-center h-64" aria-label="読み込み中">
			<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
		</div>
	)
}

function ErrorDisplay({ message }: { message: string }) {
	return (
		<div className="text-center text-red-600 py-8" role="alert">
			<p>{message}</p>
		</div>
	)
}
