import { Keyword } from '../../../../types/types'

export async function fetchKeywords(): Promise<Keyword[]> {
	try {
		const response = await fetch('/api/poptags', { next: { revalidate: 3600 } })
		if (!response.ok) {
			throw new Error('Failed to fetch keywords')
		}
		const data = await response.json()
		console.log('API response:', data) // デバッグ用ログ
		return data
	} catch (error) {
		console.error('Error fetching keywords:', error)
		throw error // エラーを上位に伝播させる
	}
}
