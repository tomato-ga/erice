import { v4 as uuidv4 } from 'uuid'
import Cookies from 'js-cookie'
import CryptoJS from 'crypto-js'

// クッキーの名称と有効期限設定
const USER_ID_COOKIE = 'uid'
const COOKIE_EXPIRY = 365 * 3
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY as string

export const getUserId = (): string => {
	let encryptedUserId = Cookies.get(USER_ID_COOKIE)
	if (encryptedUserId) {
		return decrypt(encryptedUserId)
	} else {
		const userId = uuidv4()
		encryptedUserId = encrypt(userId)
		Cookies.set(USER_ID_COOKIE, encryptedUserId, {
			expires: COOKIE_EXPIRY,
			secure: true,
			sameSite: 'strict'
		})
		return userId
	}
}

const encrypt = (text: string): string => {
	return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString()
}

const decrypt = (ciphertext: string): string => {
	const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY)
	return bytes.toString(CryptoJS.enc.Utf8)
}
