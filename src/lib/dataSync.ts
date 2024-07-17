import { v7 as uuidv7 } from 'uuid'
import Cookies from 'js-cookie'
import CryptoJS from 'crypto-js'
import { ArticleViewData, SyncData, UserAction } from '../../types/types'

const USER_ID_COOKIE = 'uid'
const COOKIE_EXPIRY = 365 * 3
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY

export const getUserId = (): string => {
	if (typeof window === 'undefined') {
		return 'server-side-temp-id'
	}

	if (!ENCRYPTION_KEY) {
		console.error('ENCRYPTION_KEY is not set')
		return uuidv7()
	}

	let encryptedUserId = Cookies.get(USER_ID_COOKIE)
	if (encryptedUserId) {
		try {
			return decrypt(encryptedUserId)
		} catch (error) {
			console.error('Failed to decrypt user ID:', error)
		}
	}

	const userId = uuidv7()
	encryptedUserId = encrypt(userId)
	Cookies.set(USER_ID_COOKIE, encryptedUserId, {
		expires: COOKIE_EXPIRY,
		secure: true,
		sameSite: 'strict'
	})

	return userId
}

const encrypt = (text: string): string => {
	if (!ENCRYPTION_KEY) throw new Error('ENCRYPTION_KEY is not set')
	return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString()
}

const decrypt = (ciphertext: string): string => {
	if (!ENCRYPTION_KEY) throw new Error('ENCRYPTION_KEY is not set')
	const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY)
	return bytes.toString(CryptoJS.enc.Utf8)
}

class DataSyncManager {
	private userId: string
	private buffer: UserAction[] = []
	private syncInterval: number = 30000 // 30秒
	private bufferThreshold: number = 7
	private storageKey: string = 'user_actions_buffer'
	private viewedArticles: Set<number> = new Set()

	constructor() {
		this.userId = getUserId()
		this.loadBufferFromStorage()
		this.setupIntervalSync()
		this.setupUnloadSync()
		this.loadViewedArticles()
	}

	private loadBufferFromStorage() {
		const storedBuffer = localStorage.getItem(this.storageKey)
		if (storedBuffer) {
			this.buffer = JSON.parse(storedBuffer)
		}
	}

	private saveBufferToStorage() {
		localStorage.setItem(this.storageKey, JSON.stringify(this.buffer))
	}

	private setupIntervalSync() {
		setInterval(() => this.syncData(), this.syncInterval)
	}

	private setupUnloadSync() {
		window.addEventListener('beforeunload', () => this.syncData())
	}

	private loadViewedArticles() {
		const viewedArticles = localStorage.getItem('viewed_articles')
		if (viewedArticles) {
			this.viewedArticles = new Set(JSON.parse(viewedArticles))
		}
	}

	private saveViewedArticles() {
		localStorage.setItem('viewed_articles', JSON.stringify(Array.from(this.viewedArticles)))
	}

	public addArticleView(articleViewData: ArticleViewData) {
		if (this.viewedArticles.has(articleViewData.article_id)) {
			console.log(`Article ${articleViewData.article_id} already viewed. Skipping.`)
			return
		}

		const userAction: UserAction = {
			userId: this.userId,
			type: 'article_view',
			data: articleViewData
		}
		this.buffer.push(userAction)
		this.viewedArticles.add(articleViewData.article_id)
		this.saveBufferToStorage()
		this.saveViewedArticles()

		if (this.buffer.length >= this.bufferThreshold) {
			this.syncData()
		}
	}

	private async syncData() {
		if (this.buffer.length === 0) return

		try {
			await this.sendDataToServer(this.buffer)
			this.buffer = []
			this.saveBufferToStorage()
		} catch (error) {
			console.error('同期エラー:', error)
		}
	}

	private async sendDataToServer(actions: UserAction[]): Promise<void> {
		const syncData: SyncData = {
			userId: this.userId,
			actions: actions
		}

		const response = await fetch('/api/record-article', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(syncData)
		})

		if (!response.ok) {
			throw new Error('Failed to send data to server')
		}
	}
}

declare global {
	interface Window {
		dataSyncManager: DataSyncManager
	}
}

if (typeof window !== 'undefined') {
	window.dataSyncManager = new DataSyncManager()
}

if (typeof window !== 'undefined' && !ENCRYPTION_KEY) {
	console.error('ENCRYPTION_KEY is not set in the environment variables')
}

export default DataSyncManager
