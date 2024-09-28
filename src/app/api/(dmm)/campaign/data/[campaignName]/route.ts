// src/app/api/(dmm)/campaign/data/[campaignName]/route.ts

import { DMMItemSchema, GetKVCampaignItemsResponseSchema } from '@/types/dmm-campaignpage-types'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: { campaignName: string } }) {
	const campaignName = params.campaignName

	const WORKER_URL = process.env.DMM_CAMPAIGN_WORKER_URL
	const API_KEY = process.env.CLOUDFLARE_DMM_API_TOKEN

	// 環境変数の存在確認
	if (!WORKER_URL) {
		console.error('DMM_CAMPAIGN_WORKER_URLが設定されていません')
		return NextResponse.json(
			{ error: 'DMM_CAMPAIGN_WORKER_URLが環境変数に設定されていません' },
			{ status: 500 },
		)
	}

	if (!API_KEY) {
		console.error('CLOUDFLARE_DMM_API_TOKENが設定されていません')
		return NextResponse.json(
			{ error: 'CLOUDFLARE_DMM_API_TOKENが環境変数に設定されていません' },
			{ status: 500 },
		)
	}

	// campaignName の存在確認
	if (!campaignName) {
		return NextResponse.json({ error: 'キャンペーン名が必要です' }, { status: 400 })
	}

	try {
		// キャンペーン名のエンコード（必要に応じて）
		const encodedName = encodeURIComponent(campaignName)
		console.log(`Fetching campaign data for: ${encodedName}`)

		const response = await fetch(`${WORKER_URL}/campaign/data/${encodedName}`, {
			headers: {
				'X-API-Key': API_KEY,
			},
			cache: 'no-store',
		})

		if (!response.ok) {
			if (response.status === 404) {
				return NextResponse.json({ error: 'キャンペーンが見つかりません' }, { status: 404 })
			}
			return NextResponse.json({ error: 'キャンペーンデータの取得に失敗しました' }, { status: 500 })
		}

		const data = await response.json()

		// Zodスキーマに合わせてバリデーション
		const parseResult = GetKVCampaignItemsResponseSchema.safeParse(data)

		if (!parseResult.success) {
			console.error('データの形式が無効です:', parseResult.error)
			return NextResponse.json({ error: 'データの形式が無効です' }, { status: 500 })
		}

		return NextResponse.json(parseResult.data)
	} catch (error) {
		console.error(`Error in /api/campaign/data/${campaignName}:`, error)
		return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
	}
}
