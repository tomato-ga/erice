'use client'

import { useState, useEffect } from 'react'
import { getComments } from '@/app/actions/commentActions'
import { CommentComponent } from './Comment'
import { Comment } from '@/types/comment'

interface CommentListProps {
	contentId: string
	onCommentAdded: (newComment: Comment) => void
	newComment: Comment | null // 新しいプロパティ
}

export function CommentList({ contentId, onCommentAdded, newComment }: CommentListProps) {
	const [comments, setComments] = useState<Comment[]>([])
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		async function fetchComments() {
			try {
				const fetchedComments = await getComments(contentId)
				setComments(fetchedComments)
			} catch (error) {
				console.error('コメントリスト取得エラー:', error)
				setError('コメントの読み込み中にエラーが発生しました。')
			}
		}

		fetchComments()
	}, [contentId])

	useEffect(() => {
		// 新しいコメントが追加されたときにリストを更新
		if (newComment) {
			setComments((prevComments) => [newComment, ...prevComments])
			onCommentAdded(newComment)
		}
	}, [newComment, onCommentAdded])

	if (error) {
		return <p className="text-red-500 text-center">{error}</p>
	}

	if (comments.length === 0) {
		return null
	}

	return (
		<div>
			{comments.map((comment, index) => (
				<CommentComponent key={index} comment={comment} contentId={contentId} />
			))}
		</div>
	)
}
