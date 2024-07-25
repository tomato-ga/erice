import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'

const TagCloud = dynamic(() => import('../components/SidebarTags'), {
	loading: () => <p>読み込み中...</p>,
	ssr: true // サーバーサイドレンダリングを有効にする
})

const Sidebar = () => {
	return (
		<aside className="w-full md:w-64 lg:w-80 flex-shrink-0 bg-white border-b md:border-r md:border-b-0 p-4 md:p-6 mt-2">
			<div className="sticky top-4">
				<Suspense fallback={<p>読み込み中...</p>}>
					<TagCloud />
				</Suspense>
			</div>
		</aside>
	)
}

export default Sidebar
