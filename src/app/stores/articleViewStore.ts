// src/store/articleViewStore.ts
import { create } from 'zustand'
import { loadArticleViews, ArticleView } from '@/lib/articleViewSync'
import { RelatedArticle } from '@/types/types'

interface ArticleViewState {
	articles: RelatedArticle[]
	isLoading: boolean
	error: string | null
	fetchArticles: () => Promise<void>
}

/**
 * Cloudflare KVから閲覧履歴を取得し、グローバルに管理するためのZustandストア
 *
 * このストアは以下の機能を提供します：
 * - 閲覧履歴の非同期取得
 * - 取得した記事データの状態管理
 * - ローディング状態とエラー状態の管理
 *
 * @property {RelatedArticle[]} articles - 取得した記事データの配列
 * @property {boolean} isLoading - データ取得中かどうかを示すフラグ
 * @property {string | null} error - エラーメッセージ（エラーがない場合はnull）
 * @property {() => Promise<void>} fetchArticles - 閲覧履歴を取得する非同期関数
 */

export const useArticleViewStore = create<ArticleViewState>((set) => ({
	articles: [],
	isLoading: false,
	error: null,
	fetchArticles: async () => {
		set({ isLoading: true, error: null })
		try {
			const loadedArticles = await loadArticleViews()

			if (loadedArticles.length === 0) {
				set({ articles: [], isLoading: false })
				return
			}

			const response = await fetch('/api/load-articles', {
				cache: 'no-store',
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ articleIds: loadedArticles.map((a) => a.articleId) })
			})

			if (!response.ok) {
				throw new Error(`APIエラー: ${response.status} ${response.statusText}`)
			}

			const data: { articles: { results: RelatedArticle[] } } = await response.json()

			if (!data.articles || !Array.isArray(data.articles.results)) {
				throw new Error('APIレスポンスの形式が不正です')
			}

			const articleMap = new Map(data.articles.results.map((article) => [article.id, article]))
			const sortedArticles = loadedArticles
				.map((loadedArticle) => articleMap.get(loadedArticle.articleId))
				.filter((article): article is RelatedArticle => article !== undefined)

			set({ articles: sortedArticles, isLoading: false })
		} catch (error) {
			console.error('閲覧履歴の取得に失敗しました:', error)
			const errorMessage = error instanceof Error ? error.message : '不明なエラーが発生しました'
			set({ error: `閲覧履歴の取得に失敗しました: ${errorMessage}`, isLoading: false, articles: [] })
		}
	}
}))
