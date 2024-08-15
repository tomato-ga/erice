import { z } from 'zod'

export const commentSchema = z.object({
	id: z.number().optional(),
	itemId: z.number(),
	userId: z.number().optional(),
	comment: z.string().min(1, 'コメントを入力してください').max(500, 'コメントは500文字以内で入力してください'),
	createdAt: z.string().optional()
})

export type Comment = z.infer<typeof commentSchema>
