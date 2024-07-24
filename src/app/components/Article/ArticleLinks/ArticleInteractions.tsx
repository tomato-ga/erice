'use client'

import React, { useCallback, useEffect } from 'react'
import Link from 'next/link'
import { handleEXClickCount } from '../../handleexclick'
import { initDatabase, recordArticleView, syncArticleKV } from '../../../../lib/articleViewSync'

interface ArticleInteractionsProps {
	articleId: number
	link: string
	children: React.ReactNode
}

const ArticleInteractions: React.FC<ArticleInteractionsProps> = ({ articleId, link, children }) => {
	const handleClick = () => {
		handleEXClickCount(articleId).catch((error) => console.error('Failed to record click:', error))
	}

	useEffect(() => {
		const writeArticleView = async () => {
			try {
				await initDatabase()
				const recordResult = await recordArticleView(articleId)
				if (recordResult.process) {
					await syncArticleKV()
				}
			} catch (error) {
				console.error('記事閲覧の記録に失敗しました:', error)
			}
		}

		writeArticleView()
	}, [articleId])

	return (
		<Link href={link} target="_blank" onClick={handleClick} aria-label="記事を開く">
			{children}
		</Link>
	)
}

export default ArticleInteractions
