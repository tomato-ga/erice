import { NextPage } from 'next'
import { KobetuPageArticle, Keyword } from '../../../../../types/types'
import { getKobetuArticle } from '@/app/components/fetch/GetKobetuArticles'
import Link from 'next/link'
import { handleEXClickCount } from '@/app/components/handleexclick'
import ArticleLinks from '@/app/components/Article/ArticleContent'

interface Props {
	params: { postId: string }
}

const KobetuArticlePage: NextPage<Props> = async ({ params }) => {
	try {
		console.log('Received postId:', params.postId) // デバッグ用ログ
		const article = await getKobetuArticle(params.postId)

		console.log('KobetuArticlePage article: ', article)

		if (!article) {
			return (
				<div className="container mx-auto px-4 py-8">
					<h1 className="text-2xl font-bold text-red-600">記事が見つかりませんでした</h1>
					<p>記事が存在しないか、取得中にエラーが発生しました。</p>
				</div>
			)
		}

		return (
			<div className="bg-white min-h-screen">
				<div className="container mx-auto px-4 py-8">
					<ArticleContent article={article} />
				</div>
			</div>
		)
	} catch (error) {
		console.error('Error in KobetuArticlePage:', error)
		return (
			<div className="container mx-auto px-4 py-8">
				<h1 className="text-2xl font-bold text-red-600">エラーが発生しました</h1>
				<p>記事の取得中に問題が発生しました。しばらくしてからもう一度お試しください。</p>
				<p className="text-sm text-gray-600 mt-2">
					エラー詳細: {error instanceof Error ? error.message : String(error)}
				</p>
				<p className="text-sm text-gray-600">PostID: {params.postId}</p>
			</div>
		)
	}
}

const ArticleContent: React.FC<{ article: KobetuPageArticle }> = ({ article }) => {
	return (
		<div className="bg-white">
			<div className="relative">
				<img src={article.image_url} alt={article.title} className="w-full h-auto rounded-lg sm:rounded-lg" />
			</div>
			<div className="p-8">
				<ArticleHeader article={article} />

				<ArticleLinks article={article} />
			</div>
		</div>
	)
}

const ArticleHeader: React.FC<{ article: KobetuPageArticle }> = ({ article }) => (
	<div className="flex items-center justify-between mb-4">
		<div className="flex items-center">
			<img
				src={article.image_url || '/default-avatar.jpg'}
				alt={article.title}
				className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-4"
			/>
			<div>
				<p className="text-gray-600 text-sm">{formatDate(article.created_at)}</p>
				<p className="text-gray-600 text-sm">{article.site_name}</p>
			</div>
		</div>
	</div>
)

const formatDate = (dateString: string) => {
	const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
	return new Date(dateString).toLocaleDateString(undefined, options)
}

export const runtime = 'edge'

export default KobetuArticlePage
