'use client'

import { useRef } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { addComment } from '@/app/actions/commentActions' // Server Actionをimport

// フォームデータのインターフェース定義
interface FormData {
	itemId: number
	comment: string
}

function SubmitButton() {
	const {
		formState: { isSubmitting }
	} = useForm()

	return (
		<button
			type="submit"
			disabled={isSubmitting}
			className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline disabled:opacity-50 transition duration-150 ease-in-out"
			aria-disabled={isSubmitting}
		>
			{isSubmitting ? '送信中...' : 'コメントを投稿'}
		</button>
	)
}

export function CommentForm({ itemId }: { itemId: number }) {
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset
	} = useForm<FormData>()
	const formRef = useRef<HTMLFormElement>(null)

	const onSubmit = async (data: FormData) => {
		console.log('送信データ:', data)

		try {
			const result = await addComment(data)

			console.log('addCommentの結果:', result)

			if (result.success) {
				console.log('フォームをリセットします')
				reset()
			} else {
				console.error('コメントの投稿に失敗しました:', result.message)
			}
		} catch (error) {
			console.error('コメントの投稿中にエラーが発生しました:', error)
		}
	}

	return (
		<form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="mb-8">
			<input type="hidden" {...register('itemId', { value: itemId })} />

			<div className="mb-4">
				<label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
					コメント
				</label>
				<textarea
					id="comment"
					{...register('comment', { required: 'コメントは必須です' })}
					className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
					rows={4}
					placeholder="コメントを入力してください"
					aria-invalid={errors.comment ? 'true' : 'false'}
					aria-describedby="comment-error"
				/>
				{errors.comment && (
					<p id="comment-error" role="alert" className="mt-2 text-sm text-red-600">
						{errors.comment.message}
					</p>
				)}
			</div>
			<SubmitButton />
		</form>
	)
}
