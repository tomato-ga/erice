// abTestTracking.ts
import { ABTestEvent } from '@/types/abTestTypes'

// Umamiを使用してイベントをトラッキング
export const trackABTestEvent = (event: ABTestEvent) => {
	window.umami?.track(`${event.testName}-${event.eventType}`, {
		variant: event.variant,
		timestamp: event.timestamp.toISOString(),
		...event.additionalData,
	})
}

// インプレッションのトラッキング関数
export const trackImpression = (
	testName: string,
	variant: string,
	additionalData?: Record<string, unknown>,
) => {
	const event: ABTestEvent = {
		eventType: 'impression',
		testName,
		variant,
		timestamp: new Date(),
		additionalData,
	}
	trackABTestEvent(event)
}

// クリックのトラッキング関数
export const trackClick = (
	testName: string,
	variant: string,
	additionalData?: Record<string, unknown>,
) => {
	const event: ABTestEvent = {
		eventType: 'click',
		testName,
		variant,
		timestamp: new Date(),
		additionalData,
	}
	trackABTestEvent(event)
}
