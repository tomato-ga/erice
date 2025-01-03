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
			// console.log('window.umami: ', window.umami.track)
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
	try {
		const eventName = `${event.testName}-${event.variant}-${event.eventType}`

		// if (event.eventType === 'click') {
		// 	console.log('event.eventType === click: trackABTestEvent:クリックをトラッキングスタート')
		// }

		if (typeof window !== 'undefined' && window.umami) {
			await waitForUmami()
			window.umami.track(eventName, { variant: event.variant })
		} else {
			console.error('Window is not available')
		}
	} catch (error) {
		console.error('Error tracking event:', error)
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
	// console.log('trackClick:クリックをトラッキングスタート')

	return trackABTestEvent(event)
}
