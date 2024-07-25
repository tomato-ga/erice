import Dexie from 'dexie'
import { getUserId } from './dataSync'

class KeywordViewDatabase extends Dexie {
	keywordViews!: Dexie.Table<{ id?: number; keywordId: number; timestamp: string }, number>

	constructor() {
		super('KeywordViewDatabase')
		this.version(1).stores({
			keywordViews: '++id, keywordId, timestamp'
		})
	}
}

class KeywordDatabaseManager {
	private static instance: KeywordDatabaseManager
	private db: KeywordViewDatabase | null = null
	private syncInProgress: boolean = false
	private readonly MAX_RECORDS = 1000

	private constructor() {}

	static getInstance(): KeywordDatabaseManager {
		if (!KeywordDatabaseManager.instance) {
			KeywordDatabaseManager.instance = new KeywordDatabaseManager()
		}
		return KeywordDatabaseManager.instance
	}

	async initDatabase() {
		if (this.db) {
			return
		}

		try {
			this.db = new KeywordViewDatabase()
			await this.db.open()
		} catch (error) {
			console.error('キーワードデータベースの初期化に失敗しました:', error)
			throw error
		}
	}

	async recordKeywordView(keywordId: number): Promise<{ process: boolean }> {
		if (!this.db) {
			throw new Error('データベースが初期化されていません。initKeywordDatabase()を先に呼び出してください。')
		}

		try {
			const timestamp = new Date().toISOString()
			await this.db.keywordViews.add({
				keywordId,
				timestamp
			})
			// console.log(`キーワード閲覧を記録しました: ${keywordId}`)
			return { process: true }
		} catch (error) {
			console.error(`キーワード閲覧の記録に失敗しました:`, error)
			// エラーの詳細をログに出力
			if (error instanceof Error) {
				console.error(`エラーメッセージ: ${error.message}`)
				console.error(`スタックトレース: ${error.stack}`)
			}
			return { process: false }
		}
	}

	async loadKeywordViews(): Promise<number[]> {
		if (!this.db) {
			throw new Error('データベースが初期化されていません。initKeywordDatabase()を先に呼び出してください。')
		}

		try {
			const views = await this.db.keywordViews.reverse().toArray()
			return views.map((view) => view.keywordId)
		} catch (error) {
			console.error('キーワード閲覧記録の読み取りにエラーが発生しました', error)
			throw error
		}
	}

	async syncWithCFKV() {
		if (this.syncInProgress) {
			return
		}

		this.syncInProgress = true

		try {
			if (!this.db) {
				throw new Error('データベースが初期化されていません。同期をスキップします。')
			}

			const keywordIds = await this.loadKeywordViews()

			if (keywordIds.length === 0) {
				return
			}

			const syncData = {
				userId: await getUserId(),
				viewedKeywords: keywordIds
			}

			const response = await fetch('/api/viewed-keywords', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(syncData)
			})

			if (!response.ok) {
				throw new Error(`サーバーとの同期に失敗しました: ${response.statusText}`)
			}

			await response.json()

			// 同期後にデータベースをクリア
			await this.db.keywordViews.clear()
		} catch (error) {
			console.error('同期中にエラーが発生しました:', error)
		} finally {
			this.syncInProgress = false
		}
	}
}

const keywordDbManager = KeywordDatabaseManager.getInstance()

export const initKeywordDatabase = async () => {
	await keywordDbManager.initDatabase()
}

export const recordKeywordView = async (keywordId: number): Promise<{ process: boolean }> => {
	return await keywordDbManager.recordKeywordView(keywordId)
}

export const syncKeywordKV = async () => {
	await keywordDbManager.syncWithCFKV()
}

export const loadKeywordViews = async (): Promise<number[]> => {
	return await keywordDbManager.loadKeywordViews()
}
