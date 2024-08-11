// /Volumes/SSD_1TB/erice2/erice/types/dmmitemzodschema.ts

import { z } from 'zod'

export const DMMBaseItemSchema = z.object({
	content_id: z.string(),
	title: z.string(),
	affiliateURL: z.string(),
	imageURL: z.string(),
	sampleImageURL: z.array(z.string()).nullable().optional(),
	price: z.string().optional(),
	actress: z.string().optional(),
	genre: z.array(z.string()).optional(),
	date: z.string().optional()
})

export const DMMSaleItemSchema = DMMBaseItemSchema.extend({
	salecount: z.string().optional(),
	salePrice: z.string().optional(),
	rate: z.string().optional(),
	listprice: z.string().optional(),
	actress_id: z.number().optional()
})

export const DMMItemSchema = DMMBaseItemSchema.merge(
	DMMSaleItemSchema.partial().omit({
		content_id: true,
		title: true,
		affiliateURL: true,
		imageURL: true
	})
)

export type DMMItem = z.infer<typeof DMMItemSchema>
