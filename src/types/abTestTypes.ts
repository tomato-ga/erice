// src/types/abTestTypes.ts
export type ABTestEventType = 'imp' | 'click'

export interface ABTestEvent {
	eventType: ABTestEventType
	testName: string
	variant: string
}
