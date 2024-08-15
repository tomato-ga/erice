import Link from 'next/link'
import DMMItemContainer from './components/dmmcomponents/DMMItemContainer'
import DMMActressItemContainer from './components/dmmcomponents/DMMActressItemContainer'

export default function NotFound() {
	return (
		<div className="min-h-screen bg-gray-100">
			<div className="flex flex-col items-center justify-center pt-20 pb-10">
				<h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
				<h2 className="text-2xl font-semibold text-gray-600 mb-8">ページが見つかりません</h2>
				<p className="text-gray-500 mb-8">
					申し訳ありませんが、お探しのページは存在しないか、移動した可能性があります。
				</p>
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
					代わりにこちらのコンテンツがおすすめです
				</h3>
				<DMMItemContainer itemType="feature" from="top" bgGradient="bg-gradient-to-r from-pink-50 to-purple-50" />
				<DMMItemContainer itemType="todaynew" from="top" bgGradient="bg-gradient-to-r from-green-50 to-blue-50" />
				<DMMItemContainer itemType="debut" from="top" bgGradient="bg-gradient-to-r from-yellow-50 to-red-50" />
				<DMMItemContainer itemType="sale" from="top" bgGradient="bg-gradient-to-r from-blue-50 to-purple-50" />

				{/* 女優セクション */}
				<DMMActressItemContainer actressType="new" from="top" />
				<DMMActressItemContainer actressType="popular" from="top" />
			</div>
		</div>
	)
}
