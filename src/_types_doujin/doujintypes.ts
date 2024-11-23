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
	URL: z.string(),
	affiliateURL: z.string(),
	category_name: z.string(),
	content_id: z.string(),
	date: z.string(),
	db_id: z.number(),
	floor_code: z.string(),
	floor_name: z.string(),
	genres: z.array(
		z.object({
			id: z.number(),
			name: z.string(),
		}),
	),
	imageURL: z
		.union([
			z.string().transform(val => JSON.parse(val)),
			z.object({
				large: z.string(),
				list: z.string(),
				small: z.string().optional(),
			}),
		])
		.nullable(),
	makers: z
		.array(
			z.object({
				id: z.number(),
				name: z.string(),
			}),
		)
		.nullable(),
	prices: z
		.union([
			z.string().transform(val => JSON.parse(val)),
			z.object({
				deliveries: z.object({
					delivery: z.array(
						z.object({
							type: z.string(),
							list_price: z.string(),
							price: z.string(),
						}),
					),
				}),
				list_price: z.string(),
				price: z.string(),
			}),
		])
		.nullable(),
	product_id: z.string(),
	review_average: z.number().nullable(),
	review_count: z.number().nullable(),
	sampleImageURL: z.array(z.string()).nullable(),
	series: z
		.array(
			z.object({
				id: z.number(),
				name: z.string(),
			}),
		)
		.nullable(),
	service_code: z.string(),
	service_name: z.string(),
	title: z.string(),
	volume: z.string().nullish(),
	campaign: z
		.array(
			z.object({
				date_begin: z.string(),
				date_end: z.string(),
				title: z.string(),
			}),
		)
		.nullish(),
})

export const DoujinKVApiResponseSchema = z.object({
	kvDatas: z.array(FetchDoujinItemSchema),
})

export type DoujinKVApiResponse = z.infer<typeof DoujinKVApiResponseSchema>

export type FetchDoujinItem = z.infer<typeof FetchDoujinItemSchema>
export type DoujinTopItem = z.infer<typeof FetchDoujinItemSchema>

// DoujinKobetuItemSchema の修正
export const DoujinKobetuItemSchema = FetchDoujinItemSchema.extend({
	package_images: z
		.object({
			large: z.string(),
		})
		.nullish(),
	// 修正: genres を文字列の配列からオブジェクトの配列に変更
	genres: z.array(z.object({ id: z.number(), name: z.string() })).nullish(),
	// 修正: makers を文字列の配列からオブジェクトの配列に変更
	makers: z.array(z.object({ id: z.number(), name: z.string() })).nullish(),
	// 修正: series を文字列の配列からオブジェクトの配列に変更
	series: z.array(z.object({ id: z.number(), name: z.string() })).nullish(),

	// MEMO KVへDMM生データを保存したプロパティと、個別ページ(DB)で使用するプロパティを分けているため追記
	affiliate_url: z.string(),
	release_date: z.string(),
	sample_images: z.array(z.string()).nullish(),
})

export type DoujinKobetuItem = z.infer<typeof DoujinKobetuItemSchema>

export interface DoujinGenrePaginationProps {
	db_id: number
	content_id: string
	package_images: string
	title: string
}

export type DoujinItemType = 'rank' | 'todaynew' | 'review' | 'sale' | 'feature' | 'last7days'

// PackageImages schema
export const PackageImagesSchema = z.object({
	list: z.string().url(),
	large: z.string().url(),
})

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
	maker_id?: number
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
	maker_id: z.number().optional(),
})
