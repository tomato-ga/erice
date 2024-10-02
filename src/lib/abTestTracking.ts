// TODO ???
// src/lib/abTestTracking.ts
import { ABTestEvent } from '@/types/abTestTypes'

// Umamiを使用してイベントをトラッキング
export const trackABTestEvent = (event: ABTestEvent) => {
	// イベント名にテスト名、バリアント、イベントタイプを含める
	const eventName = `${event.testName}-${event.variant}-${event.eventType}`
	// eventData には variant を含める
	window.umami?.track(eventName, { variant: event.variant })
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
