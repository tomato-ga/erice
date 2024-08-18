'use client'

import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { addComment } from '@/app/actions/commentActions'
import { Comment } from '@/types/comment'

interface FormData {
	contentId: number
	comment: string
}

interface CommentFormProps {
	contentId: string // string から number に変更
	onCommentAdded: (newComment: Comment) => void
}

function SubmitButton() {
	return (
		<button
			type="submit"
			className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline disabled:opacity-50 transition duration-150 ease-in-out"
		>
			コメントを投稿する
		</button>
	)
}

export function CommentForm({ contentId, onCommentAdded }: CommentFormProps) {
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset
	} = useForm<FormData>()
	const formRef = useRef<HTMLFormElement>(null)
	const [serverError, setServerError] = useState<string | null>(null)
	const [successMessage, setSuccessMessage] = useState<string | null>(null)

	const onSubmit = async (data: FormData) => {
		const formData = new FormData()
		formData.append('contentId', data.contentId.toString())
		formData.append('comment', data.comment)

		try {
			const result = await addComment({}, formData)
			if (result.message) {
				setSuccessMessage(result.message)
				setServerError(null)
				reset()
				// result.newComment が存在しない場合、新しいコメントオブジェクトを作成
				const newComment: Comment = {
					contentId: contentId, // parseInt を削除
					comment: data.comment,
					createdAt: new Date().toISOString()
					// その他の必要なプロパティを追加
				}
				onCommentAdded(newComment)
			} else if (result.errors) {
				setServerError('コメントの投稿に失敗しました')
				setSuccessMessage(null)
			}
		} catch (error) {
			setServerError('エラーが発生しました')
			setSuccessMessage(null)
		}
	}

	return (
		<form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="mb-8">
			<input type="hidden" {...register('contentId')} value={contentId} />

			<div className="mb-4">
				<textarea
					id="comment"
					{...register('comment', { required: 'コメントは必須です' })}
					className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
					rows={4}
					placeholder="動画のどんなシーンが印象的だったか、どんなシーンが抜きポイントだったか、ぜひ教えてください"
					aria-invalid={errors.comment ? 'true' : 'false'}
				/>
				{errors.comment && (
					<p role="alert" className="mt-2 text-sm text-red-600">
						{errors.comment.message}
					</p>
				)}
			</div>
			{serverError && <p className="text-red-600 mb-4">{serverError}</p>}
			{successMessage && <p className="text-green-600 mb-4">{successMessage}</p>}
			<SubmitButton />
		</form>
	)
}
