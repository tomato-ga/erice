// /Users/ore/Documents/GitHub/rice/erice/src/app/api/record-article/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const API_ENDPOINT = process.env.USER_ACTION_ARTICLE_WORKER_URL
const API_KEY = process.env.D1_API_KEY

// Zodスキーマの定義
const UserActionSchema = z.object({
	userId: z.string(),
	type: z.enum(['article_view', 'keyword_view', 'external_click']),
	data: z.union([
		z.object({
			article_id: z.number(),
			title: z.string(),
			site_name: z.string(),
			viewed_at: z.string()
		}),
		z.object({
			keyword_id: z.number(),
			keyword: z.string(),
			viewed_at: z.string()
		}),
		z.object({
			article_id: z.number(),
			link: z.string(),
			clicked_at: z.string()
		})
	])
})

const SyncDataSchema = z.object({
	userId: z.string(),
	actions: z.array(UserActionSchema)
})

export async function POST(request: NextRequest) {
	if (!API_ENDPOINT || !API_KEY) {
		console.error('サーバー設定エラー: API_ENDPOINTまたはAPI_KEYが設定されていません')
		return NextResponse.json({ error: 'サーバー設定エラー' }, { status: 500 })
	}

	try {
		const body = await request.json()
		console.log('Received request body:', JSON.stringify(body))

		// Zodを使用してリクエストデータを検証
		const { userId, actions } = SyncDataSchema.parse(body)

		console.log(`ユーザー ${userId} の ${actions.length} 件のアクションを記録します`)

		const response = await fetch(API_ENDPOINT, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-API-Key': API_KEY
			},
			body: JSON.stringify({ userId, actions })
		})

		if (!response.ok) {
			const errorText = await response.text()
			console.error('ワーカーでのユーザーアクション記録に失敗しました:', errorText)
			throw new Error(`ワーカーでのユーザーアクション記録に失敗しました: ${errorText}`)
		}

		const result = await response.json()
		console.log(`ユーザー ${userId} のアクションを正常に記録しました:`, result)
		return NextResponse.json(result)
	} catch (error) {
		if (error instanceof z.ZodError) {
			console.error('リクエストデータの検証に失敗しました:', error.errors)
			return NextResponse.json({ error: 'Invalid request data', details: error.errors }, { status: 400 })
		}
		console.error('ユーザーアクションの記録中にエラーが発生しました:', error)
		return NextResponse.json({ error: '内部サーバーエラー' }, { status: 500 })
	}
}
