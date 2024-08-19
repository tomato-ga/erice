'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { commentSchema, Comment } from '@/types/comment'

// コメントスキーマの更新
const updatedCommentSchema = z.object({
	contentId: z.string(),
	comment: z.string().min(1).max(1000)
})

export async function addComment(prevState: any, formData: FormData) {
	console.log('addComment関数が呼び出されました')
	const WORKER_URL = process.env.ITEM_COMMENT_WORKER_URL
	const API_KEY = process.env.CLOUDFLARE_DMM_API_TOKEN

	console.log('環境変数の確認:', { WORKER_URL, API_KEY: API_KEY ? '設定済み' : '未設定' })

	if (!API_KEY || !WORKER_URL) {
		console.error('API KEYまたはWORKER URLが設定されていません')
		throw new Error('API KEY and WORKER URL is not defined')
	}

	console.log('フォームデータ:', Object.fromEntries(formData))

	const validationResult = updatedCommentSchema.safeParse({
		contentId: formData.get('contentId'),
		comment: formData.get('comment')
	})

	console.log('バリデーション結果:', validationResult)

	if (!validationResult.success) {
		console.error('バリデーションエラー:', validationResult.error)
		return { message: '', errors: validationResult.error.flatten().fieldErrors }
	}

	const { contentId, comment } = validationResult.data

	try {
		console.log('Workerへのリクエスト準備:', {
			url: `${WORKER_URL}/comments`,
			method: 'POST',
			headers: { 'Content-Type': 'application/json', 'X-API-KEY': '***' },
			body: { contentId, comment }
		})

		const response = await fetch(`${WORKER_URL}/comments`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-API-KEY': API_KEY
			},
			body: JSON.stringify({
				contentId: contentId,
				comment: comment
			})
		})

		console.log('Workerからのレスポンス:', { status: response.status, ok: response.ok })

		if (response.ok) {
			const data = await response.json()
			console.log('コメントが追加されました:', data)
			revalidatePath(`/item/${contentId}`)
			return { message: 'コメントが投稿されました', errors: {} }
		} else {
			const errorText = await response.text()
			console.error('コメントの追加に失敗しました:', response.status, errorText)
			return { message: '', errors: { server: [`コメント投稿に失敗しました: ${response.status} ${errorText}`] } }
		}
	} catch (error) {
		console.error('コメント投稿エラー:', error)
		return { message: '', errors: { server: ['コメント投稿中に予期せぬエラーが発生しました'] } }
	}
}

export async function getComments(contentId: string): Promise<Comment[]> {
	console.log('getComments関数が呼び出されました')
	const WORKER_URL = process.env.ITEM_COMMENT_WORKER_URL
	const API_KEY = process.env.CLOUDFLARE_DMM_API_TOKEN

	console.log('環境変数の確認:', { WORKER_URL, API_KEY: API_KEY ? '設定済み' : '未設定' })

	if (!API_KEY || !WORKER_URL) {
		console.error('API KEYまたはWORKER URLが設定されていません')
		throw new Error('API KEY and WORKER URL is not defined')
	}

	try {
		const url = new URL(`${WORKER_URL}/comments`)
		url.searchParams.append('contentId', contentId)

		console.log('Workerへのリクエスト準備:', {
			url: url.toString(),
			method: 'GET',
			headers: { 'Content-Type': 'application/json', 'X-API-KEY': '***' }
		})

		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'X-API-KEY': API_KEY
			}
		})

		console.log('Workerからのレスポンス:', { status: response.status, ok: response.ok })

		if (response.ok) {
			const data = await response.json()
			console.log('コメントが取得されました:', data)
			return data as Comment[]
		} else {
			const errorText = await response.text()
			console.error('コメントの取得に失敗しました:', response.status, errorText)
			throw new Error(`コメントの取得に失敗しました: ${response.status} ${errorText}`)
		}
	} catch (error) {
		console.error('コメント取得エラー:', error)
		throw new Error('コメントの取得に失敗しました')
	}
}

export async function deleteComment(id: string) {
	try {
		// ここでデータベースからコメントを削除する処理を実装
		// 例: await db.delete(comments).where(eq(comments.id, id));

		revalidatePath('/items/[itemId]', 'layout')
		return { success: true, message: 'コメントが削除されました' }
	} catch (error) {
		console.error('コメント削除エラー:', error)
		return { success: false, message: 'コメントの削除に失敗しました' }
	}
}
