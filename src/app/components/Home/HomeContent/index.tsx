import { HomePageArticle } from '../../../../../types/types'
import ArticleList from '../../Article/ArticleList'
import PaginationComponent from '../../Pagination'

interface HomeContentProps {
	articles: HomePageArticle[]
	currentPage: number
	totalPages: number
}

export default function HomeContent({ articles, currentPage, totalPages }: HomeContentProps) {
	return (
		<>
			<ArticleList articles={articles} />
			<PaginationComponent currentPage={currentPage} totalPages={totalPages} />
		</>
	)
}
