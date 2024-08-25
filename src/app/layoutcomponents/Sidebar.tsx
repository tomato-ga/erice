// components/Sidebar.tsx
import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'
import EriceSidebar from '../components/dmmcomponents/Sidebar/DMMSidebar'
import Link from 'next/link'

const TagCloud = dynamic(() => import('../components/SidebarTags'), {
	suspense: true,
	loading: () => <div>タグを読み込み中...</div>
})

const Sidebar: React.FC = () => {
	return (
		<aside className="w-full md:w-64 lg:w-80 flex-shrink-0 bg-white border-b md:border-r md:border-b-0 p-4 md:p-6 mt-2">
			<div className="sticky top-4">
				<EriceSidebar />
				<nav className="bg-white dark:bg-gray-800 rounded-lg p-4">
					<ul className="space-y-3">
						<li>
							<Link
								href="/antenna"
								className="flex items-center text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md p-2 transition-colors duration-200"
							>
								<svg
									className="w-5 h-5 mr-3"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
									/>
								</svg>
								エロコメアンテナ
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
