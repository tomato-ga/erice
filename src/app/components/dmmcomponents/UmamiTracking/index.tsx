'use client'

import React from 'react'
import { handleericeUmamiClick } from '../../../../lib/ericeUmamiTracking'
import { ExtendedDMMItemProps, UmamiTrackingProps, UmamiClickData } from '../../../../types/umamiTypes'

export function UmamiTracking({
	type,
	item,
	from,
	children,
	onClick
}: UmamiTrackingProps & { onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void }) {
	const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		const clickData: UmamiClickData = { type, from, item }
		handleericeUmamiClick(clickData)
		if (onClick) {
			onClick(event)
		}
		console.log('UmamiTracking', type, from, item)
	}

	return <div onClick={handleClick}>{children}</div>
}
