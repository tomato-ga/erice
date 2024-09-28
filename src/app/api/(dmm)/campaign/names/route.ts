// src/app/api/(dmm)/campaign/names/route.ts
import { GetKVCampaignNamesResponseSchema } from '@/types/dmm-campaignpage-types'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
	const WORKER_URL = process.env.DMM_CAMPAIGN_WORKER_URL
	const API_KEY = process.env.CLOUDFLARE_DMM_API_TOKEN

	if (!WORKER_URL) {
		console.error('CAMPAIGN_WORKER_URLが設定されていません')
		return NextResponse.json(
			{ error: 'CAMPAIGN_WORKER_URLが環境変数に設定されていません' },
			{ status: 500 },
		)
	}

	if (!API_KEY) {
		console.error('CLOUDFLARE_API_KEYが設定されていません')
		return NextResponse.json(
			{ error: 'CLOUDFLARE_API_KEYが環境変数に設定されていません' },
			{ status: 500 },
		)
	}

	try {
		const response = await fetch(`${WORKER_URL}/campaign/names`, {
			headers: {
				'X-API-Key': API_KEY,
			},
			next: {
				revalidate: 60 * 60 * 24, // 1日
			},
		})
		if (!response.ok) {
			return NextResponse.json({ error: 'Failed to fetch campaign names' }, { status: 500 })
		}
		const data = await response.json()
		const parseResult = GetKVCampaignNamesResponseSchema.safeParse(data)
		if (!parseResult.success) {
			return NextResponse.json({ error: 'Invalid data format' }, { status: 500 })
		}
		return NextResponse.json(parseResult.data)
	} catch (error) {
		console.error('Error in /api/campaign/names:', error)
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
	}
}
