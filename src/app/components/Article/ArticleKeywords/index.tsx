'use client'

import React, { useCallback, useEffect } from 'react'
import Link from 'next/link' // Make sure you have imported Link from 'next/link'
import { Keyword } from '../../../../../types/types'

import { useUserActions } from '@/app/hooks/userActions'

const ArticleKeywords: React.FC<{ keywords: Keyword[] }> = ({ keywords }) => {
	// const { recordKeywordView } = useUserActions()

	// const recordKeywords = useCallback(() => {
	// 	if (keywords && keywords.length > 0) {
	// 		recordKeywordView(keywords)
	// 	}
	// }, [keywords, recordKeywordView])

	// useEffect(() => {
	// 	recordKeywords()
	// }, [recordKeywords])

	return (
		<div className="bg-white rounded-lg py-2">
			{keywords && keywords.length > 0 ? (
				<div className="flex flex-wrap items-start p-5 py-5">
					{keywords.map((keyword) => (
						<Link
							key={keyword.id}
							className="relative px-1 py-1 m-2 rounded-md shadow-sm sm:py-2 sm:text-base ring ring-transparent group md:px-4 hover:ring hover:ring-opacity-50 focus:ring-opacity-50 hover:ring-pink-600 text-gray-900 bg-gray-100 dark:bg-gray-400 dark:text-gray-200"
							href={`/tag/${encodeURIComponent(keyword.keyword)}`}
						>
							<span className="">#{keyword.keyword}</span>
						</Link>
					))}
				</div>
			) : (
				<p className="text-gray-600">キーワードがありません</p>
			)}
		</div>
	)
}

export default ArticleKeywords
