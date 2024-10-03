// src/lib/abTestTracking.ts
import { ABTestEvent } from '@/types/abTestTypes'

// Umamiを使用してイベントをトラッキング
export const trackABTestEvent = (event: ABTestEvent) => {
	if (typeof window !== 'undefined' && window.umami) {
		console.warn('Umami tracking is not available')
	}

	const eventName = `${event.testName}-${event.variant}-${event.eventType}`
	// console.log('Tracking event:', eventName, window.umami) // umamiが存在するかログを出力
	if (window.umami) {
		window.umami.track(eventName, { variant: event.variant })
	}
}

// インプレッションのトラッキング関数
export const trackImpression = (testName: string, variant: string) => {
	const event: ABTestEvent = {
		eventType: 'impression',
		testName,
		variant,
	}
	trackABTestEvent(event)
}

// クリックのトラッキング関数
export const trackClick = (testName: string, variant: string) => {
	const event: ABTestEvent = {
		eventType: 'click',
		testName,
		variant,
	}
	trackABTestEvent(event)
}
