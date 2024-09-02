import { z } from 'zod'

export const DMMActressRelatedItemSchema = z.object({
	db_id: z.number(),
	content_id: z.string(),
	title: z.string(),
	url: z.string(),
	affiliate_url: z.string(),
	release_date: z.string(),
	imageURL: z.string(),
})

export const DMMActressRelatedApiResponseSchema = z.object({
	items: z.array(DMMActressRelatedItemSchema),
})

export type DMMActressRelatedItem = z.infer<typeof DMMActressRelatedItemSchema>
export type DMMActressRelatedApiResponse = z.infer<typeof DMMActressRelatedApiResponseSchema>

export const DMMActressProfileSchema = z.object({
	actress: z.object({
		id: z.number(),
		dmm_id: z.number(),
		name: z.string(),
		ruby: z.string().nullable(),
		bust: z.number().nullable(),
		waist: z.number().nullable(),
		hip: z.number().nullable(),
		height: z.number().nullable(),
		birthday: z.string().nullable(),
		blood_type: z.string().nullable(),
		hobby: z.string().nullable(),
		prefectures: z.string().nullable(),
		image_url_small: z.string().nullable(),
		image_url_large: z.string().nullable(),
		list_url: z.string().nullable(),
		cup: z.string().nullable(),
		details: z.string().nullable(),
		styles: z.array(z.string()).nullable().optional(), // 変更点: optional() を追加
		types: z.array(z.string()).nullable().optional(), // 変更点: optional() を追加
	}),
})

export type DMMActressProfile = z.infer<typeof DMMActressProfileSchema>

export type ActressDetails = {
	[key: string]: string | number | boolean | null | undefined | string[] | object
}

export const DMMActressProfilePageItemSchema = z.object({
	id: z.string(),
	content_id: z.string(),
	imageURL: z.string().optional(),
	title: z.string(),
	release_date: z.string(),
})

export const ActressProfileAndWorksSchema = z.object({
	profile: DMMActressProfileSchema,
	works: z.array(DMMActressProfilePageItemSchema),
})

export type ActressProfileAndWorks = z.infer<typeof ActressProfileAndWorksSchema>
export type DMMActressProfilePageItem = z.infer<typeof DMMActressProfilePageItemSchema>

// MEMO Umamiにデータ送信するために取ってくるactresseデータ
export const DMMActressInfoSchema = z.object({
	status: z.string(),
	data: z
		.array(
			z.object({
				actress_id: z.number(),
				actress_name: z.string(),
			}),
		)
		.nullable()
		.optional(),
	message: z.string().nullable().optional(),
})

export type DMMActressInfo = z.infer<typeof DMMActressInfoSchema> | null | undefined
