import { Suspense } from 'react'
import Link from 'next/link'
import { headers } from 'next/headers'
import { getHomeArticles } from './components/fetch/GetHomeArticles'
import ArticleCard from './components/Article/ArticleCard'
import PaginationComponent from './components/Pagination'
import { HomePageArticle } from '../../types/types'
import ClientDebugger from './Clientdebugger'

interface HomePageProps {
	searchParams: { page?: string }
}

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 30

export default async function HomePage({ searchParams }: HomePageProps) {
	const currentPage = parseInt(searchParams.page || `${DEFAULT_PAGE}`, 10)
	const headersList = headers()
	const userAgent = headersList.get('user-agent')
	const referer = headersList.get('referer')

	console.log(`[Server] Rendering HomePage. Page: ${currentPage}, UserAgent: ${userAgent}, Referer: ${referer}`)

	let data: { articles: HomePageArticle[]; totalPages: number }
	const startTime = Date.now()
	try {
		data = await getHomeArticles(currentPage, DEFAULT_LIMIT)
		const endTime = Date.now()
		console.log(`[Server] Data fetched. Time taken: ${endTime - startTime}ms. Articles count: ${data.articles.length}`)
	} catch (error) {
		console.error('[Server] Failed to fetch articles:', error)
		return <ErrorDisplay message="記事の取得に失敗しました。後でもう一度お試しください。" />
	}

	return (
		<>
			<section className="max-w-7xl mx-auto">
				{/* <ClientDebugger currentPage={currentPage} articlesCount={data.articles.length} /> */}
				<h1 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8">
					<Link href="/">最新動画</Link>
				</h1>
				<Suspense fallback={<LoadingSpinner />}>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
						{data.articles.map((article) => (
							<div key={article.id} className="aspect-w-16 aspect-h-9">
								<ArticleCard article={article} isSmallThumbnail={false} />
							</div>
						))}
					</div>
					<div className="mt-8 md:mt-12">
						<PaginationComponent currentPage={currentPage} totalPages={data.totalPages} />
					</div>
				</Suspense>
			</section>
		</>
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

// export const runtime = 'edge'
