/**
 * HomePage コンポーネント
 *
 * このコンポーネントは、エロコメストのホームページを表示します。
 * 最新の動画記事をページネーションで表示し、各記事はArticleCardコンポーネントで表現されます。
 *
 * @component
 * @param {Object} props - コンポーネントのプロパティ
 * @param {Object} props.searchParams - URLのクエリパラメータ
 * @param {string} [props.searchParams.page] - 現在のページ番号（オプション、デフォルトは1）
 *
 * @returns {JSX.Element} レンダリングされたホームページ
 *
 * 主な機能:
 * - getHomeArticles関数を使用して最新の記事データを取得
 * - 記事データをグリッドレイアウトで表示
 * - ページネーション機能の提供
 * - エラー処理とローディング状態の表示
 *
 * 注意事項:
 * - このコンポーネントはサーバーサイドでレンダリングされます
 * - デフォルトで1ページあたり30記事を表示
 * - ユーザーエージェントとリファラー情報をログに記録
 */

import { Suspense } from 'react'
import { getHomeArticles } from './components/fetch/GetHomeArticles'
import ArticleCard from './components/Article/ArticleCard'
import PaginationComponent from './components/Pagination'
import { HomePageArticle } from '../../types/types'
import DMMTopPage from './(DMM)/(toppage)/top/page'
import DMMSalePage from './components/dmmcomponents/DMMSalePage'
import DMMItemContainer from './components/dmmcomponents/DMMItemContainer'

interface HomePageProps {
	searchParams: { page?: string }
}

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 30

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
			<section className="">
				<h1 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8">最新動画</h1>

				{/*  DMM Item Container 呼び出し*/}
				<h2 className="text-4xl text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 font-extrabold border-b border-gray-300 pb-4 mt-4">
					限定セール
				</h2>
				<DMMItemContainer itemType="sale" />
				<h2 className="text-4xl text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 font-extrabold border-b border-gray-300 pb-4 mt-4">
					今日配信の新作
				</h2>
				<DMMItemContainer itemType="todaynew" />
				<h2 className="text-4xl text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 font-extrabold border-b border-gray-300 pb-4 mt-4">
					デビュー作品
				</h2>
				<DMMItemContainer itemType="debut" />
				<h2 className="text-4xl text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 font-extrabold border-b border-gray-300 pb-4 mt-4">
					注目作品
				</h2>
				<DMMItemContainer itemType="feature" />

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
					{data.articles.map((article) => (
						<div key={article.id} className="aspect-w-16 aspect-h-9">
							<ArticleCard article={article} isSmallThumbnail={false} source="Top" />
						</div>
					))}
				</div>
				<div className="mt-8 md:mt-12">
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
