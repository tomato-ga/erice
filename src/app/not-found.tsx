import Link from 'next/link'
import DMMActressItemContainer from './components/dmmcomponents/DMMActressItemContainer'
import DMMItemContainer from './components/dmmcomponents/DMMItemContainer'

export default function NotFound() {
	return (
		<div className='min-h-screen bg-gray-100'>
			<div className='flex flex-col items-center justify-center pt-20 pb-10'>
				<h1 className='text-6xl font-bold text-gray-800 mb-4'>404</h1>
				<h2 className='text-2xl font-semibold text-gray-600 mb-8'>ページが見つかりません</h2>
				<p className='text-gray-500 mb-8'>
					申し訳ありませんが、お探しのページは存在しないか、移動した可能性があります。
				</p>
			</div>

			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<h3 className='text-2xl font-semibold text-gray-800 mb-6 text-center'>
					代わりにこちらのコンテンツがおすすめです
				</h3>
				<DMMItemContainer
					itemType='feature'
					from='top'
					bgGradient='bg-gradient-to-r from-pink-50 to-purple-50'
					title='注目作品'
					textGradient='from-pink-500 to-purple-500'
					umamifrom='notfound-feature'
				/>
				<DMMItemContainer
					itemType='todaynew'
					from='top'
					bgGradient='bg-gradient-to-r from-green-50 to-blue-50'
					title='今日配信の新作'
					textGradient='from-green-500 to-blue-500'
					umamifrom='notfound-todaynew'
				/>
				<DMMItemContainer
					itemType='debut'
					from='top'
					bgGradient='bg-gradient-to-r from-yellow-50 to-red-50'
					title='デビュー作品'
					textGradient='from-yellow-500 to-red-500'
					umamifrom='notfound-debut'
				/>
				<DMMItemContainer
					itemType='sale'
					from='top'
					bgGradient='bg-gradient-to-r from-blue-50 to-purple-50'
					title='限定セール'
					textGradient='from-blue-500 to-purple-500'
					umamifrom='notfound-sale'
				/>
			</div>
		</div>
	)
}
