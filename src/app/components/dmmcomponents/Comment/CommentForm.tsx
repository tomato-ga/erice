'use client'

import { useRef, useEffect } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { addComment } from '@/app/actions/commentActions'

function SubmitButton() {
	const { pending } = useFormStatus()

	return (
		<button
			type="submit"
			disabled={pending}
			className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline disabled:opacity-50 transition duration-150 ease-in-out"
			aria-disabled={pending}
		>
			{pending ? '送信中...' : 'コメントを投稿'}
		</button>
	)
}

export function CommentForm({ itemId }: { itemId: number }) {
	const [state, formAction] = useFormState(addComment, null)
	const formRef = useRef<HTMLFormElement>(null)

	useEffect(() => {
		if (state?.success) {
			formRef.current?.reset()
		}
	}, [state])

	return (
		<form ref={formRef} action={formAction} className="mb-8">
			<input type="hidden" name="itemId" value={itemId} />
			<div className="mb-4">
				<label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
					コメント
				</label>
				<textarea
					id="comment"
					name="comment"
					className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
					rows={4}
					placeholder="コメントを入力してください"
					aria-invalid={state?.errors?.comment ? 'true' : 'false'}
					aria-describedby="comment-error"
					required
				/>
				{state?.errors?.comment && (
					<p id="comment-error" role="alert" className="mt-2 text-sm text-red-600">
						{state.errors.comment}
					</p>
				)}
			</div>
			<SubmitButton />
			{state?.message && (
				<p className={`mt-2 text-sm ${state.success ? 'text-green-600' : 'text-red-600'}`} role="status">
					{state.message}
				</p>
			)}
		</form>
	)
}
