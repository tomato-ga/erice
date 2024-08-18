import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// 女優プロフィール情報のZodスキーマ
const ActressSchema = z.object({
	id: z.number(),
	dmm_id: z.number(),
	name: z.string(),
	ruby: z.string().nullable().optional(),
	bust: z.number().nullable().optional(),
	waist: z.number().nullable().optional(),
	hip: z.number().nullable().optional(),
	height: z.number().nullable().optional(),
	birthday: z.string().nullable().optional(),
	blood_type: z.string().nullable().optional(),
	hobby: z.string().nullable().optional(),
	prefectures: z.string().nullable().optional(),
	image_url_small: z.string().nullable().optional(),
	image_url_large: z.string().nullable().optional(),
	list_url: z.string().nullable().optional(),
	cup: z.string().nullable().optional()
})

// ActressSchemaから型を生成
type Actress = z.infer<typeof ActressSchema>

// APIエンドポイント
type ApiResponse = {
	actress: Actress
}

// 型ガード関数
function isValidApiResponse(data: unknown): data is ApiResponse {
	return typeof data === 'object' && data !== null && 'actress' in data
}

export async function GET(request: NextRequest, { params }: { params: { name: string } }): Promise<NextResponse> {
	const { name } = params
	const API_KEY = process.env.CLOUDFLARE_DMM_API_TOKEN
	const WORKER_URL = process.env.DMM_ACTRESS_RELATEDITEMS_WORKER_URL

	if (!API_KEY) {
		console.error('CLOUDFLARE_DMM_API_TOKENが設定されていません')
		return NextResponse.json({ error: 'CLOUDFLARE_DMM_API_TOKENが環境変数に設定されていません' }, { status: 500 })
	}

	try {
		const response = await fetch(`${WORKER_URL}/actress/${name}`, {
			headers: {
				'Content-Type': 'application/json',
				'X-API-Key': API_KEY
			},
			next: { revalidate: 2592000 } // 30日間キャッシュ
		})

		if (response.status === 404) {
			console.log(`Actress not found: ${name}`)
			return NextResponse.json({ error: '女優が見つかりません' }, { status: 404 })
		}

		if (!response.ok) {
			console.error(`Cloudflare Worker API error: ${response.status} ${response.statusText}`)
			throw new Error(`Cloudflare Workerからのデータ取得に失敗しました: ${response.status}`)
		}

		const data = (await response.json()) as unknown

		if (!isValidApiResponse(data)) {
			throw new Error('不正なレスポンス形式')
		}

		const validatedData = ActressSchema.parse(data.actress)
		return NextResponse.json({ actress: validatedData })
	} catch (error) {
		console.error('APIルートでエラーが発生しました:', error)
		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: 'データの形式が不正です', details: error.errors }, { status: 500 })
		}
		return NextResponse.json({ error: 'サーバー内部エラー', details: (error as Error).message }, { status: 500 })
	}
}
