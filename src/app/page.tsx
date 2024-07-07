import { Suspense } from 'react'
import { HomePageApiResponse } from '../../types/types'
import { getHomeArticles } from './components/GetHomeArticles'
import ArticleCard from './components/ArticleCard'

function ArticleList({ articles }: { articles: HomePageApiResponse['articles'] }) {
	if (articles.length === 0) {
		return <p className="text-center text-gray-500">No articles available.</p>
	}

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 p-8">
			{articles.map((article) => (
				<ArticleCard key={article.id} article={article} />
			))}
		</div>
	)
}

async function HomeContent() {
	try {
		const data = await getHomeArticles()
		return <ArticleList articles={data.articles} />
	} catch (error) {
		console.error('Error fetching articles:', error)
		return <p className="text-center text-red-500">Error loading articles. Please try again later.</p>
	}
}

export default function HomePage() {
	return (
		<div className="min-h-screen ">
			<div className="container mx-auto px-4 py-8">
				<h1 className="text-3xl font-bold text-center mb-8">最新動画</h1>
				<Suspense fallback={<div className="text-center">Loading...</div>}>
					<HomeContent />
				</Suspense>
			</div>
		</div>
	)
}
