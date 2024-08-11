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
		return <ErrorDisplay message="記事の取得に失敗しました。後でもう一度お試しください。" />
	}

	return (
		<>
			<section className="space-y-16 py-12">
				{/* <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">最新動画</h1> */}

				{/* 限定セールセクション */}
				{/* TODO アイテムが存在しない場合は、このセクションを表示させないようにしたいので、DMMItemContainerにJSXを移動させる */}
				<div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-lg p-8 transition duration-300 ease-in-out ">
					<div className="text-center mb-8">
						<h2 className="text-4xl font-extrabold mb-4">
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
								限定セール
							</span>
						</h2>
						<Link
							href="/sale"
							className="inline-flex items-center px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg transition-all duration-300 ease-in-out  hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
						>
							全ての限定セール商品を見る
							<ArrowRight className="ml-2 h-5 w-5 animate-bounce" />
						</Link>
					</div>
					<DMMItemContainer itemType="sale" from="top" />
				</div>

				{/* 今日配信の新作セクション */}
				<div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl shadow-lg p-8 transition duration-300 ease-in-out ">
					<div className="text-center mb-8">
						<h2 className="text-4xl font-extrabold mb-4">
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-500">
								今日配信の新作
							</span>
						</h2>
						<Link
							href="/todaynew"
							className="inline-flex items-center px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-green-500 to-blue-500 rounded-full shadow-lg transition-all duration-300 ease-in-out  hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
						>
							全ての新作商品を見る
							<ArrowRight className="ml-2 h-5 w-5 animate-bounce" />
						</Link>
					</div>
					<DMMItemContainer itemType="todaynew" from="top" />
				</div>

				{/* デビュー作品セクション */}
				<div className="bg-gradient-to-r from-yellow-50 to-red-50 rounded-xl shadow-lg p-8 transition duration-300 ease-in-out ">
					<div className="text-center mb-8">
						<h2 className="text-4xl font-extrabold mb-4">
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-red-500">
								デビュー作品
							</span>
						</h2>
						<Link
							href="/debut"
							className="inline-flex items-center px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-yellow-500 to-red-500 rounded-full shadow-lg transition-all duration-300 ease-in-out  hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
						>
							全てのデビュー作品を見る
							<ArrowRight className="ml-2 h-5 w-5 animate-bounce" />
						</Link>
					</div>
					<DMMItemContainer itemType="debut" from="top" />
				</div>

				{/* 注目作品セクション */}
				<div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl shadow-lg p-8 transition duration-300 ease-in-out ">
					<div className="text-center mb-8">
						<h2 className="text-4xl font-extrabold mb-4">
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
								注目作品
							</span>
						</h2>
						<Link
							href="/feature"
							className="inline-flex items-center px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-500 rounded-full shadow-lg transition-all duration-300 ease-in-out  hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-50"
						>
							全ての注目作品を見る
							<ArrowRight className="ml-2 h-5 w-5 animate-bounce" />
						</Link>
					</div>
					<DMMItemContainer itemType="feature" from="top" />
				</div>

				{/* 女優セクション */}
				<DMMActressItemContainer actressType="new" from="top" />

				<DMMActressItemContainer actressType="popular" from="top" />

				{/* 既存の記事グリッドとページネーション */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
					{data.articles.map((article) => (
						<div key={article.id} className="aspect-w-16 aspect-h-9">
							<ArticleCard article={article} isSmallThumbnail={false} source="Top" />
						</div>
					))}
				</div>
				<div className="mt-12">
					<PaginationComponent currentPage={currentPage} totalPages={data.totalPages} />
				</div>
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
