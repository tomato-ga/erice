// src/lib/abTestTracking.ts
import { ABTestEvent } from '@/types/abTestTypes'

// Umamiを使用してイベントをトラッキング
export const trackABTestEvent = (event: ABTestEvent) => {
	const eventName = `${event.testName}-${event.variant}-${event.eventType}`
	console.log('Tracking event:', eventName) // イベント名のログ
	if (window.umami) {
		console.log('Umami is available, calling track with:', eventName)
		window.umami.track(eventName, { variant: event.variant })
	} else {
		console.error('Umami is undefined at the time of tracking:', eventName)
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
