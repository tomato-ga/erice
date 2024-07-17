import { v7 as uuidv7 } from 'uuid'
import Cookies from 'js-cookie'
import CryptoJS from 'crypto-js'

const USER_ID_COOKIE = 'uid'
const COOKIE_EXPIRY = 365 * 3
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY

export const getUserId = (): string => {
	if (typeof window === 'undefined') {
		console.log('サーバーサイドでgetUserIdが呼び出されました。一時的なIDを返します。')
		return 'server-side-temp-id'
	}

	if (!ENCRYPTION_KEY) {
		console.error('環境変数ENCRYPTION_KEYが設定されていません。暗号化なしで新しいユーザーIDを生成します。')
		return uuidv7()
	}

	let encryptedUserId = Cookies.get(USER_ID_COOKIE)
	if (encryptedUserId) {
		console.log('暗号化されたユーザーIDがクッキーから見つかりました。復号を試みます。')
		try {
			const decryptedId = decrypt(encryptedUserId)
			if (decryptedId) {
				console.log('ユーザーIDの復号に成功しました。')
				return decryptedId
			}
		} catch (error) {
			console.error('ユーザーIDの復号に失敗しました:', error)
		}
	}

	console.log('新しいユーザーIDを生成します。')
	const userId = uuidv7()
	try {
		const encryptedNewId = encrypt(userId)
		console.log('新しいユーザーIDを暗号化し、クッキーに保存します。')
		Cookies.set(USER_ID_COOKIE, encryptedNewId, {
			expires: COOKIE_EXPIRY,
			secure: true,
			sameSite: 'strict'
		})
	} catch (error) {
		console.error('新しいユーザーIDの暗号化と保存に失敗しました:', error)
	}

	return userId
}

const encrypt = (text: string): string => {
	if (!ENCRYPTION_KEY) throw new Error('ENCRYPTION_KEYが設定されていません')
	try {
		console.log('テキストを暗号化します。')
		return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString()
	} catch (error) {
		console.error('暗号化に失敗しました:', error)
		throw error
	}
}

const decrypt = (ciphertext: string): string => {
	if (!ENCRYPTION_KEY) throw new Error('ENCRYPTION_KEYが設定されていません')
	try {
		console.log('暗号文を復号します。')
		const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY)
		const decrypted = bytes.toString(CryptoJS.enc.Utf8)
		if (!decrypted) {
			throw new Error('復号結果が空文字列です')
		}
		return decrypted
	} catch (error) {
		console.error('復号に失敗しました:', error)
		throw error
	}
}
class DataSyncManager {
	private userId: string
	private articleViews: Set<number> = new Set()
	private syncInterval: number = 30000 // 30秒
	private storageKey: string = 'article_view'

	constructor() {
		console.log('DataSyncManagerを初期化します。')
		this.userId = getUserId()
		this.loadArticleViews()
		this.setupIntervalSync()
		this.setupUnloadSync()
	}

	private loadArticleViews() {
		console.log('ローカルストレージから記事閲覧履歴を読み込みます。')
		const storedViews = localStorage.getItem(this.storageKey)
		if (storedViews) {
			this.articleViews = new Set(JSON.parse(storedViews))
			console.log(`${this.articleViews.size}件の記事閲覧履歴を読み込みました。`)
		} else {
			console.log('記事閲覧履歴がありません。')
		}
	}

	private saveArticleViews() {
		console.log(`${this.articleViews.size}件の記事閲覧履歴をローカルストレージに保存します。`)
		localStorage.setItem(this.storageKey, JSON.stringify(Array.from(this.articleViews)))
	}

	public addArticleView(articleId: number) {
		console.log(`記事ID ${articleId} の閲覧を記録します。`)
		this.articleViews.delete(articleId) // 既存のエントリを削除（存在しない場合は何もしない）
		this.articleViews.add(articleId) // 新しいエントリを先頭に追加
		this.trimArticleViews()
		this.saveArticleViews()
		this.syncData()
	}

	private trimArticleViews() {
		if (this.articleViews.size > 50) {
			console.log('閲覧履歴が50件を超えたため、古い履歴を削除します。')
			const sortedViews = Array.from(this.articleViews).sort((a, b) => b - a)
			this.articleViews = new Set(sortedViews.slice(0, 50))
		}
	}

	private async syncData() {
		if (this.articleViews.size === 0) return

		console.log('サーバーとデータを同期します。')
		try {
			const syncData = {
				userId: this.userId,
				viewedArticles: Array.from(this.articleViews)
			}
			console.log('送信データ:', JSON.stringify(syncData, null, 2))

			const response = await fetch('/api/viewed-articles', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(syncData)
			})

			if (!response.ok) {
				const errorText = await response.text()
				throw new Error(`サーバーとの同期に失敗しました。ステータス: ${response.status}, エラー: ${errorText}`)
			}

			console.log('サーバーとの同期が完了しました。')
			// ローカルデータはクリアせず、維持します
		} catch (error) {
			console.error('同期エラー:', error)
		}
	}

	private setupIntervalSync() {
		console.log(`${this.syncInterval / 1000}秒ごとの定期同期を設定します。`)
		setInterval(() => this.syncData(), this.syncInterval)
	}

	private setupUnloadSync() {
		console.log('ページアンロード時の同期を設定します。')
		window.addEventListener('beforeunload', () => this.syncData())
	}
}

let instance: DataSyncManager | null = null

export function initDataSyncManager() {
	if (typeof window !== 'undefined' && !instance) {
		console.log('DataSyncManagerを初期化します。')
		instance = new DataSyncManager()
		;(window as any).dataSyncManager = instance
	}
}

export function getDataSyncManager(): DataSyncManager | null {
	return instance
}

if (typeof window !== 'undefined' && !ENCRYPTION_KEY) {
	console.error('環境変数にENCRYPTION_KEYが設定されていません')
}

export default DataSyncManager
