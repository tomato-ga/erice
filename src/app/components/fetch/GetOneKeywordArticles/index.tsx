'use server'

import { KeywordArticle, KeywordArticleApiResponse } from '../../../../../types/types'

/**
 * 指定されたキーワードに関連する記事を取得する非同期関数
 *
 * @param {string} word - 検索するキーワード
 * @returns {Promise<KeywordArticle[] | null>} キーワードに関連する記事の配列、またはエラー時はnull
 *
 * @throws {Error} APIリクエストが失敗した場合、またはレスポンスの形式が無効な場合
 *
 * @description
 * この関数は、指定されたキーワードに基づいて関連記事を取得するためのAPIエンドポイントにリクエストを送信します。
 * 成功した場合、関連記事の配列を返します。エラーが発生した場合、エラーをコンソールに記録し、nullを返します。
 *
 * 注意事項:
 * - 環境変数 NEXT_PUBLIC_API_URL が設定されている必要があります。
 * - APIレスポンスは KeywordArticleApiResponse 型に準拠している必要があります。
 * - キャッシュは使用せず、常に最新のデータを取得します（cache: 'no-store'）。
 *
 * コンポーネントタイプ:
 * この関数はサーバーコンポーネントとクライアントコンポーネントの両方で使用できます。
 * ただし、'use server'ディレクティブが使用されていないため、クライアントサイドでも実行可能です。
 * サーバーサイドレンダリングやサーバーサイドの処理で使用する場合は、
 * このファイルの先頭に'use server'ディレクティブを追加することを検討してください。
 */
// /Volumes/SSD_1TB/erice2/erice/src/app/components/fetch/GetOneKeywordArticles.ts

export async function getKeywordArticle(word: string): Promise<KeywordArticle[]> {
	const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/onekeyword?keyword=${word}`

	console.log('getKeywordArticle - Fetching from URL:', apiUrl) // デバッグログ

	try {
		const res = await fetch(apiUrl, { cache: 'no-store' })
		if (!res.ok) {
			const errorText = await res.text()
			console.error(`getKeywordArticle - API error (${res.status}):`, errorText)
			throw new Error(`API request failed with status ${res.status}: ${errorText}`)
		}
		const data: KeywordArticleApiResponse = await res.json()
		// console.log('getKeywordArticle - Received data:', JSON.stringify(data, null, 2)) // デバッグログ
		if (!data || !data.articles) {
			console.error('getKeywordArticle - API response does not contain article data:', data)
			throw new Error('Invalid API response format')
		}
		return data.articles
	} catch (error) {
		console.error('getKeywordArticle - Error fetching article:', error)
		return []
	}
}
