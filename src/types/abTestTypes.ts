// src/types/abTestTypes.ts
export type ABTestEventType = 'impression' | 'click'

export interface ABTestEvent {
	eventType: ABTestEventType
	testName: string
	variant: string
}
