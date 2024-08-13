import { Suspense } from 'react'
import { getHomeArticles } from './components/fetch/GetHomeArticles'
import ArticleCard from './components/Article/ArticleCard'
import PaginationComponent from './components/Pagination'
import { HomePageArticle } from '../../types/types'
import DMMTopPage from './(DMM)/(toppage)/top/page'
import DMMSalePage from './components/dmmcomponents/DMMSalePage'
import DMMItemContainer from './components/dmmcomponents/DMMItemContainer'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import DMMActressItemContainer from './components/dmmcomponents/DMMActressItemContainer'

interface HomePageProps {
	searchParams: { page?: string }
}

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 28

export default async function HomePage({ searchParams }: HomePageProps) {
	const currentPage = parseInt(searchParams.page || `${DEFAULT_PAGE}`, 10)

	let data: { articles: HomePageArticle[]; totalPages: number }
	try {
		data = await getHomeArticles(currentPage, DEFAULT_LIMIT)
	} catch (error) {
		console.error('[Server] Failed to fetch articles:', error)
		return <ErrorDisplay message="記��の取得に失敗しました。後でもう一度お試しください。" />
	}

	return (
		<>
			<section className="space-y-16 py-12">
				<DMMItemContainer itemType="feature" from="top" bgGradient="bg-gradient-to-r from-pink-50 to-purple-50" />
				<DMMItemContainer itemType="todaynew" from="top" bgGradient="bg-gradient-to-r from-green-50 to-blue-50" />
				<DMMItemContainer itemType="debut" from="top" bgGradient="bg-gradient-to-r from-yellow-50 to-red-50" />
				<DMMItemContainer itemType="sale" from="top" bgGradient="bg-gradient-to-r from-blue-50 to-purple-50" />

				{/* 女優セクション */}
				<DMMActressItemContainer actressType="new" from="top" />
				<DMMActressItemContainer actressType="popular" from="top" />

				{/* 既存の記事グリッドとページネーション */}
				{/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
					{data.articles.map((article) => (
						<div key={article.id} className="aspect-w-16 aspect-h-9">
							<ArticleCard article={article} isSmallThumbnail={false} source="Top" />
						</div>
					))}
				</div>
				<div className="mt-12">
					<PaginationComponent currentPage={currentPage} totalPages={data.totalPages} />
				</div> */}
			</section>
		</>
	)
}

function ErrorDisplay({ message }: { message: string }) {
	return (
		<div className="text-center text-red-600 py-8" role="alert">
			<p>{message}</p>
		</div>
	)
}
