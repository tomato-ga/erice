'use client'

import React, { useCallback } from 'react'
import { handleericeUmamiClick } from '@/lib/ericeUmamiTracking'
import { UmamiTrackingProps, UmamiClickData, validateUmamiTrackingData } from '@/types/umamiTypes'

export function UmamiTracking({ trackingData, children }: UmamiTrackingProps) {
	const handleClick = useCallback(
		(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
			// console.log('UmamiTracking: Original tracking data:', JSON.stringify(trackingData, null, 2))
			if (validateUmamiTrackingData(trackingData)) {
				// console.log('UmamiTracking: Validated tracking data:', JSON.stringify(trackingData, null, 2))
				handleericeUmamiClick(trackingData)
			} else {
				// console.error('UmamiTracking: Invalid tracking data', JSON.stringify(trackingData, null, 2))
			}
		},
		[trackingData]
	)

	return <div onClick={handleClick}>{children}</div>
}
