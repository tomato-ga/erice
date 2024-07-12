import { NextPage } from 'next'
import { KobetuPageArticle, Keyword } from '../../../../../types/types'
import { getKobetuArticle } from '@/app/components/fetch/GetKobetuArticles'
import Link from 'next/link'

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
					<p>指定された記事ID ({params.postId}) に対応する記事が存在しないか、取得中にエラーが発生しました。</p>
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

const ArticleContent: React.FC<{ article: KobetuPageArticle }> = ({ article }) => (
	<div className="bg-white">
		<div className="relative">
			<img src={article.image_url} alt={article.title} className="w-full h-auto rounded-lg sm:rounded-lg" />
		</div>
		<div className="p-8">
			<ArticleHeader article={article} />
			<Link href={article.link} passHref className="hover:underline" target="_blank" rel="noopener noreferrer">
				<h1 className="text-gray-600 text-2xl sm:text-4xl py-4">{article.title}</h1>
			</Link>

			<ArticleKeywords keywords={article.keywords} />

			<div className="text-2xl p-5 m-1 text-white text-center font-semibold hover:bg-orange-700 rounded-md bg-gradient-to-r from-pink-400 to-violet-900">
				<h3>
					<Link href={article.link} target="_blank">
						{article.title}のページを見る
					</Link>
				</h3>
			</div>
		</div>
	</div>
)

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

const ArticleKeywords: React.FC<{ keywords: Keyword[] }> = ({ keywords }) => (
	<div className="bg-white rounded-lg py-2">
		{keywords && keywords.length > 0 ? (
			<div className="flex flex-wrap items-start p-5 py-5">
				{keywords.map((keyword) => (
					<Link
						key={keyword.id}
						className="relative px-1 py-1 m-2 rounded-md shadow-sm sm:py-2 sm:text-base ring ring-transparent group md:px-4 hover:ring hover:ring-opacity-50 focus:ring-opacity-50 hover:ring-pink-600 text-gray-900 bg-gray-100 dark:bg-gray-400 dark:text-gray-200"
						href={`/tag/${encodeURIComponent(keyword.keyword)}`}
					>
						<span className="">#{keyword.keyword}</span>
					</Link>
				))}
			</div>
		) : (
			<p className="text-gray-600">キーワードがありません</p>
		)}
	</div>
)

const formatDate = (dateString: string) => {
	const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
	return new Date(dateString).toLocaleDateString(undefined, options)
}

export default KobetuArticlePage
