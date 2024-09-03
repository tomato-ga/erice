import { NextRequest, NextResponse } from 'next/server'

const WORKER_URL = process.env.DMM_ACTRESS_PAGINATION_WORKER_URL

interface APIResponse {
	items: unknown[]
	currentPage: number
	totalPages: number
	actress?: string
}

export async function GET(request: NextRequest) {
	const actress = request.nextUrl.searchParams.get('actress')
	const page = request.nextUrl.searchParams.get('page') || '1'

	// APIキーをヘッダーに追加 (必要に応じて)
	const headers = new Headers()
	headers.append('X-API-Key', process.env.CLOUDFLARE_DMM_API_TOKEN || '') // API_KEY は適宜設定

	const apiParams = new URLSearchParams({ page })
	if (actress) {
		apiParams.append('actress', actress)
	}

	try {
		const controller = new AbortController()
		const timeoutId = setTimeout(() => controller.abort(), 5000) // 5秒タイムアウト

		const response = await fetch(`${WORKER_URL}/items-by-actress?${apiParams}`, {
			signal: controller.signal,
			headers: headers, // APIキーをヘッダーに追加
		})

		clearTimeout(timeoutId)

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}))
			console.error('API Route error:', response.status, errorData)
			return NextResponse.json(
				{ error: 'Failed to fetch data from API route', details: errorData },
				{ status: response.status },
			)
		}

		const data = (await response.json()) as unknown
		console.log('api/items-by-actress:', data)

		// レスポンスデータのバリデーション
		if (
			typeof data === 'object' &&
			data !== null &&
			Array.isArray((data as APIResponse).items) &&
			typeof (data as APIResponse).currentPage === 'number' &&
			typeof (data as APIResponse).totalPages === 'number'
		) {
			const validatedData = data as APIResponse

			// レスポンスデータを出力
			console.log('APIルートレスポンス:', validatedData)

			return NextResponse.json(validatedData, {
				headers: {
					'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
				},
			})
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
