// CampaignLinks.tsx
import Link from 'next/link'
import React, { PropsWithChildren } from 'react'

export interface CampaignLinksProps {
	campaignNames: string[]
}

const CampaignLinks: React.FC<PropsWithChildren<CampaignLinksProps>> = ({ campaignNames }) => {
	if (!campaignNames || campaignNames.length === 0) return null

	return (
		<div className='text-center text-sm text-gray-500'>
			{campaignNames.map((campaignName, index) => (
				<span key={index}>
					<Link
						prefetch={true}
						href={`/campaign/${campaignName}`}
						className='text-blue-600 underline hover:no-underline'>
						{campaignName}
					</Link>
					<br />
				</span>
			))}
		</div>
	)
}

export default React.memo(CampaignLinks)
