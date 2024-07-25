'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { initDatabase, recordArticleView, syncArticleKV, ArticleViewError } from '@/lib/articleViewSync'
import { cache } from 'react'

interface UseArticleViewResult {
	isLoading: boolean
	error: ArticleViewError | null
	retry: () => Promise<void>
}

interface ArticleViewDependencies {
	recordArticleView: typeof recordArticleView
	syncArticleKV: typeof syncArticleKV
}

const defaultDeps: ArticleViewDependencies = {
	recordArticleView,
	syncArticleKV
}

const cachedRecordArticleView = cache(async (articleId: number, deps: ArticleViewDependencies) => {
	const result = await deps.recordArticleView(articleId)
	if (!result.process) {
		throw new ArticleViewError('記事ビューの記録に失敗しました', 'RECORD_FAILURE')
	}
	await deps.syncArticleKV()
})

export function useArticleView(articleId: number, deps: ArticleViewDependencies = defaultDeps): UseArticleViewResult {
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [error, setError] = useState<ArticleViewError | null>(null)
	const isOnline = useRef<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true)

	const recordView = useCallback(async () => {
		if (!isOnline.current) {
			console.log('オフラインモードです。記事ビューをローカルに保存します。')
			localStorage.setItem(`offlineArticleView_${articleId}`, Date.now().toString())
			return
		}

		setIsLoading(true)
		setError(null)

		try {
			await cachedRecordArticleView(articleId, deps)
		} catch (err) {
			console.error('記事ビューの記録に失敗しました:', err)
			if (err instanceof ArticleViewError) {
				setError(err)
			} else {
				setError(new ArticleViewError('不明なエラーが発生しました', 'UNKNOWN'))
			}
		} finally {
			setIsLoading(false)
		}
	}, [articleId, deps])

	useEffect(() => {
		if (typeof window === 'undefined') return

		initDatabase().catch((err) => console.error('データベースの初期化に失敗しました:', err))

		const handleOnline = async () => {
			isOnline.current = true
			const offlineViews = Object.entries(localStorage)
				.filter(([key]) => key.startsWith('offlineArticleView_'))
				.map(([key, value]) => ({ id: parseInt(key.split('_')[1]), timestamp: parseInt(value) }))

			for (const { id, timestamp } of offlineViews) {
				await deps.recordArticleView(id)
				localStorage.removeItem(`offlineArticleView_${id}`)
			}
			await deps.syncArticleKV().catch((err) => console.error('同期に失敗しました:', err))
		}

		const handleOffline = () => {
			isOnline.current = false
		}

		window.addEventListener('online', handleOnline)
		window.addEventListener('offline', handleOffline)

		recordView()

		return () => {
			window.removeEventListener('online', handleOnline)
			window.removeEventListener('offline', handleOffline)
		}
	}, [recordView, deps])

	const retry = useCallback(async () => {
		await recordView()
	}, [recordView])

	return { isLoading, error, retry }
}
