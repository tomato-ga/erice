'use client'

import { Suspense, useState, useCallback } from 'react'
import { CommentForm } from './CommentForm'
import { CommentList } from './CommentList'
import { Comment } from '@/types/comment'

export function CommentSection({ contentId }: { contentId: string }) {
	const [comments, setComments] = useState<Comment[]>([])
	const [latestComment, setLatestComment] = useState<Comment | null>(null)

	const handleCommentAdded = useCallback((newComment: Comment) => {
		setComments((prevComments) => [newComment, ...prevComments])
		setLatestComment(newComment)
	}, [])

	return (
		<section className="bg-gradient-to-br from-pink-100 to-orange-50 dark:from-yellow-900 dark:to-orange-900 rounded-xl shadow-lg p-6 my-8 transform">
			<h2 className="text-3xl font-extrabold mb-4 text-center bg-gradient-to-r from-pink-500 to-orange-600 text-transparent bg-clip-text">
				<span className="block">ヌケたシーンを</span>
				<span className="block">みんなで共有しよう</span>
			</h2>
			<p className="text-gray-700 dark:text-gray-300 text-center mb-6">
				動画のどんなシーンが印象的だったか、どんなシーンが抜きポイントだったか、ぜひ教えてください
			</p>
			<div className="space-y-6 animate-fade-in-up">
				<CommentForm contentId={contentId} onCommentAdded={handleCommentAdded} />
				<Suspense
					fallback={
						<div className="flex justify-center items-center h-24">
							<div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
							<span className="ml-2 text-gray-600 dark:text-gray-300">コメントを読み込み中...</span>
						</div>
					}
				>
					<CommentList contentId={contentId} onCommentAdded={handleCommentAdded} newComment={latestComment} />
				</Suspense>
			</div>
		</section>
	)
}
