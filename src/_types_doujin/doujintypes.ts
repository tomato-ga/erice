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
			average: z.string().nullable(),
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
			maker: z.array(z.object({ id: z.number(), name: z.string() })).optional(), // maker を optional に変更
		})
		.nullable(),
	category_name: z.string().nullable(),
	campaign: z
		.array(
			z.object({
				date_begin: z.string(),
				date_end: z.string(),
				title: z.string(),
			}),
		)
		.nullable()
		.optional(),
})

// RawDMMItem 型定義
export type RawDMMItem = z.infer<typeof RawDMMItemSchema>

export const FetchDoujinItemSchema = z.object({
	db_id: z.number(),
	content_id: z.string(),
	title: z.string(),
	volume: z.string().nullish(),
	affiliate_url: z.string(),
	package_images: z
		.object({
			large: z.string(),
		})
		.nullish(),
	sample_images: z.array(z.string().nullish()).nullish().optional(),
	release_date: z.string().optional(),
	review_count: z.number().nullish(),
	review_average: z.number().nullish(),
	prices: z.object({}).passthrough().nullish(),
	genres: z.array(z.any()).nullish(),
	makers: z.array(z.any()).nullish(),
	series: z.array(z.any()).nullish(),
	campaign: z.array(z.object({})).nullish(),
})

export type FetchDoujinItem = z.infer<typeof FetchDoujinItemSchema>
export type DoujinTopItem = z.infer<typeof FetchDoujinItemSchema>

// PackageImages schema
export const PackageImagesSchema = z.object({
	list: z.string().url(),
	large: z.string().url(),
})

// DoujinKobetuItemSchema の修正
export const DoujinKobetuItemSchema = FetchDoujinItemSchema.extend({
	package_images: PackageImagesSchema.nullable(),
	// 修正: genres を文字列の配列からオブジェクトの配列に変更
	genres: z.array(z.object({ id: z.number(), name: z.string() })).nullish(),
	// 修正: makers を文字列の配列からオブジェクトの配列に変更
	makers: z.array(z.object({ id: z.number(), name: z.string() })).nullish(),
	// 修正: series を文字列の配列からオブジェクトの配列に変更
	series: z.array(z.object({ id: z.number(), name: z.string() })).nullish(),
})

export type DoujinKobetuItem = z.infer<typeof DoujinKobetuItemSchema>

// APIレスポンスのスキーマを定義
export const DoujinTopApiResponseSchema = z.object({
	result: z.object({
		items: z.array(FetchDoujinItemSchema),
	}),
})

export type DoujinTopApiResponse = z.infer<typeof DoujinTopApiResponseSchema>

export interface DoujinGenrePaginationProps {
	db_id: number
	content_id: string
	package_images: string
	title: string
}

export type DoujinItemType = 'newrank' | 'newrelease' | 'review' | 'sale'

// Timeline item schema
export const TimelineItemSchema = z.object({
	id: z.number().nullable(),
	title: z.string(),
	release_date: z.string(),
	package_images: PackageImagesSchema.nullable(),
})

export type TimelineItem = z.infer<typeof TimelineItemSchema>

// API response schema
export const TimelineApiResponseSchema = z.array(TimelineItemSchema)
export type TimelineApiResponse = z.infer<typeof TimelineApiResponseSchema>

// Common Pagination Item
export interface PaginationItem {
	db_id: number
	content_id: string
	package_images: string | null
	title: string
}

// Pagination Response
export interface PaginationResponse {
	items: PaginationItem[]
	currentPage: number
	totalPages: number
	category?: string
}

// Zod schema for pagination item
export const PaginationItemSchema = z.object({
	db_id: z.number(),
	content_id: z.string(),
	package_images: z.string().nullable(),
	title: z.string(),
})

// Zod schema for pagination response
export const PaginationResponseSchema = z.object({
	items: z.array(PaginationItemSchema),
	currentPage: z.number(),
	totalPages: z.number(),
	category: z.string().optional(),
})
