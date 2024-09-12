import dynamic from 'next/dynamic'
import Link from 'next/link'
// components/Sidebar.tsx
import React, { Suspense } from 'react'
import EriceSidebar from '../components/dmmcomponents/Sidebar/DMMSidebar'

const TagCloud = dynamic(() => import('../components/SidebarTags'), {
	suspense: true,
	loading: () => <div>タグを読み込み中...</div>,
})

const Sidebar: React.FC = () => {
	return (
		<aside className='w-full md:w-64 lg:w-80 flex-shrink-0 bg-white border-b md:border-r md:border-b-0 p-4 md:p-6 mt-2'>
			<div className='sticky top-4'>
				<EriceSidebar />
				<nav className='bg-white dark:bg-gray-800 rounded-lg p-4'>
					<ul className='space-y-3'>
						<li>
							<Link
								href='/antenna'
								className='flex items-center text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md p-2 transition-colors duration-200 font-semibold'>
								<svg
									className='w-5 h-5 mr-3'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
									xmlns='http://www.w3.org/2000/svg'>
									<title>アンテナアイコン</title> {/* SVGの内容を説明するテキストを追加 */}
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0'
									/>
								</svg>
								<div className='text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500 text-extrabold text-xl'>
									えろぉアンテナ
								</div>
								<div className='text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500 text-extrabold text-xl'>
									同人トップページ
								</div>
							</Link>
						</li>
					</ul>
				</nav>

				{/* <TagCloud /> */}
			</div>
		</aside>
	)
}

export default Sidebar
