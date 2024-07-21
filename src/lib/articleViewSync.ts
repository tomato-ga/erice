import Dexie from 'dexie'
import { getUserId } from './dataSync'

export interface ArticleView {
	id?: number
	articleId: number
	timestamp: number
	synced: number
}

class ArticleViewDatabase extends Dexie {
	viewedArticles!: Dexie.Table<ArticleView, number>

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

	async initDatabase() {
		if (this.db) {
			// console.log('データベースは既に初期化されています')
			return
		}

		try {
			this.db = new ArticleViewDatabase()
			await this.db.open()
			// console.log('データベースが正常に初期化されました')
		} catch (error) {
			// console.error('データベースの初期化に失敗しました:', error)
			throw error
		}
	}

	async recordArticleView(articleId: number): Promise<{ process: boolean }> {
		if (!this.db) {
			throw new Error('データベースが初期化されていません。initDatabase()を先に呼び出してください。')
		}

		const timestamp = Date.now()

		try {
			await this.db.transaction('rw', this.db.viewedArticles, async () => {
				const existingView = await this.db!.viewedArticles.where('articleId').equals(articleId).first()

				if (existingView) {
					// console.log(`既存の閲覧記録が見つかりました: articleId=${articleId}`)
					await this.db!.viewedArticles.update(existingView.id!, {
						timestamp: timestamp,
						synced: 0
					})
					// console.log(`閲覧記録を更新しました: articleId=${articleId}, newTimestamp=${timestamp}`)
				} else {
					// レコード数をチェック
					const count = await this.db!.viewedArticles.count()
					if (count >= this.MAX_RECORDS) {
						// 最も古いレコードを削除
						const oldestRecord = await this.db!.viewedArticles.orderBy('timestamp').first()
						if (oldestRecord && oldestRecord.id !== undefined) {
							await this.db!.viewedArticles.delete(oldestRecord.id)
							// console.log(`最も古いレコードを削除しました: articleId=${oldestRecord.articleId}`)
						}
					}

					const id = await this.db!.viewedArticles.add({
						articleId,
						timestamp,
						synced: 0
					})
					// console.log(`新しい閲覧記録を追加しました: articleId=${articleId}, id=${id}, timestamp=${timestamp}`)
				}

				// 50件を超えるレコードがある場合、古いものから削除
				await this.cleanupExcessRecords()
			})
			// ArticleLinksの呼び出し元にtrueを返す
			return { process: true }
		} catch (error) {
			// console.error(`記事閲覧の記録に失敗しました: articleId=${articleId}`, error)
			return { process: false }
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

	async syncWithCFKV() {
		if (this.syncInProgress) {
			// console.log('同期が既に進行中です。スキップします。')
			return
		}

		this.syncInProgress = true

		try {
			if (!this.db) {
				throw new Error('データベースが初期化されていません。同期をスキップします。')
			}

			const unsyncedRecords = await this.db.viewedArticles.where('synced').equals(0).toArray()

			if (unsyncedRecords.length === 0) {
				console.log('同期するレコードがありません。')
				return
			}

			const syncData = {
				userId: await getUserId(),
				viewedArticles: unsyncedRecords.map((record) => ({
					articleId: record.articleId,
					timestamp: record.timestamp
				}))
			}

			const response = await fetch('/api/viewed-articles', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(syncData)
			})

			if (!response.ok) {
				throw new Error(`サーバーとの同期に失敗しました: ${response.statusText}`)
			}

			const result = await response.json()
			// console.log('同期結果:', result)

			// 同期成功したレコードを更新
			const ids = unsyncedRecords.map((r) => r.id).filter((id): id is number => id !== undefined)
			await this.db.viewedArticles.where('id').anyOf(ids).modify({ synced: 1 })
			// console.log(`${unsyncedRecords.length}件のレコードを同期しました`)
		} catch (error) {
			console.error('同期中にエラーが発生しました:', error)
			// エラーハンドリングとリトライロジックをここに実装
		} finally {
			this.syncInProgress = false
		}
	}

	private async cleanupExcessRecords() {
		if (!this.db) {
			throw new Error('データベースが初期化されていません。クリーンアップをスキップします。')
		}

		const count = await this.db.viewedArticles.count()
		if (count > this.MAX_RECORDS) {
			const excessCount = count - this.MAX_RECORDS
			const oldestRecords = await this.db.viewedArticles.orderBy('timestamp').limit(excessCount).toArray()

			const ids = oldestRecords.map((r) => r.id).filter((id): id is number => id !== undefined)
			await this.db.viewedArticles.bulkDelete(ids)
			console.log(`${excessCount}件の古いレコードを削除しました`)
		}
	}
}

// DatabaseManagerのインスタンスを作成
const dbManager = DatabaseManager.getInstance()

// エクスポートする関数
export const initDatabase = async () => {
	await dbManager.initDatabase()
}

export const recordArticleView = async (articleId: number): Promise<{ process: boolean }> => {
	return await dbManager.recordArticleView(articleId)
}

export const syncArticleKV = async () => {
	await dbManager.syncWithCFKV()
}

export const loadArticleViews = async (): Promise<ArticleView[]> => {
	const allRecords = await dbManager.loadArticleView()
	return allRecords.sort((a, b) => b.timestamp - a.timestamp)
}
