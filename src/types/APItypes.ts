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
