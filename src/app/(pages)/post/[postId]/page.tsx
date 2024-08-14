// import { Suspense } from 'react'
// import { Metadata } from 'next'
// import dynamic from 'next/dynamic'
// import { getKobetuArticle } from '@/app/components/fetch/GetKobetuArticles'
// import LoadingSpinner from '@/app/components/Article/ArticleContent/loadingspinner'
// import { getPopularArticles } from '@/app/components/fetch/GetPopularArticles'
// import ArticleLBasic from '@/app/components/Article/ArticleLinks'
// import ErrorBoundary from './Errorb'
// import KeywordRelatedArticles from '@/app/components/Article/ArticleLoaded/KeywordRelated'
// import { getKeywordArticle } from '@/app/components/fetch/GetOneKeywordArticles'
// import RecentlyViewedArticles from '@/app/components/Article/ArticleLoaded/RecentlyViewedArticle'

// const PopularArticle = dynamic(() => import('@/app/components/Article/PopularArticle'))

// interface Props {
// 	params: { postId: string }
// }

// export async function generateMetadata({ params }: Props): Promise<Metadata> {
// 	const article = await getKobetuArticle(params.postId)

// 	if (!article) {
// 		return {
// 			title: '記事が見つかりません',
// 			description: '指定された記事は存在しないか、取得できませんでした。'
// 		}
// 	}

// 	return {
// 		title: article.title,
// 		description: article.title,
// 		openGraph: {
// 			title: article.title,
// 			description: article.title,
// 			images: [
// 				{
// 					url: article.image_url,
// 					width: 1200,
// 					height: 630,
// 					alt: article.title
// 				}
// 			]
// 		},
// 		twitter: {
// 			card: 'summary_large_image',
// 			title: article.title,
// 			description: article.title,
// 			images: [article.image_url]
// 		}
// 	}
// }

// export default async function KobetuArticlePage({ params }: Props) {
// 	// MEMO 人気動画は初期スタート時にはデータがないためコメントアウト
// 	// const [article, popularArticlesData] = await Promise.all([getKobetuArticle(params.postId), getPopularArticles()])
// 	const [article] = await Promise.all([getKobetuArticle(params.postId)])

// 	if (!article) {
// 		return (
// 			<div className="container mx-auto px-2 py-6">
// 				<h1 className="text-2xl font-bold text-red-600">記事が見つかりませんでした</h1>
// 				<p>記事が存在しないか、取得中にエラーが発生しました。</p>
// 			</div>
// 		)
// 	}

// 	const keywordArticles = await getKeywordArticle(article.keywords[0].keyword)

// 	return (
// 		<ErrorBoundary>
// 			<div className="bg-white min-h-screen">
// 				<div className="container mx-auto px-2 py-6">
// 					<ArticleLBasic article={article} />
// 					{/* <Suspense fallback={<LoadingSpinner />}>
// 						<PopularArticle articles={popularArticlesData.data.articles} />
// 					</Suspense> */}
// 					<Suspense fallback={<LoadingSpinner />}>
// 						<KeywordRelatedArticles keywordarticledata={keywordArticles} />
// 					</Suspense>
// 					<Suspense fallback={<LoadingSpinner />}>
// 						<RecentlyViewedArticles />
// 					</Suspense>
// 				</div>
// 			</div>
// 		</ErrorBoundary>
// 	)
// }
