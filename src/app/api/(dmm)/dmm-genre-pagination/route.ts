import { NextRequest, NextResponse } from 'next/server'

const WORKER_URL = process.env.DMM_GENRE_PAGINATION_WORKER_URL

// APIResponseインターフェースを更新
interface APIResponse {
	items: { id: string; title: string; imageURL: string; content_id: string }[]
	currentPage: number
	totalPages: number
}

// 変換後のデータ構造を定義
interface TransformedAPIResponse {
	items: { db_id: string; title: string; imageURL: string; content_id: string }[]
	currentPage: number
	totalPages: number
}

export async function GET(request: NextRequest) {
	const genre = request.nextUrl.searchParams.get('genre')
	const page = request.nextUrl.searchParams.get('page') || '1'

	// APIキーをヘッダーに追加 (必要に応じて)
	const headers = new Headers()
	headers.append('X-API-Key', process.env.CLOUDFLARE_DMM_API_TOKEN || '') // API_KEY は適宜設定

	const apiParams = new URLSearchParams({ page })
	if (genre) {
		apiParams.append('genre', genre)
	}

	try {
		const response = await fetch(`${WORKER_URL}/items-by-genre?${apiParams}`, {
			headers: headers,
			cache: 'force-cache'
		})

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}))
			console.error('API Route error:', response.status, errorData)
			return NextResponse.json(
				{ error: 'Failed to fetch data from API route', details: errorData },
				{ status: response.status }
			)
		}

		const data = (await response.json()) as unknown

		// レスポンスデータのバリデーション
		if (
			typeof data === 'object' &&
			data !== null &&
			Array.isArray((data as APIResponse).items) &&
			typeof (data as APIResponse).currentPage === 'number' &&
			typeof (data as APIResponse).totalPages === 'number'
		) {
			const validatedData = data as APIResponse

			// idをdb_idに変換
			const transformedData: TransformedAPIResponse = {
				...validatedData,
				items: validatedData.items.map((item) => ({
					...item,
					db_id: item.id,
					id: undefined
				}))
			}

			return NextResponse.json(transformedData, {
				headers: {
					'Cache-Control': 'public, max-age=60, stale-while-revalidate=300'
				}
			})
		} else {
			throw new Error('Invalid response format from API route')
		}
	} catch (error) {
		console.error('Fetch error:', error)
		return NextResponse.json(
			{ error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' },
			{ status: 500 }
		)
	}
}
