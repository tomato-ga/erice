// src/app/api/actress-profile-page/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { ActressProfileAndWorks } from '../../../../types/APItypes'
import {
	ActressProfileAndWorksSchema,
	DMMActressProfileSchema,
	DMMActressProfilePageItemSchema,
	DMMActressProfile
} from '@/types/APItypes'

export async function GET(request: NextRequest): Promise<NextResponse> {
	const API_KEY = process.env.CLOUDFLARE_DMM_API_TOKEN
	const WORKER_URL = process.env.DMM_ACTRESS_PROFILE_AND_WORKS_WORKER_URL
	// デバッグ用のログを追加
	// console.log('API_KEY:', API_KEY)
	// console.log('WORKER_URL:', WORKER_URL)

	const { searchParams } = new URL(request.url)
	const actressname = searchParams.get('actressname')

	if (!actressname) {
		return NextResponse.json({ error: 'actressnameパラメータが必要です' }, { status: 400 })
	}

	if (!API_KEY || !WORKER_URL) {
		console.error('必要な環境変数が設定されていません')
		console.error('API_KEY:', API_KEY)
		console.error('WORKER_URL:', WORKER_URL)
		return NextResponse.json({ error: '必要な環境変数が設定されていません' }, { status: 500 })
	}

	const encodedActressName = encodeURIComponent(actressname)

	try {
		const response = await fetch(`${WORKER_URL}/${encodedActressName}`, {
			headers: {
				'Content-Type': 'application/json',
				'X-API-Key': API_KEY
			}
		})

		if (response.status === 404) {
			console.log(`女優が見つかりません: ${actressname}`)
			return NextResponse.json({ error: '女優が見つかりません' }, { status: 404 })
		}

		if (!response.ok) {
			console.error(`Cloudflare Worker APIエラー: ${response.status} ${response.statusText}`)
			throw new Error(`Cloudflare Workerからのデータ取得に失敗しました: ${response.status}`)
		}

		const rawData = (await response.json()) as ActressProfileAndWorks

		// Cloudflare Workerから返されるデータ構造に合わせて、必要に応じて変換
		const transformedData = {
			profile: {
				actress: rawData.profile // DMMActressProfileSchemaは'actress'オブジェクトを期待しているため
			},
			works: rawData.works.map((work) => ({
				id: work.id,
				content_id: work.content_id,
				imageURL: work.imageURL,
				title: work.title,
				release_date: work.release_date
			}))
		}

		const validatedData = ActressProfileAndWorksSchema.parse(transformedData)
		// console.log('API response validatedData', validatedData.profile.actress)

		return NextResponse.json(validatedData)
	} catch (error) {
		console.error('APIルートでエラーが発生しました:', error)
		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: 'データの形式が不正です', details: error.errors }, { status: 500 })
		}
		return NextResponse.json({ error: 'サーバー内部エラー', details: (error as Error).message }, { status: 500 })
	}
}
