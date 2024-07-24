import React from 'react'
import { KobetuPageArticle } from '../../../../../types/types'
import ArticleKeywords from '../ArticleKeywords'
import ArticleInteractions from './ArticleInteractions'

const ArticleLinks: React.FC<{ article: KobetuPageArticle }> = ({ article }) => {
	return (
		<article className="flex flex-col space-y-4">
			<div className="relative">
				<ArticleInteractions articleId={article.id} link={article.link}>
					<img src={article.image_url} alt={article.title} className="w-full h-auto rounded-lg" />
				</ArticleInteractions>
			</div>

			<div className="flex items-center space-x-4">
				<img src={article.image_url || '/default-avatar.jpg'} alt={article.title} className="w-12 h-12 rounded-full" />
				<div>
					<p className="text-gray-600 text-sm">{new Date(article.created_at).toLocaleDateString()}</p>
					<p className="text-gray-600 text-sm">{article.site_name}</p>
				</div>
			</div>

			<h1 className="text-gray-600 font-semibold text-2xl sm:text-4xl">{article.title}</h1>

			<ArticleKeywords keywords={article.keywords} />

			<ArticleInteractions articleId={article.id} link={article.link}>
				<div className="text-lg p-5 text-slate-700 text-center font-semibold rounded-md bg-red-50">
					{article.title}のページを見る
				</div>
			</ArticleInteractions>
		</article>
	)
}

export default ArticleLinks
