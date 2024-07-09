import { NextPage } from 'next'
import { KobetuPageArticle, Keyword } from '../../../../../types/types'
import { getKobetuArticles } from '@/app/components/GetKobetuArticles'
import Link from 'next/link'

interface Props {
	params: { postId: string }
}

const KobetuArticlePage: NextPage<Props> = async ({ params }) => {
	const article = await getKobetuArticles(params.postId)

	if (!article) {
		return <div>Article not found</div>
	}

	return (
		<div className="bg-white min-h-screen">
			<div className="container mx-auto px-4 py-8">
				<KobetuArticleContent article={article} />
			</div>
		</div>
	)
}

const KobetuArticleContent: React.FC<{ article: KobetuPageArticle }> = ({ article }) => (
	<div className="bg-white">
		<div className="relative">
			<img src={article.image_url} alt={article.title} className="w-full h-auto rounded-lg sm:rounded-lg" />
		</div>
		<div className="p-8">
			<KobetuArticleHeader article={article} />
			<Link href={article.link} passHref className="hover:underline" target="_blank" rel="noopener noreferrer">
				<h1 className="text-gray-600 text-2xl sm:text-4xl  py-4">{article.title}</h1>
			</Link>
			<KobetuArticleKeywords keywords={article.keywords} />
		</div>
	</div>
)

const KobetuArticleHeader: React.FC<{ article: KobetuPageArticle }> = ({ article }) => (
	<div className="flex items-center justify-between mb-4">
		<div className="flex items-center">
			<img
				src={article.image_url || '/default-avatar.jpg'}
				alt={article.title}
				className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-4"
			/>
			<div>
				<p className="text-gray-600 text-sm">{formatDate(article.created_at)}</p>
			</div>
		</div>
	</div>
)

const KobetuArticleKeywords: React.FC<{ keywords: Keyword[] }> = ({ keywords }) => (
	<div className="bg-white rounded-lg py-2">
		<h3 className="text-gray-600  py-4 text-lg">キーワード</h3>
		{keywords && keywords.length > 0 ? (
			<ul className="space-y-4">
				{keywords.map((keyword) => (
					<li key={keyword.id} className="flex items-center">
						<Link href={`/tag/${keyword.keyword}`}>
							<span className="ml-2">{keyword.keyword}</span>
						</Link>
					</li>
				))}
			</ul>
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
