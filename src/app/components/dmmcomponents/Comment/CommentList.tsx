import { getComments } from '@/app/actions/commentActions'
import { CommentComponent } from './Comment'

export async function CommentList({ itemId }: { itemId: number }) {
	try {
		const comments = await getComments(itemId)

		if (comments.length === 0) {
			return <p className="text-gray-500 text-center">まだコメントはありません。</p>
		}

		return (
			<div>
				{comments.map((comment) => (
					<CommentComponent key={comment.id} comment={comment} />
				))}
			</div>
		)
	} catch (error) {
		console.error('コメントリスト取得エラー:', error)
		return <p className="text-red-500 text-center">コメントの読み込み中にエラーが発生しました。</p>
	}
}
