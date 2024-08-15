'use client'

import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { addComment } from '@/app/actions/commentActions'

interface FormData {
	itemId: number
	comment: string
}

function SubmitButton() {
	return (
		<button
			type="submit"
			className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline disabled:opacity-50 transition duration-150 ease-in-out"
		>
			コメントを投稿
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
	const [serverError, setServerError] = useState<string | null>(null)
	const [successMessage, setSuccessMessage] = useState<string | null>(null)

	const onSubmit = async (data: FormData) => {
		const formData = new FormData()
		formData.append('itemId', data.itemId.toString())
		formData.append('comment', data.comment)

		try {
			const result = await addComment({}, formData)
			if (result.message) {
				setSuccessMessage(result.message)
				setServerError(null)
				reset()
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
			<input type="hidden" {...register('itemId')} value={itemId} />

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
