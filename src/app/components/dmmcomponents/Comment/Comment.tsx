'use client'

import { deleteComment } from '@/app/actions/commentActions'
import { Comment } from '@/types/comment'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface CommentProps {
	comment: Comment
	contentId: string
}

export function CommentComponent({ comment, contentId }: CommentProps) {
	const [isDeleting, setIsDeleting] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const router = useRouter()

	const handleDelete = async () => {
		if (window.confirm('本当にこのコメントを削除しますか？')) {
			setIsDeleting(true)
			setError(null)
			try {
				const result = await deleteComment(contentId!)
				if (result.success) {
					router.refresh()
				} else {
					setError(result.message)
				}
			} catch (error) {
				console.error('コメントの削除に失敗しました:', error)
				setError('コメントの削除に失敗しました。')
			} finally {
				setIsDeleting(false)
			}
		}
	}

	return (
		<div className='bg-white shadow-md rounded-lg p-4 mb-4'>
			<p className='text-gray-800 mb-2'>{comment.comment}</p>
			<div className='flex justify-between items-center text-sm text-gray-500'>
				<span>{new Date(comment.createdAt!).toLocaleString()}</span>
				{/* MEMO 削除ボタン除外 <button
					onClick={handleDelete}
					disabled={isDeleting}
					className="text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded disabled:opacity-50"
					aria-label="コメントを削除"
				>
					{isDeleting ? '削除中...' : '削除'}
				</button> */}
			</div>
			{error && <p className='mt-2 text-sm text-red-600'>{error}</p>}
		</div>
	)
}
