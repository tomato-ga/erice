import { KobetuPageArticle } from "../../../../types/types"

export async function getKobetuArticles(postId: string): Promise<KobetuPageArticle | null> {
	const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/kobetupage?postId=${postId}`

	try {
		const res = await fetch(apiUrl, { cache: 'no-store' })
		if (!res.ok) {
			console.error('Failed to fetch articles', res.statusText)
			return null
		}
		const data = await res.json()
		console.log('Fetched data:', JSON.stringify(data, null, 2)) // 詳細なレスポンスをログに出力

		if (data.article) {
			const article: KobetuPageArticle = {
				id: data.article.id,
				title: data.article.title,
				link: data.article.link,
				created_at: data.article.createdAt,
				image_url: data.article.imageUrl,
				site_name: data.article.siteName,
				keywords: data.article.keywords.map((keyword: any) => ({
					id: keyword.id,
					keyword: keyword.keyword
				}))
			}
			return article
		} else {
			console.error('Unexpected API response structure:', data)
			return null
		}
	} catch (error) {
		console.error('Error fetching article:', error)
		return null
	}
}
