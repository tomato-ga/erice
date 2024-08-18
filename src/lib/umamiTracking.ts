import { HomePageArticle, RelatedArticle } from '@/types/types'

export const handleUmamiClick = (type: string, article: HomePageArticle | RelatedArticle) => {
	if (typeof window !== 'undefined' && window.umami) {
		window.umami.track(`${type} Click`, {
			click_type: type,
			article_id: article.id,
			article_title: article.title
		})
	}
}
