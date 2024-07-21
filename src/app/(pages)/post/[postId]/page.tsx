import { Metadata, NextPage } from 'next'
import { KeywordArticle, KobetuPageArticle } from '../../../../../types/types'
import { getKobetuArticle } from '@/app/components/fetch/GetKobetuArticles'
import ArticleLinks from '@/app/components/Article/ArticleLinks'
import ArticleLoad from '@/app/components/Article/ArticleLoaded'
import { getKeywordArticle } from '@/app/components/fetch/GetOneKeywordArticles'

interface Props {
	params: { postId: string }
}

// メタデータを生成する関数
export async function generateMetadata({ params }: Props): Promise<Metadata> {
	try {
		// 記事IDを使って個別記事データを取得
		const article = await getKobetuArticle(params.postId)

		if (!article) {
			// 記事が見つからない場合のメタデータ
			return {
				title: '記事が見つかりません',
				description: '指定された記事は存在しないか、取得できませんでした。'
			}
		}

		// 記事が見つかった場合のメタデータ
		return {
			title: article.title,
			description: article.title, // 記事の説明やサマリーがある場合はそれを使用
			openGraph: {
				title: article.title,
				description: article.title, // 記事の説明やサマリーがある場合はそれを使用
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
				description: article.title, // 記事の説明やサマリーがある場合はそれを使用
				images: [article.image_url]
			}
		}
	} catch (error) {
		console.error('Error in generateMetadata:', error)
		// エラーが発生した場合のメタデータ
		return {
			title: 'エラーが発生しました',
			description: '記事の取得中に問題が発生しました。'
		}
	}
}

// 個別記事ページのメインコンポーネント
const KobetuArticlePage: NextPage<Props> = async ({ params }) => {
	try {
		console.log('Received postId:', params.postId) // デバッグ用ログ
		// 記事IDを使って個別記事データを取得
		const article = await getKobetuArticle(params.postId)

		console.log('KobetuArticlePage article: ', article)

		if (!article) {
			// 記事が見つからない場合のエラー表示
			return (
				<div className="container mx-auto px-2 py-6">
					<h1 className="text-2xl font-bold text-red-600">記事が見つかりませんでした</h1>
					<p>記事が存在しないか、取得中にエラーが発生しました。</p>
				</div>
			)
		}

		// 記事が見つかった場合、ArticleContentコンポーネントを表示
		return (
			<div className="bg-white min-h-screen">
				<div className="container mx-auto px-2 py-6">
					<ArticleContent article={article} />
				</div>
			</div>
		)
	} catch (error) {
		// エラーが発生した場合のエラー表示
		console.error('Error in KobetuArticlePage:', error)
		return (
			<div className="container mx-auto px-2 py-6">
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

// 記事の内容を表示するコンポーネント
const ArticleContent: React.FC<{ article: KobetuPageArticle }> = async ({ article }) => {
	let keywordArticles: KeywordArticle[] | null = null

	if (article.keywords.length > 0) {
		const firstKeyword = article.keywords[0].keyword
		keywordArticles = await getKeywordArticle(firstKeyword)
	}

	return (
		<div className="bg-white">
			<div className="relative">
				<img src={article.image_url} alt={article.title} className="w-full h-auto rounded-lg sm:rounded-lg" />
			</div>
			<div className="p-4">
				<ArticleHeader article={article} />
				<ArticleLinks article={article} />
				<ArticleLoad viewrireki={true} keywordarticledata={keywordArticles} />
			</div>
		</div>
	)
}

// 記事のヘッダー部分を表示するコンポーネント
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

// 日付をフォーマットする関数
const formatDate = (dateString: string) => {
	const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
	return new Date(dateString).toLocaleDateString(undefined, options)
}

// このページでEdgeランタイムを使用することを指定
export const runtime = 'edge'

export default KobetuArticlePage
