import { RirekiArticleResponse } from '../../../../../types/types'
import { cache } from 'react'

export const getRirekiArticles = cache(async (userId: string): Promise<RirekiArticleResponse> => {
	console.log('userId:', userId)

	const API_KEY = process.env.D1_API_KEY
	const WORKER_URL = process.env.USER_HISTORY_WORKER_URL

	if (!API_KEY) {
		throw new Error('APIキーが設定されていません')
	}

	if (!WORKER_URL) {
		throw new Error('ワーカーURLが設定されていません')
	}

	const url = `${WORKER_URL}/${userId}`

	try {
		const res = await fetch(url, {
			headers: {
				'Content-Type': 'application/json',
				'X-API-Key': API_KEY
			}
		})

		if (!res.ok) {
			const errorData = await res.json().catch(() => ({}))
			throw new Error(`履歴の取得に失敗しました: ${res.status} ${res.statusText}`, { cause: errorData })
		}

		const data: RirekiArticleResponse = await res.json()

		return data
	} catch (error) {
		console.error('履歴の取得中にエラーが発生しました:', error)
		throw error
	}
})
