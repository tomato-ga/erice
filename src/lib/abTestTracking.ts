// src/lib/abTestTracking.ts
import { ABTestEvent } from '@/types/abTestTypes'

// Umamiを使用してイベントをトラッキング
// export const trackABTestEvent = (event: ABTestEvent): Promise<void> => {
// 	return new Promise((resolve, reject) => {
// 		const eventName = `${event.testName}-${event.variant}-${event.eventType}`
// 		if (typeof window !== 'undefined' && window.umami) {
// 			try {
// 				window.umami.track(eventName, { variant: event.variant })
// 				console.log('trackABTestEvent: Event tracked:', eventName)
// 				// トラッキングが完了したとみなし、少し遅延を入れてresolveする
// 				setTimeout(() => resolve(), 100)
// 			} catch (error) {
// 				console.error('Error tracking event:', error)
// 				reject(error)
// 			}
// 		} else {
// 			console.error('Umami is not available')
// 			reject(new Error('Umami is not available'))
// 		}
// 	})
// }

// Umamiが読み込まれるまで待機する関数
export const waitForUmami = (): Promise<void> => {
	return new Promise(resolve => {
		if (window.umami && typeof window.umami.track === 'function') {
			resolve()
		} else {
			const interval = setInterval(() => {
				if (window.umami && typeof window.umami.track === 'function') {
					clearInterval(interval)
					resolve()
				}
			}, 50) // 50msごとにチェック
		}
	})
}

// Umamiを使用してイベントをトラッキング
export const trackABTestEvent = async (event: ABTestEvent) => {
	const eventName = `${event.testName}-${event.variant}-${event.eventType}`

	if (typeof window !== 'undefined' && window.umami) {
		await waitForUmami() // Umamiが読み込まれるまで待機
		window.umami.track(eventName, { variant: event.variant })
		console.log('trackABTestEvent: Event tracked:', eventName)
	} else {
		console.error('Window is not available')
	}
}

// インプレッションのトラッキング関数
export const trackImpression = (testName: string, variant: string): Promise<void> => {
	const event: ABTestEvent = {
		eventType: 'imp',
		testName,
		variant,
	}
	return trackABTestEvent(event)
}

// クリックのトラッキング関数
export const trackClick = (testName: string, variant: string): Promise<void> => {
	const event: ABTestEvent = {
		eventType: 'click',
		testName,
		variant,
	}
	return trackABTestEvent(event)
}
