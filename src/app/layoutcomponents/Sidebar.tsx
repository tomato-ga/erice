import React from 'react'
import TagCloud from '../components/SidebarTags'

const Sidebar = () => {
	return (
		<aside className="w-full md:w-64 lg:w-80 flex-shrink-0 bg-white border-b md:border-r md:border-b-0 p-4 md:p-6 mt-2">
			<div className="sticky top-4">
				<TagCloud />
			</div>
		</aside>
	)
}

export default Sidebar
