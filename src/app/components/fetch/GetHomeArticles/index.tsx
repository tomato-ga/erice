/**
 * ホームページの記事を取得する関数
 *
 * @param {number} page - 取得するページ番号
 * @param {number} limit - 1ページあたりの記事数
 * @returns {Promise<HomePageApiResponse>} 記事データとページ情報を含むレスポンス
 *
 * @description
 * この関数は、指定されたページと制限に基づいてホームページの記事を取得します。
 * APIリクエストを送信し、結果を処理して返します。
 * エラー処理とログ記録も行います。
 *
 * @example
 * const { articles, totalPages } = await getHomeArticles(1, 10);
 */

// import { useQuery } from '@tanstack/react-query'
import { HomePageApiResponse } from '@/types/types'

// const fetchHomeArticles = async (page: number, limit: number): Promise<HomePageApiResponse> => {
// 	const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/toppage?page=${page}&limit=${limit}`
// 	const res = await fetch(apiUrl, {
// 		headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_D1_API_KEY}` }
// 	})
// 	if (!res.ok) {
// 		throw new Error('Failed to fetch articles')
// 	}
// 	return res.json()
// }

// export const useHomeArticles = (page: number, limit: number) => {
// 	return useQuery({
// 		queryKey: ['homeArticles', page, limit],
// 		queryFn: () => fetchHomeArticles(page, limit),
// 		staleTime: 60 * 1000 // 1分
// 	})
// }

export async function getHomeArticles(page: number, limit: number): Promise<HomePageApiResponse> {
	const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/toppage?page=${page}&limit=${limit}`

	console.log(`[Server] Fetching articles. URL: ${apiUrl}`)

	const startTime = Date.now()
	const res = await fetch(apiUrl, {
		// cache: 'no-store',
		next: { revalidate: 3600 }, // 1時間ごとにキャッシュを再検証
		headers: { Authorization: `Bearer ${process.env.D1_API_KEY}` }
	})
	const endTime = Date.now()

	console.log(`[Server] API request completed. Time taken: ${endTime - startTime}ms`)

	if (!res.ok) {
		console.error(`[Server] API request failed. Status: ${res.status}`)
		throw new Error('Failed to fetch articles')
	}

	const data: HomePageApiResponse = await res.json()
	console.log(`[Server] API response processed. Articles count: ${data.articles?.length || 0}`)

	if (!data.articles || !Array.isArray(data.articles)) {
		console.error('[Server] Unexpected API response structure:', data)
		return { articles: [], totalPages: 0 }
	}

	return data
}
