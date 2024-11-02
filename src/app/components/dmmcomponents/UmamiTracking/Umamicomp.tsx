// UmamiComp.tsx
'use client'

import { handleericeUmamiClick } from '@/lib/ericeUmamiTracking'
import { UmamiTrackingProps, validateUmamiTrackingData } from '@/types/umamiTypes'
import React, { useCallback } from 'react'

const UmamiComp: React.FC<UmamiTrackingProps> = React.memo(({ trackingData, children }) => {
	const handleClick = useCallback(
		(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
			if (validateUmamiTrackingData(trackingData)) {
				handleericeUmamiClick(trackingData)
			}
		},
		[trackingData],
	)

	return <div onClick={handleClick}>{children}</div>
})

// displayNameを追加
UmamiComp.displayName = 'UmamiComp'

export default UmamiComp
