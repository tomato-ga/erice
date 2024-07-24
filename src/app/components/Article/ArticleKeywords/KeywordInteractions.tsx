'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { initKeywordDatabase, recordKeywordView, syncKeywordKV } from '../../../../lib/keywordViewSync'

interface KeywordInteractionsProps {
	keywordId: number
	keyword: string
	children: React.ReactNode
}

const KeywordInteractions: React.FC<KeywordInteractionsProps> = ({ keywordId, keyword, children }) => {
	useEffect(() => {
		const writeKeywordView = async () => {
			try {
				await initKeywordDatabase()
				const recordResult = await recordKeywordView(keywordId)
				if (recordResult.process) {
					await syncKeywordKV()
				}
			} catch (error) {
				console.error('キーワード閲覧の記録に失敗しました:', error)
			}
		}

		writeKeywordView()
	}, [keywordId])

	return (
		<Link href={`/tag/${encodeURIComponent(keyword)}`} aria-label={`${keyword}のタグページを開く`}>
			{children}
		</Link>
	)
}

export default KeywordInteractions
