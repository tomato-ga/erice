import { getPopularArticles } from '../../fetch/GetPopularArticles'
import Carousel from './carousel'
import { PopularArticle } from '../../../../../types/types'

const PopularArticles = async () => {
	const data = await getPopularArticles()
	const articles: PopularArticle[] = data.data.articles

	return (
		<section className="container mx-auto px-4 py-8" aria-labelledby="popular-articles-heading">
			<h3
				id="popular-articles-heading"
				className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text"
			>
				今日の人気動画
			</h3>
			<Carousel articles={articles} />
		</section>
	)
}

export default PopularArticles
