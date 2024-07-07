import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const Sidebar = async () => {
	return (
		<div className="bg-white p-6 order-2 md:order-1 transform w-full md:w-80 border-r mt-2">
			<div className="text-black space-y-6">
				<div>
					<h4 className="text-xl font-bold mb-3">ケース</h4>
				</div>
				<div>
					<h4 className="text-xl font-bold mb-3">スイッチ</h4>
				</div>
				<div>
					<h4 className="text-xl font-bold mb-3">プレート</h4>
				</div>
				<div>
					<h4 className="text-xl font-bold mb-3">キーキャップ</h4>
				</div>
			</div>
		</div>
	)
}

export default Sidebar
