import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

const WORKER_URL = process.env.DMM_GENRE_PAGINATION_WORKER_URL

// APIResponseインターフェースを更新
interface APIResponse {
	items: { id: string; title: string; imageURL: string; content_id: string }[]
}

// 変換後のデータ構造を定義
interface TransformedAPIResponse {
	items: { db_id: string; title: string; imageURL: string; content_id: string }[]
}

export async function GET(request: NextRequest) {
	const genre = request.nextUrl.searchParams.get('genre')
	console.log('APIgenre (before decode):', genre)

	// URLデコードを行う
	const decodedGenre = genre ? decodeURIComponent(genre) : null
	console.log('APIgenre (after decode):', decodedGenre)

	// APIキーをヘッダーに追加 (必要に応じて)
	const headers = new Headers()
	headers.append('X-API-Key', process.env.CLOUDFLARE_DMM_API_TOKEN || '') // API_KEY は適宜設定

	try {
		// デコードされたジャンルを使用し、再度エンコード
		const response = await fetch(
			`${WORKER_URL}/items-by-genre-limit?genre=${encodeURIComponent(decodedGenre || '')}`,
			{
				headers: headers,
				next: { revalidate: 60 * 60 * 24 * 7 },
			},
		)

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}))
			console.error('API Route error:', response.status, errorData)
			return NextResponse.json(
				{ error: 'Failed to fetch data from API route', details: errorData },
				{ status: response.status },
			)
		}

		const data = (await response.json()) as unknown
		console.log('data genre limit:', data)

		// レスポンスデータのバリデーション

		if (data) {
			const validatedData = data as APIResponse

			// idをdb_idに変換
			const transformedData: TransformedAPIResponse = {
				...validatedData,
				items: validatedData.items.map(item => ({
					...item,
					db_id: item.id,
				})),
			}

			revalidateTag(`related-genre-${decodedGenre || ''}`)

			return NextResponse.json(transformedData)
		}
	} catch (error) {
		console.error('Fetch error:', error)
		return NextResponse.json(
			{
				error: 'Internal Server Error',
				details: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		)
	}
}
