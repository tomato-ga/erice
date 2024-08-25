// antennaschema.ts

import { z } from 'zod'

export const antennaPostSchema = z.object({
	id: z.number(),
	title: z.string(),
	description: z.string().nullable(),
	image_url: z.string().nullable(),
	published_at: z.string(),
	url: z.string(),
	site_name: z.string().nullable(),
	category_name: z.string().nullable()
})

export type antennaPost = z.infer<typeof antennaPostSchema>

export const antennaPostApiResponseSchema = z.object({
	status: z.string(),
	data: z.array(antennaPostSchema),
	count: z.number()
})

export type antennaPostApiResponse = z.infer<typeof antennaPostApiResponseSchema>
