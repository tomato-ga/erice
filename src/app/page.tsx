import { Suspense } from 'react'
import HomeContent from './components/Home/HomeContent'
import PaginationComponent from './components/Pagination'
import { getHomeArticles } from './components/fetch/GetHomeArticles'

interface HomePageProps {
	searchParams: { page?: string }
}

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 30

export default async function HomePage({ searchParams }: HomePageProps) {
	const currentPage = parseInt(searchParams.page || `${DEFAULT_PAGE}`, 10)
	const data = await getHomeArticles(currentPage, DEFAULT_LIMIT)

	return (
		<div className="min-h-screen">
			<div className="container mx-auto px-4 py-8">
				<h1 className="text-3xl font-bold text-center mb-8">最新動画</h1>
				<Suspense fallback={<div className="text-center">動画をローディング中...</div>}>
					<HomeContent articles={data.articles} currentPage={currentPage} totalPages={data.totalPages} />
				</Suspense>
			</div>
		</div>
	)
}
