// /src/app/api/doujin-get-top-rank-items/route.ts

import { DoujinKVApiResponse, DoujinKVApiResponseSchema } from '@/_types_doujin/doujintypes'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export async function GET(request: NextRequest) {
	try {
		const apiKey = process.env.CLOUDFLARE_DMM_API_TOKEN_DOUJIN
		const WORKER_URL = process.env.FANZA_DOUJIN_TOPPAGE_WORKER_URL

		if (!apiKey || !WORKER_URL) {
			console.error('Missing API_KEY or WORKER_URL')
			return NextResponse.json({ error: 'Configuration error' }, { status: 500 })
		}

		const response = await fetch(`${WORKER_URL}?key=todaynew`, {
			headers: {
				'X-API-Key': apiKey,
				'Content-Type': 'application/json',
			},
		})

		if (!response.ok) {
			console.error(`Worker API responded with status: ${response.status}`)
			return NextResponse.json(
				{ error: `Worker error: ${response.status}` },
				{ status: response.status },
			)
		}

		const rawData = await response.json()
		console.log('Raw data from Worker:', rawData.kvDatas?.[0], rawData.kvDatas?.[1])

		// スキーマ検証と変換
		const validatedData = DoujinKVApiResponseSchema.safeParse(rawData)

		if (!validatedData.success) {
			console.error('Validation error:', validatedData.error)
			return NextResponse.json({ error: validatedData.error.errors }, { status: 400 })
		}

		// 正常なデータを返す
		return NextResponse.json(validatedData.data)
	} catch (error: unknown) {
		console.error('Unexpected error:', error)
		return NextResponse.json(
			{
				error: 'Internal Server Error',
				details: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		)
	}
}
