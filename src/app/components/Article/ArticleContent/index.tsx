'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { KobetuPageArticle } from '../../../../../types/types'
import { useUserActions } from '../../../hooks/userActions'
import ArticleKeywords from '../ArticleKeywords'

const ArticleLinks: React.FC<{ article: KobetuPageArticle }> = ({ article }) => {
	const { recordArticleView, recordExternalClick } = useUserActions()

	useEffect(() => {
		recordArticleView(article)
	}, [article, recordArticleView])

	const handleClick = () => {
		recordExternalClick(article.id, article.link)
	}

	return (
		<>
			<div>
				<Link
					href={article.link}
					passHref
					className="hover:underline"
					target="_blank"
					rel="noopener noreferrer"
					onClick={handleClick}
				>
					<h1 className="text-gray-600 text-2xl sm:text-4xl py-4">{article.title}</h1>
				</Link>
			</div>

			<ArticleKeywords keywords={article.keywords} />

			<div className="text-2xl p-5 m-1 text-white text-center font-semibold hover:bg-orange-700 rounded-md bg-gradient-to-r from-pink-400 to-violet-900">
				<h3 onClick={handleClick}>
					<Link href={article.link} target="_blank">
						{article.title}のページを見る
					</Link>
				</h3>
			</div>
		</>
	)
}

export default ArticleLinks
