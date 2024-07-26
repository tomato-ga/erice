import { v7 as uuidv7 } from 'uuid'
import Cookies from 'js-cookie'
import CryptoJS from 'crypto-js'

const USER_ID_COOKIE = 'uid'
const COOKIE_EXPIRY = 365 * 3
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY

export const getUserId = async (): Promise<string> => {
	if (typeof window === 'undefined') {
		// console.log('サーバーサイドでgetUserIdが呼び出されました。一時的なIDを返します。')
		return 'server-side-temp-id'
	}

	if (!ENCRYPTION_KEY) {
		// console.error('環境変数ENCRYPTION_KEYが設定されていません。暗号化なしで新しいユーザーIDを生成します。')
		return uuidv7()
	}

	let encryptedUserId = Cookies.get(USER_ID_COOKIE)
	if (encryptedUserId) {
		// console.log('暗号化されたユーザーIDがクッキーから見つかりました。復号を試みます。')
		try {
			const decryptedId = decrypt(encryptedUserId)
			if (decryptedId) {
				// console.log('ユーザーIDの復号に成功しました。')
				return decryptedId
			}
		} catch (error) {
			// console.error('ユーザーIDの復号に失敗しました:', error)
		}
	}

	// console.log('新しいユーザーIDを生成します。')
	const userId = uuidv7()
	try {
		const encryptedNewId = encrypt(userId)
		// console.log('新しいユーザーIDを暗号化し、クッキーに保存します。')
		Cookies.set(USER_ID_COOKIE, encryptedNewId, {
			expires: COOKIE_EXPIRY,
			secure: true,
			sameSite: 'strict'
		})
	} catch (error) {
		// console.error('新しいユーザーIDの暗号化と保存に失敗しました:', error)
	}

	return userId
}

const encrypt = (text: string): string => {
	if (!ENCRYPTION_KEY) throw new Error('ENCRYPTION_KEYが設定されていません')
	try {
		// console.log('テキストを暗号化します。')
		return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString()
	} catch (error) {
		// console.error('暗号化に失敗しました:', error)
		throw error
	}
}

const decrypt = (ciphertext: string): string => {
	if (!ENCRYPTION_KEY) throw new Error('ENCRYPTION_KEYが設定されていません')
	try {
		// console.log('暗号文を復号します。')
		const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY)
		const decrypted = bytes.toString(CryptoJS.enc.Utf8)
		if (!decrypted) {
			throw new Error('復号結果が空文字列です')
		}
		return decrypted
	} catch (error) {
		// console.error('復号に失敗しました:', error)
		throw error
	}
}
