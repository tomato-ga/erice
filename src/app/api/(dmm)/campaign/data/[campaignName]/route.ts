import { GetKVCampaignItemsResponseSchema } from '@/types/dmm-campaignpage-types'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: { campaignName: string } }) {
	const campaignName = params.campaignName
	const batchIndex = Number(req.nextUrl.searchParams.get('batch')) || 0

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
		// キャンペーン名のエンコード
		const encodedName = encodeURIComponent(campaignName)
		// console.log(`Fetching campaign data for: ${encodedName}, batch: ${batchIndex}`)

		const response = await fetch(`${WORKER_URL}/campaign/data/${encodedName}?batch=${batchIndex}`, {
			headers: {
				'X-API-Key': API_KEY,
			},
			cache: 'force-cache',
		})

		if (!response.ok) {
			if (response.status === 404) {
				console.log(`バッチ ${batchIndex} が見つかりませんでした`)
				return NextResponse.json({ error: 'バッチが見つかりません' }, { status: 404 })
			}
			console.error('キャンペーンデータの取得に失敗しました', response.statusText)
			return NextResponse.json({ error: 'キャンペーンデータの取得に失敗しました' }, { status: 500 })
		}

		const data = await response.json()

		// デバッグログを追加
		// console.log('APIから取得したデータ:', JSON.stringify(data, null, 2))

		// データのパース
		const parseResult = GetKVCampaignItemsResponseSchema.safeParse(data)
		if (!parseResult.success) {
			console.error('データのパースに失敗しました:', parseResult.error)
			return NextResponse.json({ error: 'データの形式が無効です' }, { status: 500 })
		}

		// パース結果のデバッグログ
		// console.log('パース後のデータ:', JSON.stringify(parseResult.data, null, 2))

		// Ensure the returned JSON is an array of DMMCampaignItem
		return NextResponse.json(parseResult.data, { status: 200 }) // Assuming parseResult.data has an items property which is an array of DMMCampaignItem. If not, adjust accordingly.
	} catch (error) {
		console.error(`Error in /api/campaign/data/${campaignName}:`, error)
		return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
	}
}
