'use server'

import { KobetuPageArticle, SingleArticleApiResponse } from '../../../../../types/types'

/**
 * 指定された記事IDに基づいて個別の記事データを取得する非同期関数
 *
 * @param {string} postId - 取得したい記事のID
 * @returns {Promise<KobetuPageArticle | null>} 記事データ、またはエラー時はnull
 *
 * @throws {Error} APIリクエストが失敗した場合、またはレスポンスの形式が無効な場合
 *
 * @description
 * この関数は、指定された記事IDを使用して個別の記事データを取得するためのAPIエンドポイントにリクエストを送信します。
 * 成功した場合、記事データを返します。エラーが発生した場合、エラーをコンソールに記録し、nullを返します。
 *
 * 注意事項:
 * - 環境変数 NEXT_PUBLIC_API_URL が設定されている必要があります。
 * - APIレスポンスは SingleArticleApiResponse 型に準拠している必要があります。
 * - キャッシュは使用せず、常に最新のデータを取得します（revalidate: false）。
 *
 * コンポーネントタイプ:
 * この関数はサーバーコンポーネントとクライアントコンポーネントの両方で使用できます。
 * ただし、'use server'ディレクティブが使用されていないため、クライアントサイドでも実行可能です。
 * サーバーサイドレンダリングやサーバーサイドの処理で使用する場合は、
 * このファイルの先頭に'use server'ディレクティブを追加することを検討してください。
 */
export async function getKobetuArticle(postId: string): Promise<KobetuPageArticle | null> {
	const apiUrl = `${process.env.APIROUTE_URL}/api/kobetupage?postId=${postId}`

	try {
		const res = await fetch(
			apiUrl,
			// { next: { revalidate: 10800 } }
			{ next: { revalidate: false } }
		)
		if (!res.ok) {
			const errorText = await res.text()
			console.error(`API error (${res.status}):`, errorText)
			throw new Error(`API request failed with status ${res.status}: ${errorText}`)
		}
		const data: SingleArticleApiResponse = await res.json()
		if (!data.article) {
			console.error('API response does not contain article data:', data)
			throw new Error('Invalid API response format')
		}
		return data.article
	} catch (error) {
		console.error('Error fetching article:', error)
		return null
	}
}
