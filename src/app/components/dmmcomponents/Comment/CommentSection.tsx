import { Suspense } from 'react'
import { CommentForm } from './CommentForm'
import { CommentList } from './CommentList'

export function CommentSection({ itemId }: { itemId: number }) {
	return (
		<div className="max-w-2xl mx-auto p-4">
			<h2 className="text-2xl font-bold mb-4">コメント</h2>
			<CommentForm itemId={itemId} />
			<Suspense fallback={<div>コメントを読み込み中...</div>}>
				<CommentList itemId={itemId} />
			</Suspense>
		</div>
	)
}
