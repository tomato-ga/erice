import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getArticlesByKeyword } from '@/app/components/fetch/GetArticlesByKeyword'
import ArticleCard from '@/app/components/Article/ArticleCard'
import PaginationComponent from '@/app/components/Pagination'
import { HomePageArticle } from '../../../../../types/types'
import { Metadata } from 'next'

interface PageProps {
	params: { slug?: string[] }
}

const DEFAULT_LIMIT = 30
const SITE_NAME = 'erice'

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	// console.log('generateMetadata called with params:', params)

	const [keyword, , page] = params.slug || []
	const currentPage = page ? parseInt(page, 10) : 1

	// console.log('Parsed keyword:', keyword, 'currentPage:', currentPage)

	if (!keyword) {
		console.log('No keyword found, returning default metadata')
		return {
			title: 'ページが見つかりません | ' + SITE_NAME,
			description: '指定されたページは存在しません。'
		}
	}

	try {
		const data = await getArticlesByKeyword(keyword, currentPage, DEFAULT_LIMIT)
		// console.log('Data fetched for metadata:', data)

		const pageTitle = `「${keyword}」の動画${currentPage > 1 ? ` - ページ ${currentPage}` : ''}`
		const description = `「${keyword}」に関連する動画一覧です。${currentPage}ページ目を表示しています。全${
			data.total
		}件中${(currentPage - 1) * DEFAULT_LIMIT + 1}~${Math.min(currentPage * DEFAULT_LIMIT, data.total)}件を表示中。`

		// console.log('Returning metadata:', { title: pageTitle, description })
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
		console.error('[Server] Failed to fetch articles for metadata:', error)
		return {
			title: `「${keyword}」の動画`,
			description: `「${keyword}」に関連する動画一覧です。`
		}
	}
}

export default async function TagPage({ params }: PageProps) {
	// console.log('TagPage rendered with params:', params)

	const { slug = [] } = params
	let currentPage = 1
	let keyword: string | undefined

	// URLパターンの解析
	if (slug.length >= 1) {
		keyword = decodeURIComponent(slug[0])
		if (slug.length === 3 && slug[1] === 'page') {
			currentPage = parseInt(slug[2], 10)
		} else if (slug.length !== 1) {
			notFound()
		}
	} else {
		notFound()
	}

	if (isNaN(currentPage) || currentPage < 1 || !keyword) {
		notFound()
	}

	let data: { articles: HomePageArticle[]; totalPages: number; total: number }
	try {
		data = await getArticlesByKeyword(keyword, currentPage, DEFAULT_LIMIT)
		console.log('pagination data 重複チェック: ', data)

		if (currentPage > data.totalPages) {
			notFound()
		}
	} catch (error) {
		console.error('[Server] Failed to fetch articles:', error)
		return <ErrorDisplay message="記事の取得に失敗しました。後でもう一度お試しください。" />
	}

	const pageTitle = `「${keyword}」の動画${currentPage > 1 ? ` - ページ ${currentPage}` : ''}`

	return (
		<section className="max-w-7xl mx-auto">
			<h1 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8">{pageTitle}</h1>
			{currentPage > 1 && (
				<div className="text-center mb-4">
					<Link href={`/tag/${encodeURIComponent(keyword)}`} className="text-blue-600 hover:underline">
						「{keyword}」の最初のページに戻る
					</Link>
				</div>
			)}
			<Suspense fallback={<LoadingSpinner />}>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
					{data.articles.map((article) => (
						<div key={article.id} className="aspect-w-16 aspect-h-9">
							<ArticleCard article={article} source="TagPagination" />
						</div>
					))}
				</div>
				<div className="mt-8 md:mt-12">
					<PaginationComponent currentPage={currentPage} totalPages={data.totalPages} keyword={keyword} />
				</div>
			</Suspense>
		</section>
	)
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
