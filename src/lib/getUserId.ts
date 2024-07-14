import { v4 as uuidv4 } from 'uuid'
import Cookies from 'js-cookie'
import CryptoJS from 'crypto-js'

// クッキーの名称と有効期限設定
const USER_ID_COOKIE = 'uid'
const COOKIE_EXPIRY = 365 * 3
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY

export const getUserId = (): string => {
	if (typeof window === 'undefined') {
		// サーバーサイドレンダリング時は一時的なIDを返す
		return 'server-side-temp-id'
	}

	if (!ENCRYPTION_KEY) {
		console.error('ENCRYPTION_KEY is not set')
		return uuidv4() // 暗号化キーがない場合は新しいUUIDを生成して返す
	}

	let encryptedUserId = Cookies.get(USER_ID_COOKIE)
	if (encryptedUserId) {
		try {
			return decrypt(encryptedUserId)
		} catch (error) {
			console.error('Failed to decrypt user ID:', error)
			// 復号化に失敗した場合は新しいUUIDを生成する
		}
	}

	// 新しいUUIDを生成し、暗号化して保存
	const userId = uuidv4()
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

// 環境変数のチェック
if (typeof window !== 'undefined' && !ENCRYPTION_KEY) {
	console.error('ENCRYPTION_KEY is not set in the environment variables')
}
