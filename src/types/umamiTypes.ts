import { z } from 'zod'
import { DMMItemMainResponseSchema, DMMItemMainResponse } from './dmmitemzodschema'
import { DMMActressInfo } from './APItypes'

export type UmamiTrackingDataType = 'item' | 'actress' | 'combined' | 'other' | 'actress-name' | 'genre' | 'antenna'
export type UmamiTrackingFromType =
	| 'top'
	| 'kobetu-img-top'
	| 'kobetu-exlink-top'
	| 'kobetu-exlink-bottom'
	| 'kobetu-item-detail'
	| 'ExLink'
	| 'related'
	| 'genre'
	| 'search'
	| 'other'
	| 'antenna-post-list'
export type UmamiFeatureType = '/sale' | '/todaynew' | '/debut' | '/feature'

export type UmamiTrackingData = {
	dataType: UmamiTrackingDataType
	from: UmamiTrackingFromType
	featureType?: UmamiFeatureType
	item?: Partial<DMMItemMainResponse>
	actressInfo?: Partial<DMMActressInfo> | null
	otherData?: Record<string, unknown>
}

export type UmamiClickData = UmamiTrackingData

export interface UmamiTrackingProps {
	trackingData: UmamiTrackingData
	children: React.ReactNode
}

export const UmamiTrackingDataSchema = z.object({
	dataType: z.enum(['item', 'actress', 'combined', 'other', 'actress-name', 'genre', 'antenna']),
	from: z.enum([
		'top',
		'kobetu-img-top',
		'kobetu-exlink-top',
		'kobetu-exlink-bottom',
		'kobetu-item-detail',
		'ExLink',
		'related',
		'genre',
		'search',
		'other',
		'antenna-post-list'
	]),
	featureType: z.enum(['/sale', '/todaynew', '/debut', '/feature']).optional(),
	item: z
		.object({
			content_id: z.string(),
			title: z.string()
			})
		.partial()
		.optional(),
	actressInfo: z
		.object({
			data: z.array(
				z.object({
					actress_id: z.string(),
					actress_name: z.string()
				})
			)
		})
		.nullable()
		.optional(),
	otherData: z.record(z.unknown()).optional()
})

export function validateUmamiTrackingData(data: unknown): data is UmamiTrackingData {
	// console.log('Validating UmamiTrackingData:', JSON.stringify(data, null, 2))
	const result = UmamiTrackingDataSchema.safeParse(data)
	if (!result.success) {
		// console.error('Invalid UmamiTrackingData:', JSON.stringify(result.error.issues, null, 2))
		return false
	}
	// console.log('UmamiTrackingData is valid')
	return true
}
