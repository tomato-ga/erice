import { z } from 'zod'

export const DMMActressRelatedItemSchema = z.object({
	id: z.number(),
	content_id: z.string(),
	title: z.string(),
	url: z.string(),
	affiliate_url: z.string(),
	release_date: z.string(),
	imageURL: z.string()
})

export const DMMActressRelatedApiResponseSchema = z.object({
	items: z.array(DMMActressRelatedItemSchema)
})

export type DMMActressRelatedItem = z.infer<typeof DMMActressRelatedItemSchema>
export type DMMActressRelatedApiResponse = z.infer<typeof DMMActressRelatedApiResponseSchema>

export const DMMActressProfileSchema = z.object({
	actress: z.object({
		id: z.number(),
		dmm_id: z.number(),
		name: z.string(),
		ruby: z.string(),
		bust: z.number().nullable().or(z.string()),
		waist: z.number().nullable().or(z.string()),
		hip: z.number().nullable().or(z.string()),
		height: z.number().nullable().or(z.string()),
		birthday: z.string().nullable().or(z.string()),
		blood_type: z.string().nullable().or(z.string()),
		hobby: z.string().nullable().or(z.string()),
		prefectures: z.string().nullable().or(z.string()),
		image_url_small: z.string().nullable().or(z.string()),
		image_url_large: z.string().nullable().or(z.string()),
		list_url: z.string().nullable().or(z.string()),
		cup: z.string().nullable().or(z.string()).optional()
	})
})

export type DMMActressProfile = z.infer<typeof DMMActressProfileSchema>

export const DMMActressProfilePageItemSchema = z.object({
	id: z.string(),
	content_id: z.string(),
	imageURL: z.string().optional(),
	title: z.string(),
	release_date: z.string()
})

export const ActressProfileAndWorksSchema = z.object({
	profile: DMMActressProfileSchema,
	works: z.array(DMMActressProfilePageItemSchema)
})

export type ActressProfileAndWorks = z.infer<typeof ActressProfileAndWorksSchema>
export type DMMActressProfilePageItem = z.infer<typeof DMMActressProfilePageItemSchema>
