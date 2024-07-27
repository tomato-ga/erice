import { v7 as uuidv7 } from 'uuid'
import Cookies from 'js-cookie'
import CryptoJS from 'crypto-js'

const USER_ID_COOKIE = 'uid'
const COOKIE_EXPIRY = 365 * 3
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY

/**
 * ユーザーIDを取得または生成する非同期関数
 * 
 * この関数は以下の動作を行います：
 * 1. サーバーサイドで実行された場合、一時的なIDを返します。
 * 2. ENCRYPTION_KEYが設定されていない場合、新しいUUIDv7を生成して返します。
 * 3. クッキーに暗号化されたユーザーIDが存在する場合、それを復号して返します。
 * 4. クッキーにユーザーIDが存在しない場合、新しいUUIDv7を生成し、暗号化してクッキーに保存します。
 * 
 * 使用方法：
 * この関数はクライアントサイドコンポーネントで使用することを想定しています。
 * Reactコンポーネント内でuseEffect()フックと組み合わせて使用するのが一般的です。
 * 
 * 例：
 * ```typescript
 * import { useEffect, useState } from 'react'
 * import { getUserId } from '@/lib/dataSync'
 * 
 * function MyComponent() {
 *   const [userId, setUserId] = useState<string | null>(null)
 * 
 *   useEffect(() => {
 *     const fetchUserId = async () => {
 *       const id = await getUserId()
 *       setUserId(id)
 *     }
 *     fetchUserId()
 *   }, [])
 * 
 *   if (!userId) return <div>Loading...</div>
 * 
 *   return <div>User ID: {userId}</div>
 * }
 * ```
 * 
 * 注意：
 * - この関数はクライアントサイドでのみ完全に機能します。サーバーサイドレンダリング時には一時的なIDを返します。
 * - NEXT_PUBLIC_ENCRYPTION_KEYが環境変数として設定されていることを確認してください。
 * 
 * @returns {Promise<string>} ユーザーID
 * @throws {Error} 暗号化や復号に失敗した場合
 */
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
