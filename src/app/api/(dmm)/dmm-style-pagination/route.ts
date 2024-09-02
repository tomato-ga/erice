import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// APIレスポンスの型定義
const APIResponseSchema = z.object({
	items: z.array(
		z.object({
			id: z.string(),
			title: z.string(),
			imageURL: z.string().transform(str => JSON.parse(str)), // 文字列をJSONに変換
			content_id: z.string(),
		}),
	),
	currentPage: z.number(),
	totalPages: z.number(),
	style: z.string(),
})

type APIResponse = z.infer<typeof APIResponseSchema>

// 変換後のレスポンスの型定義
interface TransformedAPIResponse {
	items: {
		db_id: string
		title: string
		imageURL: { large: string; list: string; small: string }
		content_id: string
	}[]
	currentPage: number
	totalPages: number
	style: string
}

export async function GET(request: NextRequest) {
	// 環境変数の取得と検証
	const WORKER_URL = process.env.DMM_STYLE_PAGINATION_WORKER_URL

	if (!WORKER_URL) {
		console.error('DMM_STYLE_PAGINATION_WORKER_URL is not set')
		return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
	}

	const API_TOKEN = process.env.CLOUDFLARE_DMM_API_TOKEN

	if (!API_TOKEN) {
		console.error('CLOUDFLARE_DMM_API_TOKEN is not set')
		return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
	}

	const style = request.nextUrl.searchParams.get('style')
	console.log('Received style parameter:', style) // 受け取ったstyleパラメータをログに出力
	const page = request.nextUrl.searchParams.get('page') || '1'

	const headers = new Headers()
	headers.append('X-API-Key', API_TOKEN)

	const apiParams = new URLSearchParams()
	apiParams.append('page', page)
	if (style) {
		const encodedStyle = encodeURIComponent(style)
		console.log('Encoded style parameter:', encodedStyle) // エンコードされたstyleパラメータをログに出力
		apiParams.append('style', encodedStyle)
	}

	const requestUrl = `${WORKER_URL}?${apiParams.toString()}`
	console.log('Request URL:', requestUrl)

	try {
		const response = await fetch(requestUrl, {
			headers: headers,
			next: { revalidate: 60 }, // 1分ごとに再検証
		})

		if (!response.ok) {
			const errorText = await response.text()
			console.error('API Route error:', response.status, errorText, {
				url: requestUrl,
				headers: Object.fromEntries(headers),
			})
			return NextResponse.json(
				{ error: 'Failed to fetch data from API route' },
				{ status: response.status },
			)
		}

		const data = await response.json()
		const validationResult = APIResponseSchema.safeParse(data)

		if (!validationResult.success) {
			console.error('Invalid data format:', validationResult.error)
			return NextResponse.json({ error: 'Invalid data format from API route' }, { status: 500 })
		}

		const validatedData = validationResult.data

		const transformedData: TransformedAPIResponse = {
			...validatedData,
			items: validatedData.items.map(item => ({
				db_id: item.id,
				title: item.title,
				imageURL: item.imageURL, // すでにオブジェクトとしてパースされている
				content_id: item.content_id,
			})),
		}

		return NextResponse.json(transformedData, {
			headers: {
				'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
			},
		})
	} catch (error) {
		console.error('Fetch error:', error, {
			url: requestUrl,
			headers: Object.fromEntries(headers),
			stack: error instanceof Error ? error.stack : undefined,
		})
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
	}
}
