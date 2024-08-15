import Link from 'next/link'

export default function NotFound() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
			<h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
			<h2 className="text-2xl font-semibold text-gray-600 mb-8">ページが見つかりません</h2>
			<p className="text-gray-500 mb-8">申し訳ありませんが、お探しのページは存在しないか、移動した可能性があります。</p>
			<Link href="/" className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300">
				ホームに戻る
			</Link>
		</div>
	)
}
