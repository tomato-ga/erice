import { Suspense } from 'react'
import { getHomeArticles } from './components/fetch/GetHomeArticles'
import ArticleCard from './components/Article/ArticleCard'
import PaginationComponent from './components/Pagination'
import { HomePageArticle } from '@/types/types'
import DMMSalePage from './components/dmmcomponents/DMMSalePage'
import DMMItemContainer from './components/dmmcomponents/DMMItemContainer'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import DMMActressItemContainer from './components/dmmcomponents/DMMActressItemContainer'

interface HomePageProps {
	searchParams: { page?: string }
}

export default async function HomePage({ searchParams }: HomePageProps) {
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
