// import React, { Suspense } from 'react'
// import dynamic from 'next/dynamic'

// const ClientRirekiComp = dynamic(() => import('./Clientrireki'), { ssr: false })

// export default function RirekiArticlesPage() {
// 	return (
// 		<div className="container mx-auto px-4 py-8">
// 			<h1 className="pb-2 text-3xl font-bold text-center pt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
// 				最近見た動画
// 			</h1>
// 			<Suspense fallback={<div>読み込み中...</div>}>
// 				<ClientRirekiComp />
// 			</Suspense>
// 		</div>
// 	)
// }
