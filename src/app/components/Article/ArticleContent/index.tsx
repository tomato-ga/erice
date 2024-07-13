'use client'

import Link from 'next/link'
import { handleEXClickCount } from '../../handleexclick'
import { KobetuPageArticle } from '../../../../../types/types'

import { ArticleKeywords } from '@/app/(pages)/post/[postId]/page'

const ArticleLinks: React.FC<{ article: KobetuPageArticle }> = ({ article }) => {
	const handleClick = () => {
		handleEXClickCount(article.id).catch((error) => console.error('Failed to record click:', error))
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
