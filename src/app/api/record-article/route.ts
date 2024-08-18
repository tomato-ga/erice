// src/app/api/record-user-actions/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { SyncData } from '@/types/types'

const API_ENDPOINT = process.env.USER_ACTION_WORKER_URL
const API_KEY = process.env.D1_API_KEY

export async function POST(request: NextRequest) {
	if (!API_ENDPOINT || !API_KEY) {
		console.error('サーバー設定エラー: API_ENDPOINTまたはAPI_KEYが設定されていません')
		return NextResponse.json({ error: 'サーバー設定エラー' }, { status: 500 })
	}

	try {
		const { userId, actions } = (await request.json()) as SyncData

		if (!userId || !actions || !Array.isArray(actions)) {
			console.error('不正なリクエスト:', { userId, actions })
			return NextResponse.json({ error: '不正なリクエスト' }, { status: 400 })
		}

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
			throw new Error('ワーカーでのユーザーアクション記録に失敗しました')
		}

		console.log(`ユーザー ${userId} のアクションを正常に記録しました`)
		return NextResponse.json({ status: 'OK' })
	} catch (error) {
		console.error('ユーザーアクションの記録中にエラーが発生しました:', error)
		return NextResponse.json({ error: '内部サーバーエラー' }, { status: 500 })
	}
}
