'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { commentSchema, Comment } from '../../../types/comment'

export async function addComment(prevState: any, formData: FormData) {
	const validationResult = commentSchema.safeParse({
		itemId: formData.get('itemId'),
		comment: formData.get('comment')
	})

	if (!validationResult.success) {
		return { message: '', errors: validationResult.error.flatten().fieldErrors }
	}

	const { itemId, comment } = validationResult.data

	try {
		const response = await fetch('YOUR_WORKER_URL/comments', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				itemId: itemId,
				// userId: userId, // userIdがもしあれば
				comment: comment
			})
		})

		if (response.ok) {
			const data = await response.json()
			console.log('コメントが追加されました:', data)
			// ... 成功時の処理 ...
		} else {
			console.error('コメントの追加に失敗しました:', response.status)
			// ... 失敗時の処理 ...
		}
		// ここでデータベースにコメントを追加する処理を実装
		// 例: await db.insert(comments).values({ itemId, comment });

		revalidatePath(`/items/${itemId}`)
		return { message: 'コメントが投稿されました', errors: {} }
	} catch (error) {
		console.error('コメント投稿エラー:', error)
		return { message: '', errors: { server: ['コメントの投稿に失敗しました'] } }
	}
}

export async function getComments(itemId: number): Promise<Comment[]> {
	try {
		// ここでデータベースからコメントを取得する処理を実装
		// 例: const comments = await db.select().from(comments).where(eq(comments.itemId, itemId));

		// モックデータを返す（実際の実装では削除してください）
		return [
			{ id: 1, itemId, comment: 'テストコメント1', createdAt: new Date().toISOString() },
			{ id: 2, itemId, comment: 'テストコメント2', createdAt: new Date().toISOString() }
		]
	} catch (error) {
		console.error('コメント取得エラー:', error)
		throw new Error('コメントの取得に失敗しました')
	}
}

export async function deleteComment(id: number) {
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
