import React from 'react'
import Link from 'next/link'
import { Keyword } from '../../../../../types/types'

const ArticleKeywords: React.FC<{ keywords: Keyword[] }> = ({ keywords }) => {
	return (
		<div className="rounded-lg p-4 ">
			{keywords && keywords.length > 0 ? (
				<div className="flex flex-wrap justify-center gap-2">
					{keywords.map((keyword) => (
						<Link
							key={keyword.id}
							className="px-3 py-1 rounded-full text-sm md:text-sm font-medium text-slate-800 bg-gradient-to-r from-purple-200 to-pink-300 hover:from-purple-300 hover:to-pink-400 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg shadow-sm"
							href={`/tag/${encodeURIComponent(keyword.keyword)}`}
						>
							#{keyword.keyword}
						</Link>
					))}
				</div>
			) : (
				<p className="text-gray-600 text-center">キーワードがありません</p>
			)}
		</div>
	)
}

export default ArticleKeywords
