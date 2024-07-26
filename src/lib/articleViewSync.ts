// /Volumes/SSD_1TB/erice2/erice/src/lib/articleViewSync.ts

import Dexie, { Table } from 'dexie'
import { getUserId } from './dataSync'

export interface ArticleView {
	id?: number
	articleId: number
	timestamp: number
	synced: number
}

export class ArticleViewError extends Error {
	constructor(message: string, public code: string) {
		super(message)
		this.name = 'ArticleViewError'
	}
}

class ArticleViewDatabase extends Dexie {
	viewedArticles!: Table<ArticleView, number>

	constructor() {
		super('ArticleViewDatabase')
		this.version(5).stores({
			viewedArticles: '++id, articleId, timestamp, synced'
		})
	}
}

class DatabaseManager {
	private static instance: DatabaseManager
	private db: ArticleViewDatabase | null = null
	private syncInProgress: boolean = false
	private readonly MAX_RECORDS = 50

	private constructor() {}

	static getInstance(): DatabaseManager {
		if (!DatabaseManager.instance) {
			DatabaseManager.instance = new DatabaseManager()
		}
		return DatabaseManager.instance
	}

	async initDatabase(): Promise<void> {
		if (this.db) return

		try {
			this.db = new ArticleViewDatabase()
			await this.db.open()
		} catch (error) {
			// console.error('データベースの初期化に失敗しました:', error)
			throw new ArticleViewError('データベースの初期化に失敗しました', 'DB_INIT_FAILURE')
		}
	}

	async recordArticleView(articleId: number): Promise<{ process: boolean }> {
		if (!this.db) {
			throw new ArticleViewError('データベースが初期化されていません', 'DB_NOT_INITIALIZED')
		}

		const timestamp = Date.now()

		try {
			await this.db.transaction('rw', this.db.viewedArticles, async () => {
				const existingView = await this.db!.viewedArticles.where('articleId').equals(articleId).first()

				if (existingView) {
					await this.db!.viewedArticles.update(existingView.id!, {
						timestamp: timestamp,
						synced: 0
					})
				} else {
					await this.db!.viewedArticles.add({
						articleId,
						timestamp,
						synced: 0
					})
				}

				await this.cleanupExcessRecords()
			})
			return { process: true }
		} catch (error) {
			// console.error('記事ビューの記録に失敗しました:', error)
			return { process: false }
		}
	}

	async syncWithCFKV(): Promise<void> {
		if (this.syncInProgress) return

		this.syncInProgress = true

		try {
			if (!this.db) {
				throw new ArticleViewError('データベースが初期化されていません', 'DB_NOT_INITIALIZED')
			}

			const unsyncedRecords = await this.db.viewedArticles.where('synced').equals(0).toArray()

			if (unsyncedRecords.length === 0) {
				// console.log('同期する記事ビューがありません')
				return
			}

			// console.log(`${unsyncedRecords.length}件の未同期記事ビューを同期します`)

			const syncData = {
				userId: await getUserId(),
				viewedArticles: unsyncedRecords.map((record: ArticleView) => ({
					articleId: record.articleId,
					timestamp: record.timestamp
				}))
			}

			// console.log('APIにデータを送信します:', JSON.stringify(syncData))

			const response = await fetch('/api/viewed-articles', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(syncData)
			})

			if (!response.ok) {
				const errorText = await response.text()
				// console.error('APIレスポンスエラー:', response.status, errorText)
				throw new ArticleViewError(`サーバーとの同期に失敗しました: ${response.statusText}`, 'SYNC_FAILURE')
			}

			const result = await response.json()
			// console.log('APIレスポンス:', result)

			if (result.status === 'OK') {
				const ids = unsyncedRecords.map((r: ArticleView) => r.id).filter((id): id is number => id !== undefined)
				await this.db.viewedArticles.where('id').anyOf(ids).modify({ synced: 1 })
				// console.log(`${ids.length}件の記事ビューを同期済みにマークしました`)
			} else {
				throw new ArticleViewError('同期に失敗しました: ' + (result.message || '不明なエラー'), 'SYNC_FAILURE')
			}
		} catch (error) {
			// console.error('同期中にエラーが発生しました:', error)
			throw error
		} finally {
			this.syncInProgress = false
		}
	}

	async loadArticleView(): Promise<ArticleView[]> {
		if (!this.db) {
			throw new Error('データベースが初期化されていません。initDatabase()を先に呼び出してください。')
		}

		try {
			const allRecords = await this.db.transaction('readonly', this.db.viewedArticles, async () => {
				// console.log('未同期の閲覧記録の読み取りを開始します')
				const records = await this.db!.viewedArticles.toArray()
				// console.log(`${records.length}件の未同期閲覧記録を取得しました`)
				return records
			})
			return allRecords
		} catch (error) {
			// console.error('閲覧記録の読み取りにエラーが発生しました', error)
			throw error
		}
	}

	private async cleanupExcessRecords(): Promise<void> {
		if (!this.db) {
			throw new ArticleViewError('データベースが初期化されていません', 'DB_NOT_INITIALIZED')
		}

		const count = await this.db.viewedArticles.count()
		if (count > this.MAX_RECORDS) {
			const excessCount = count - this.MAX_RECORDS
			const oldestRecords = await this.db.viewedArticles.orderBy('timestamp').limit(excessCount).toArray()

			const ids = oldestRecords.map((r: ArticleView) => r.id).filter((id): id is number => id !== undefined)
			await this.db.viewedArticles.bulkDelete(ids)
		}
	}
}

const dbManager = DatabaseManager.getInstance()

export const initDatabase = async (): Promise<void> => {
	await dbManager.initDatabase()
}

export const recordArticleView = async (articleId: number): Promise<{ process: boolean }> => {
	return await dbManager.recordArticleView(articleId)
}

export const syncArticleKV = async (): Promise<void> => {
	await dbManager.syncWithCFKV()
}

export const loadArticleViews = async (): Promise<ArticleView[]> => {
	const allRecords = await dbManager.loadArticleView()
	return allRecords.sort((a, b) => b.timestamp - a.timestamp)
}
