import { fetchCampaignNames } from '@/app/components/dmmcomponents/fetch/itemFetchers'
import Link from 'next/link'
import React from 'react'

const CampaignNames = async () => {
	const campaignNames = await fetchCampaignNames()

	if (!campaignNames) {
		return <div>キャンペーン名の取得に失敗しました。</div>
	}

	return (
		<div>
			<div className='flex items-center text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md p-2 transition-colors duration-200 font-semibold mb-2'>
				<svg
					className='w-5 h-5 mr-3'
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'
					xmlns='http://www.w3.org/2000/svg'
					aria-label='セール一覧'>
					<title>セール一覧</title>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z'
					/>
				</svg>
				セール一覧
			</div>
			<ul className='space-y-1'>
				{campaignNames.map(name => (
					<li key={name}>
						<Link
							href={`/campaign/${name}`}
							prefetch={true}
							className='flex items-center text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 text-base p-2 transition-colors duration-200 font-semibold'>
							{name}
						</Link>
					</li>
				))}
			</ul>
		</div>
	)
}

export default CampaignNames
