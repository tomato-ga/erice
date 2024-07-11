import { PaginationArticleResponse, HomePageArticle } from '../../../../../types/types'
import ArticleList from '@/app/components/Article/ArticleList'
import { getArticlesByKeyword } from '@/app/components/fetch/GetArticlesByKeyword'
import PaginationComponent from '@/app/components/Pagination'

interface KeywordArticleListProps {
	params: { keyword: string }
	searchParams: { page?: string }
}

const DEFAULT_LIMIT = 30 // デフォルトで30件

async function KeywordArticleList({ params, searchParams }: KeywordArticleListProps) {
	const keyword = decodeURIComponent(params.keyword)
	const page = parseInt(searchParams.page || '1', 10)

	const data: PaginationArticleResponse = await getArticlesByKeyword(keyword, page, DEFAULT_LIMIT)

	if (!data.articles || data.articles.length === 0) {
		return (
			<div className="text-center py-10">
				<p className="text-xl text-gray-600">No articles found for this keyword.</p>
			</div>
		)
	}

	return (
		<div className="keyword-article-list">
			<h1 className="text-2xl font-bold mb-4">Articles for: {keyword}</h1>
			<ArticleList articles={data.articles as HomePageArticle[]} />
			<PaginationComponent currentPage={data.currentPage} totalPages={data.totalPages} keyword={keyword} />
		</div>
	)
}

export default KeywordArticleList
