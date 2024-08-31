import { UmamiClickData, validateUmamiTrackingData } from '@/types/umamiTypes'

declare global {
	interface Window {
		umami?: {
			track: (eventName: string, eventData: Record<string, unknown>) => void
		}
	}
}

export const handleericeUmamiClick = (clickData: UmamiClickData) => {
	if (typeof window === 'undefined' || !window.umami) {
		// console.warn('Umami tracking is not available')
		return
	}

	// console.log('handleericeUmamiClick: Received click data:', JSON.stringify(clickData, null, 2))

	if (!validateUmamiTrackingData(clickData)) {
		// console.error('handleericeUmamiClick: Invalid click data')
		return
	}

	try {
		const trackingData: Record<string, unknown> = {
			click_type: clickData.dataType,
			from: clickData.from,
			...(clickData.featureType && { feature_type: clickData.featureType })
		}

		if (clickData.item) {
			trackingData.item_id = clickData.item.content_id
			trackingData.item_title = clickData.item.title
		}

		if (clickData.actressInfo?.data?.[0]) {
			trackingData.actress_id = clickData.actressInfo.data[0].actress_id
			trackingData.actress_name = clickData.actressInfo.data[0].actress_name
		}

		if (clickData.otherData) {
			Object.assign(trackingData, clickData.otherData)
		}

		const eventName = `${clickData.dataType} ${clickData.from} Click`
		// console.log('Sending Umami event:', eventName, JSON.stringify(trackingData, null, 2))
		window.umami.track(eventName, trackingData)
		// console.log('Umami event tracked successfully')
	} catch (error) {
		// console.error('Failed to track Umami click event:', error)
	}
}
