import { Suspense } from 'react'
import { PaginationArticleResponse, HomePageArticle } from '../../../../../types/types'
import ArticleCard from '@/app/components/Article/ArticleCard'
import { getArticlesByKeyword } from '@/app/components/fetch/GetArticlesByKeyword'
import PaginationComponent from '@/app/components/Pagination'

interface KeywordArticleListProps {
	params: { keyword: string }
	searchParams: { page?: string }
}

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 30

export default async function KeywordArticleList({ params, searchParams }: KeywordArticleListProps) {
	const keyword = decodeURIComponent(params.keyword)
	const page = parseInt(searchParams.page || `${DEFAULT_PAGE}`, 10)

	let data: PaginationArticleResponse
	try {
		data = await getArticlesByKeyword(keyword, page, DEFAULT_LIMIT)
	} catch (error) {
		console.error('Failed to fetch articles:', error)
		return <ErrorDisplay message="記事の取得に失敗しました。後でもう一度お試しください。" />
	}

	if (!data.articles || data.articles.length === 0) {
		return (
			<section className="max-w-7xl mx-auto">
				<h1 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8">{keyword}の動画</h1>
				<div className="text-center">
					<p className="text-xl text-gray-600">この検索キーワードに一致する動画が見つかりませんでした。</p>
				</div>
			</section>
		)
	}

	return (
		<section className="max-w-7xl mx-auto">
			<h1 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8">{keyword}の動画</h1>
			<Suspense fallback={<LoadingSpinner />}>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
					{data.articles.map((article: HomePageArticle) => (
						<div key={article.id} className="aspect-w-16 aspect-h-9">
							<ArticleCard article={article} />
						</div>
					))}
				</div>
				<div className="mt-8 md:mt-12">
					<PaginationComponent currentPage={data.currentPage} totalPages={data.totalPages} keyword={keyword} />
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
