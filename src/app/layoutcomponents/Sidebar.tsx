import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import TagCloud from '../components/SidebarTags'

const Sidebar = async () => {
	return (
		<div className="bg-white p-6 order-2 md:order-1 transform w-full md:w-80 border-r mt-2">
			<div className="text-black space-y-6">
				<TagCloud />
			</div>
		</div>
	)
}

export default Sidebar
