'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { commentSchema, Comment } from '../../../types/comment'

export async function addComment(data: { itemId: number; comment: string }) {
	const validationResult = commentSchema.safeParse(data)

	if (!validationResult.success) {
		return {
			success: false,
			errors: validationResult.error.flatten().fieldErrors
		}
	}

	const validatedData = validationResult.data

	try {
		// ここでデータベースにコメントを追加する処理を実装
		// 例: await db.insert(comments).values(validatedData);

		revalidatePath(`/items/${validatedData.itemId}`)
		return { success: true, message: 'コメントが投稿されました' }
	} catch (error) {
		console.error('コメント投稿エラー:', error)
		return { success: false, message: 'コメントの投稿に失敗しました' }
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
