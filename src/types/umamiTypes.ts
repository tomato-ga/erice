import { z } from 'zod'
import { DMMActressInfo } from './APItypes'
import { DMMItemMainResponse, DMMItemMainResponseSchema } from './dmmitemzodschema'

export type UmamiTrackingDataType =
	| 'item'
	| 'actress'
	| 'combined'
	| 'other'
	| 'actress-name'
	| 'genre'
	| 'antenna'
	| 'doujin-item'

export type UmamiTrackingFromType =
	| 'top-sale'
	| 'top-todaynew'
	| 'top-debut'
	| 'top-feature'
	| 'top-new-actress'
	| 'top-popular-actress'
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
	| 'antenna-postpage-detail'
	| 'newdebutpage-item'
	| 'top-doujin-sale'
	| string

export type UmamiFeatureType = '/sale' | '/todaynew' | '/debut' | '/feature' | '/last7days'

export type DMMDoujinFeaturedItemType =
	| '/sale'
	| '/rank'
	| '/todaynew'
	| '/review'
	| '/feature'
	| '/last7days'

export type CombinedFeatureType = UmamiFeatureType | DMMDoujinFeaturedItemType | '/top100'

export type UmamiTrackingData = {
	dataType: UmamiTrackingDataType
	from: UmamiTrackingFromType
	featureType?: CombinedFeatureType
	item?: Partial<DMMItemMainResponse>
	actressInfo?: Partial<DMMActressInfo> | null
	otherData?: Record<string, unknown>
	abTest?: string // A/Bテスト用のフィールドを追加
}

export type UmamiClickData = UmamiTrackingData

export interface UmamiTrackingProps {
	trackingData: UmamiTrackingData
	children: React.ReactNode
}

export const UmamiTrackingDataSchema = z.object({
	dataType: z.enum([
		'item',
		'actress',
		'combined',
		'other',
		'actress-name',
		'genre',
		'antenna',
		'doujin-item',
	]),
	from: z.enum([
		'top-sale',
		'top-todaynew',
		'top-debut',
		'top-feature',
		'top-new-actress',
		'top-popular-actress',
		'kobetu-img-top',
		'kobetu-exlink-top',
		'kobetu-exlink-bottom',
		'kobetu-item-detail',
		'ExLink',
		'related',
		'genre',
		'search',
		'other',
		'antenna-post-list',
		'antenna-postpage-detail',
		'newdebutpage-item',
		'top-doujin-sale',
	]),
	featureType: z
		.enum([
			'/sale',
			'/todaynew',
			'/debut',
			'/feature',
			'/last7days',
			'/doujin-sale',
			'/doujin-newrank',
			'/doujin-newrelease',
			'/doujin-popular-circles',
			'/doujin-review',
			'/top100',
		])
		.optional(),
	item: z
		.object({
			content_id: z.string(),
			title: z.string(),
		})
		.partial()
		.optional(),
	actressInfo: z
		.object({
			data: z.array(
				z.object({
					actress_id: z.string(),
					actress_name: z.string(),
				}),
			),
		})
		.nullable()
		.optional(),
	otherData: z.record(z.unknown()).optional(),
	abTest: z.string().optional(), // A/Bテストのフィールドを型に追加
})

export function validateUmamiTrackingData(data: unknown): data is UmamiTrackingData {
	const result = UmamiTrackingDataSchema.safeParse(data)
	if (!result.success) {
		return false
	}
	return true
}
