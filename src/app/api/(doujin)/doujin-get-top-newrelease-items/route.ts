import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { DoujinTopApiResponse, DoujinTopApiResponseSchema } from '@/_types_doujin/doujintypes'

export async function GET(request: NextRequest) {
	try {
		// 環境変数から API_KEY を取得
		const apiKey = process.env.CLOUDFLARE_DMM_API_TOKEN_DOUJIN

		if (!apiKey) {
			throw new Error('API_KEY is not defined in environment variables')
		}

		// Workers エンドポイント
		const WORKER_URL = process.env.FANZA_DOUJIN_TOPPAGE_WORKER_URL

		if (!WORKER_URL) {
			throw new Error('WORKER_URL is not defined in environment variables')
		}

		const fetchUrl = `${WORKER_URL}?key=fanza-doujin-new-releases`

		// Cloudflare Workers にリクエストを送信
		const response = await fetch(fetchUrl, {
			headers: {
				'X-API-Key': apiKey,
				'Content-Type': 'application/json'
			}
		})

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}

		const rawData: DoujinTopApiResponse = await response.json()

		// スキーマを使用してデータを検証
		const validatedData = DoujinTopApiResponseSchema.safeParse(rawData)

		if (!validatedData.success) {
			console.error('Validation error:', validatedData.error)
			return NextResponse.json({ error: validatedData.error.errors }, { status: 400 })
		}

		return NextResponse.json(validatedData.data)
	} catch (error) {
		console.error('Error:', error)
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
	}
}
