import { NextRequest, NextResponse } from 'next/server'
import { AllContentResponse, NewActressResponse, ActressType } from '../../../../../types/dmmtypes'

const API_KEY = process.env.CLOUDFLARE_DMM_API_TOKEN
const WORKER_URL = process.env.DMM_ACTRESS_WORKER_URL

async function fetchFromWorker(endpoint: string): Promise<NewActressResponse | AllContentResponse> {
	if (!API_KEY || !WORKER_URL) {
		throw new Error('必要な環境変数が設定されていません')
	}

	const response = await fetch(`${WORKER_URL}${endpoint}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'X-API-Key': API_KEY
		},
		cache: 'force-cache'
	})

	if (!response.ok) {
		throw new Error(`Cloudflare Workerからのデータ取得に失敗しました: ${response.status}`)
	}

	return response.json()
}

export async function GET(request: NextRequest): Promise<NextResponse> {
	try {
		const { searchParams } = new URL(request.url)
		const type = searchParams.get('type') as ActressType | null

		let data: NewActressResponse | AllContentResponse

		switch (type) {
			case 'new':
				data = (await fetchFromWorker('/new-actress')) as NewActressResponse
				break
			case 'popular':
				data = (await fetchFromWorker('/popular-actress')) as NewActressResponse
				break
			case 'all':
				data = (await fetchFromWorker('/all-content')) as AllContentResponse
				break
			default:
				return NextResponse.json({ error: '無効なタイプパラメータです' }, { status: 400 })
		}

		return NextResponse.json(data)
	} catch (error) {
		console.error('APIルートでエラーが発生しました:', error)
		return NextResponse.json({ error: 'サーバー内部エラー', details: (error as Error).message }, { status: 500 })
	}
}
