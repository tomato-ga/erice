import { Suspense } from 'react'
import { Metadata } from 'next'
import { getKobetuArticle } from '@/app/components/fetch/GetKobetuArticles'
import ArticleContent from '@/app/components/Article/ArticleContent'
import LoadingSpinner from '@/app/components/Article/ArticleContent/loadingspinner'
import { KobetuPageArticle } from '../../../../../types/types'
import ErrorBoundary from '@/app/components/Article/PopularArticle/Error'
import PopularArticle from '@/app/components/Article/PopularArticle'
import { getPopularArticles } from '@/app/components/fetch/GetPopularArticles'
import { getKeywordArticle } from '@/app/components/fetch/GetOneKeywordArticles'
import { KeywordRelatedArticles } from '@/app/components/Article/ArticleLoaded/KeywordRelated'

interface Props {
	params: { postId: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const article = await getKobetuArticle(params.postId)

	if (!article) {
		return {
			title: '記事が見つかりません',
			description: '指定された記事は存在しないか、取得できませんでした。'
		}
	}

	return {
		title: article.title,
		description: article.title,
		openGraph: {
			title: article.title,
			description: article.title,
			images: [
				{
					url: article.image_url,
					width: 1200,
					height: 630,
					alt: article.title
				}
			]
		},
		twitter: {
			card: 'summary_large_image',
			title: article.title,
			description: article.title,
			images: [article.image_url]
		}
	}
}

export default async function KobetuArticlePage({ params }: Props) {
	const [article, popularArticlesData, keywordArticles] = await Promise.all([
		getKobetuArticle(params.postId),
		getPopularArticles(),
		getKeywordArticle(params.postId) // 記事IDをキーワードとして使用
	])

	if (!article) {
		return (
			<div className="container mx-auto px-2 py-6">
				<h1 className="text-2xl font-bold text-red-600">記事が見つかりませんでした</h1>
				<p>記事が存在しないか、取得中にエラーが発生しました。</p>
			</div>
		)
	}

	return (
		<div className="bg-white min-h-screen">
			<div className="container mx-auto px-2 py-6">
				<Suspense fallback={<LoadingSpinner />}>
					<ArticleContent article={article} />
				</Suspense>
				<ErrorBoundary fallback={<div>人気記事の読み込みに失敗しました。</div>}>
					<Suspense fallback={<LoadingSpinner />}>
						<PopularArticle articles={popularArticlesData.data.articles} />
					</Suspense>
				</ErrorBoundary>
				<ErrorBoundary fallback={<div>関連記事の読み込みに失敗しました。</div>}>
					<Suspense fallback={<LoadingSpinner />}>
						<KeywordRelatedArticles keywordarticledata={keywordArticles} />
					</Suspense>
				</ErrorBoundary>
			</div>
		</div>
	)
}
