'use client'

import { Comment } from '@/types/comment'
import React, { Suspense, useCallback, useState } from 'react'
import { CommentForm } from './CommentForm'
import { CommentList } from './CommentList'

import { useInView } from 'react-intersection-observer'

export function CommentSection({ contentId }: { contentId: string }) {
	const { ref, inView } = useInView({
		triggerOnce: true,
		threshold: 0.3,
	})

	const [comments, setComments] = useState<Comment[]>([])
	const [latestComment, setLatestComment] = useState<Comment | null>(null)

	const handleCommentAdded = useCallback((newComment: Comment) => {
		setComments(prevComments => [newComment, ...prevComments])
		setLatestComment(newComment)
	}, [])

	return (
		<section className='bg-gradient-to-br from-pink-100 to-orange-50 dark:from-yellow-900 dark:to-orange-900 rounded-xl shadow-lg p-6 my-8 transform'>
			<h2 className='text-3xl font-extrabold mb-4 text-center bg-gradient-to-r from-pink-500 to-orange-600 text-transparent bg-clip-text'>
				<span className='block'>見所シーンを共有しよう</span>
			</h2>
			<p className='text-gray-700 dark:text-gray-300 text-center mb-6'>
				動画のどんなシーンが印象的だったか、どんなシーンが抜きポイントだったか、ぜひ教えてください
			</p>
			<div className='space-y-6 animate-fade-in-up'>
				<div ref={ref}>
					{inView && <CommentForm contentId={contentId} onCommentAdded={handleCommentAdded} />}

					{inView && (
						<CommentList
							contentId={contentId}
							onCommentAdded={handleCommentAdded}
							newComment={latestComment}
						/>
					)}
				</div>
			</div>
		</section>
	)
}

export default React.memo(CommentSection)
