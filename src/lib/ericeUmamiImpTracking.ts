// import { UmamiClickData, validateUmamiTrackingData } from '@/types/umamiTypes'

// declare global {
// 	interface Window {
// 		umami?: {
// 			track: (eventName: string, eventData: Record<string, unknown>) => void
// 		}
// 	}
// }

// export const handleericeUmamiImpression = (impressionData: UmamiClickData) => {
// 	if (typeof window === 'undefined' || !window.umami) {
// 		console.warn('Umami tracking is not available')
// 		return
// 	}

// 	if (!validateUmamiTrackingData(impressionData)) {
// 		return
// 	}

// 	try {
// 		const trackingData: Record<string, unknown> = {
// 			impression_type: impressionData.dataType,
// 			from: impressionData.from,
// 			...(impressionData.featureType && { feature_type: impressionData.featureType }),
// 		}

// 		if (impressionData.item) {
// 			trackingData.item_id = impressionData.item.content_id
// 			trackingData.item_title = impressionData.item.title
// 		}

// 		if (impressionData.actressInfo?.data?.[0]) {
// 			trackingData.actress_id = impressionData.actressInfo.data[0].actress_id
// 			trackingData.actress_name = impressionData.actressInfo.data[0].actress_name
// 		}

// 		if (impressionData.otherData) {
// 			Object.assign(trackingData, impressionData.otherData)
// 		}

// 		const eventName = `${impressionData.dataType} | ${impressionData.from} | Impression`
// 		window.umami.track(eventName, trackingData)
// 	} catch (error) {
// 		console.error('Failed to track Umami impression event:', error)
// 	}
// }
