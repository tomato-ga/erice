'use client'

import { handleericeUmamiClick } from '@/lib/ericeUmamiTracking'
import { UmamiClickData, UmamiTrackingProps, validateUmamiTrackingData } from '@/types/umamiTypes'
import React, { useCallback } from 'react'

export function UmamiTracking({ trackingData, children }: UmamiTrackingProps) {
	const handleClick = useCallback(
		(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
			// console.log('UmamiTracking: Original tracking data:', JSON.stringify(trackingData, null, 2))
			if (validateUmamiTrackingData(trackingData)) {
				// console.log('UmamiTracking: Validated tracking data')
				handleericeUmamiClick(trackingData)
			} else {
				// console.error('UmamiTracking: Invalid tracking data', JSON.stringify(trackingData, null, 2))
			}
		},
		[trackingData],
	)

	return <div onClick={handleClick}>{children}</div>
}
