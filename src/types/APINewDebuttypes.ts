import { z } from 'zod'

const ImageURLSchema = z.record(z.string().url().optional()).optional()

const SampleImageURLSchema = z
	.object({
		sample_s: z
			.object({
				image: z.array(z.string().url()).optional()
			})
			.optional(),
		sample_l: z
			.object({
				image: z.array(z.string().url()).optional()
			})
			.optional()
	})
	.optional()

const SampleMovieURLSchema = z.record(z.union([z.string().url(), z.number()]).optional()).optional()

const PricesSchema = z
	.object({
		price: z.string().optional(),
		list_price: z.string().optional(),
		deliveries: z
			.object({
				delivery: z
					.array(
						z.object({
							type: z.string().optional(),
							price: z.string().optional(),
							list_price: z.string().optional()
						})
					)
					.optional()
			})
			.optional()
	})
	.optional()

const DMMItemSchema = z.object({
	service_code: z.string().optional(),
	service_name: z.string().optional(),
	floor_code: z.string().optional(),
	floor_name: z.string().optional(),
	category_name: z.string().optional(),
	content_id: z.string(),
	product_id: z.string().optional(),
	title: z.string(),
	volume: z.string().optional(),
	URL: z.string().url().optional(),
	affiliateURL: z.string().url(),
	imageURL: ImageURLSchema,
	sampleImageURL: SampleImageURLSchema,
	sampleMovieURL: SampleMovieURLSchema,
	prices: PricesSchema,
	date: z.string().optional(),
	iteminfo: z
		.object({
			genre: z
				.array(
					z.object({
						id: z.number(),
						name: z.string()
					})
				)
				.optional(),
			maker: z
				.array(
					z.object({
						id: z.number(),
						name: z.string()
					})
				)
				.optional(),
			actress: z
				.array(
					z.object({
						id: z.number(),
						name: z.string(),
						ruby: z.string()
					})
				)
				.optional(),
			director: z
				.array(
					z.object({
						id: z.number(),
						name: z.string(),
						ruby: z.string()
					})
				)
				.optional(),
			label: z
				.array(
					z.object({
						id: z.number(),
						name: z.string()
					})
				)
				.optional(),
			series: z
				.array(
					z.object({
						id: z.number(),
						name: z.string()
					})
				)
				.optional()
		})
		.optional(),
	db_id: z.number().optional()
})

export const DMMNewDebutApiResponseSchema = z.object({
	result: z.object({
		items: z.array(DMMItemSchema).default([]) // itemsを必須フィールドにし、デフォルトで空配列を設定
	})
})

export type ImageURL = z.infer<typeof ImageURLSchema>

export type DMMNewDebutApiResponse = z.infer<typeof DMMNewDebutApiResponseSchema>
export type DMMNewDebutItem = z.infer<typeof DMMItemSchema>

export const ProcessedDMMItemSchema = z.object({
	content_id: z.string(),
	title: z.string(),
	affiliateURL: z.string().url(),
	imageURL: z.string().url().nullable(),
	sampleImageURL: z.array(z.string().url()).nullable(),
	sampleMovieURL: z.array(z.string().url()),
	actress: z.string().nullable(),
	actress_id: z.number().nullable(),
	genre: z.array(z.string()).nullable(),
	date: z.string().nullable(),
	maker: z.string().nullable(),
	label: z.string().nullable(),
	series: z.string().nullable(),
	director: z.string().nullable(),
	db_id: z.number().nullable()
})

export type ProcessedDMMItem = z.infer<typeof ProcessedDMMItemSchema>
