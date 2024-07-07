import { Suspense } from 'react'
import { HomePageApiResponse } from '../../types/types'
import { getHomeArticles } from './components/GetHomeArticles'
import ArticleCard from './components/ArticleCard'

function ArticleList({ articles }: { articles: HomePageApiResponse['articles'] }) {
	if (articles.length === 0) {
		return <p>No articles available.</p>
	}

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 p-8">
			{articles.map((article) => (
				<ArticleCard key={article.id} article={article} />
			))}
		</div>
	)
}

function Pagination({ pagination }: { pagination: HomePageApiResponse['pagination'] }) {
	return (
		<div className="flex justify-center items-center mt-8">
			<p className="text-gray-600">
				Page {pagination.currentPage} of {pagination.totalPages}
			</p>
			<p className="ml-4 text-gray-600">Total items: {pagination.totalItems}</p>
		</div>
	)
}

async function HomeContent() {
	try {
		const data = await getHomeArticles()
		return (
			<>
				<ArticleList articles={data.articles} />
				<Pagination pagination={data.pagination} />
			</>
		)
	} catch (error) {
		console.error('Error fetching articles:', error)
		return <p className="text-center text-red-500">Error loading articles. Please try again later.</p>
	}
}

export default function HomePage() {
	return (
		<div className="bg-gray-100 min-h-screen">
			<div className="container mx-auto px-4 py-8">
				<h1 className="text-3xl font-bold text-center mb-8">Latest Articles</h1>
				<Suspense fallback={<div className="text-center">Loading articles...</div>}>
					<HomeContent />
				</Suspense>
			</div>
		</div>
	)
}
