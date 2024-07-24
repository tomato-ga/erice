'use client'

import React, { useCallback, useMemo, useState } from 'react'
import Link from 'next/link'
import { handleEXClickCount } from '../../handleexclick'
import { initDatabase, recordArticleView, syncArticleKV } from '../../../../lib/articleViewSync'

interface ArticleInteractionsProps {
	articleId: number
	link: string
	children: React.ReactNode
}

const useArticleInteractions = (articleId: number) => {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const writeArticleView = useCallback(async () => {
		setIsLoading(true)
		setError(null)
		try {
			await initDatabase()
			const recordResult = await recordArticleView(articleId)
			if (recordResult.process) {
				await syncArticleKV()
			}
		} catch (err) {
			console.error('記事閲覧の記録に失敗しました:', err)
			setError('記事閲覧の記録に失敗しました')
		} finally {
			setIsLoading(false)
		}
	}, [articleId])

	const handleClick = useCallback(async () => {
		try {
			await handleEXClickCount(articleId)
		} catch (err) {
			console.error('クリックの記録に失敗しました:', err)
			setError('クリックの記録に失敗しました')
		}
	}, [articleId])

	return { writeArticleView, handleClick, isLoading, error }
}

const ArticleInteractions: React.FC<ArticleInteractionsProps> = ({ articleId, link, children }) => {
	const { writeArticleView, handleClick, isLoading, error } = useArticleInteractions(articleId)

	const memoizedChildren = useMemo(() => children, [children])

	React.useEffect(() => {
		writeArticleView()
	}, [writeArticleView])

	const ariaLabel = useMemo(() => {
		return typeof children === 'string' ? `記事を開く: ${children}` : '記事を開く'
	}, [children])

	return (
		<div>
			<Link
				href={link}
				target="_blank"
				onClick={handleClick}
				aria-label={ariaLabel}
				rel="noopener noreferrer"
				className={isLoading ? 'pointer-events-none opacity-50' : ''}
			>
				{memoizedChildren}
			</Link>
			{error && (
				<p role="alert" className="text-red-500 text-sm mt-2">
					{error}
				</p>
			)}
			{isLoading && <span className="sr-only">読み込み中...</span>}
		</div>
	)
}

export default React.memo(ArticleInteractions)
