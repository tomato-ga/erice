'use client'

import React from 'react'
import { handleericeUmamiClick } from '../../../../lib/ericeUmamiTracking'
import { ExtendedDMMItemProps, UmamiTrackingProps } from '../../../../types/umamiTypes'

export function UmamiTracking({ type, item, from, children, onClick }: UmamiTrackingProps & { onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void }) {
	const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		handleericeUmamiClick(type, from, item)
		if (onClick) {
			onClick(event)
		}
		console.log('UmamiTracking', type, from, item)
	}

	return <div onClick={handleClick}>{children}</div>
}
