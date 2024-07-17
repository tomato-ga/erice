// pages/api/record-user-actions.ts

import { NextApiRequest, NextApiResponse } from 'next'
import { SyncData, UserAction } from '../../../../types/types'

const API_ENDPOINT = process.env.USER_ACTION_WORKER_URL
const API_KEY = process.env.D1_API_KEY

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method Not Allowed' })
	}

	if (!API_ENDPOINT || !API_KEY) {
		console.error('サーバー設定エラー: API_ENDPOINTまたはAPI_KEYが設定されていません')
		return res.status(500).json({ error: 'サーバー設定エラー' })
	}

	try {
		const { userId, actions } = req.body as SyncData

		if (!userId || !actions || !Array.isArray(actions)) {
			console.error('不正なリクエスト:', { userId, actions })
			return res.status(400).json({ error: '不正なリクエスト' })
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
		res.status(200).json({ status: 'OK' })
	} catch (error) {
		console.error('ユーザーアクションの記録中にエラーが発生しました:', error)
		res.status(500).json({ error: '内部サーバーエラー' })
	}
}
