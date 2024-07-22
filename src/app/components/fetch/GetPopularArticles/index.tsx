// app/actions/getPopularArticles.ts
import { PopularArticlesResponse } from '../../../../../types/types'

export async function getPopularArticles(): Promise<PopularArticlesResponse> {
	const API_KEY = process.env.D1_API_KEY
	const WORKER_URL = process.env.POPULAR_ARTICLE_WORKER_URL

	if (!API_KEY) {
		throw new Error('APIキーが設定されていません')
	}

	if (!WORKER_URL) {
		throw new Error('ワーカーURLが設定されていません')
	}

	const res = await fetch(WORKER_URL, {
		headers: {
			'Content-Type': 'application/json',
			'X-API-Key': API_KEY
		},
		next: { revalidate: 3600 } // 1時間ごとに再検証
	})

	if (!res.ok) {
		throw new Error('人気記事の取得に失敗しました')
	}

	return res.json()
}
