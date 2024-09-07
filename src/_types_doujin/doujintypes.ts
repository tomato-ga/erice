import { UmamiTrackingFromType } from '@/types/umamiTypes'

import { z } from 'zod'

// DMM APIのレスポンス型をzodスキーマで定義
const RawDMMItemSchema = z.object({
	content_id: z.string().nullable(),
	product_id: z.string().nullable(),
	title: z.string().nullable(),
	volume: z.string().nullable(),
	review: z
		.object({
			count: z.string().nullable(),
			average: z.string().nullable()
		})
		.nullable()
		.optional(), // review プロパティを optional に変更
	URL: z.string().nullable(),
	affiliateURL: z.string().nullable(),
	date: z.string().nullable(),
	service_code: z.string().nullable(),
	service_name: z.string().nullable(),
	floor_code: z.string().nullable(),
	floor_name: z.string().nullable(),
	prices: z.any().nullable(),
	imageURL: z.any().nullable(),
	iteminfo: z
		.object({
			genre: z.array(z.object({ id: z.number(), name: z.string() })).optional(), // genre を optional に変更
			series: z.array(z.object({ id: z.number(), name: z.string() })).optional(), // series を optional に変更
			maker: z.array(z.object({ id: z.number(), name: z.string() })).optional() // maker を optional に変更
		})
		.nullable(),
	category_name: z.string().nullable(),
	campaign: z
		.array(
			z.object({
				date_begin: z.string(),
				date_end: z.string(),
				title: z.string()
			})
		)
		.nullable()
		.optional()
})

// RawDMMItem 型定義
export type RawDMMItem = z.infer<typeof RawDMMItemSchema>

export const FetchDoujinItemSchema = z.object({
	db_id: z.number(),
	content_id: z.string(),
	title: z.string(),
	volume: z.string().nullish().optional(),
	affiliate_url: z.string(),
	package_images: z.object({}).passthrough().nullish().optional(),
	sample_images: z.array(z.object({}).passthrough()).nullish().optional(),
	release_date: z.string().optional(),
	review_count: z.number().nullish(),
	review_average: z.number().nullish(),
	prices: z.object({}).passthrough().nullish(),
	genres: z.array(z.object({}).passthrough()).nullish(),
	makers: z.array(z.object({}).passthrough()).nullish(),
	series: z.array(z.object({}).passthrough()).nullish(),
	campaign: z.array(z.object({}).passthrough()).nullish()
})

export type FetchDoujinItem = z.infer<typeof FetchDoujinItemSchema>

export type DoujinTopItem = z.infer<typeof FetchDoujinItemSchema>

// APIレスポンスのスキーマを定義
export const DoujinTopApiResponseSchema = z.object({
	result: z.object({
		items: z.array(FetchDoujinItemSchema)
	})
})

export type DoujinTopApiResponse = z.infer<typeof DoujinTopApiResponseSchema>
