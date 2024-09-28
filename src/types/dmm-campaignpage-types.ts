import { z } from 'zod'

// 画像URL用スキーマ
const ImageURLSchema = z.object({
	large: z.string(),
	list: z.string(),
	small: z.string(),
})

// 基本的な情報項目のスキーマ
const InfoItemSchema = z.object({
	id: z.union([z.string(), z.number()]),
	name: z.string(),
	ruby: z.string().optional(),
})

// 商品詳細情報用スキーマ
const ItemInfoSchema = z.object({
	genre: z.array(InfoItemSchema).optional().nullable(),
	series: z.array(InfoItemSchema).optional().nullable(),
	maker: z.array(InfoItemSchema).optional().nullable(),
	actor: z.array(InfoItemSchema).optional().nullable(),
	actress: z
		.array(
			z.object({
				id: z.coerce.number(), // 数値型として定義
				name: z.string(),
				ruby: z.string().optional(),
			}),
		)
		.optional()
		.nullish(),
	director: z.array(InfoItemSchema).optional().nullable(),
	author: z.array(InfoItemSchema).optional().nullable(),
	label: z.array(InfoItemSchema).optional().nullable(),
	type: z.array(InfoItemSchema).optional().nullable(),
	color: z.array(InfoItemSchema).optional().nullable(),
	size: z.array(InfoItemSchema).optional().nullable(),
})

// キャンペーン情報用スキーマ
const CampaignSchema = z.object({
	date_begin: z.string(),
	date_end: z.string(),
	title: z.string(),
})

// サンプル画像URL用スキーマ
const SampleImageURLSchema = z.object({
	sample_s: z.object({
		image: z.array(z.string()),
	}),
	sample_l: z
		.object({
			// Changed from required to optional
			image: z.array(z.string()),
		})
		.optional(), // Added `.optional()`
})

// サンプル動画URL用スキーマ
const SampleMovieURLSchema = z.object({
	size_476_306: z.string(),
	size_560_360: z.string(),
	size_644_414: z.string(),
	size_720_480: z.string(),
	pc_flag: z.coerce.number(), // 数値型として定義
	sp_flag: z.coerce.number(), // 数値型として定義
})

// CD情報用スキーマ
const CDInfoSchema = z.object({
	kind: z.string().optional(),
})

// メインのItemスキーマ
export const DMMItemSchema = z.object({
	service_code: z.string(),
	service_name: z.string(),
	floor_code: z.string(),
	floor_name: z.string(),
	category_name: z.string(),
	content_id: z.string(),
	product_id: z.string(),
	title: z.string(),
	volume: z.string().optional(),
	number: z.string().optional(),
	review: z
		.object({
			count: z.coerce.number(), // 数値型として定義
			average: z.coerce.number(), // 数値型として定義
		})
		.optional()
		.nullable(),
	URL: z.string(),
	affiliateURL: z.string(),
	imageURL: ImageURLSchema.optional().nullable(),
	tachiyomi: z
		.object({
			URL: z.string(),
			affiliateURL: z.string(),
		})
		.optional()
		.nullable(),
	sampleImageURL: SampleImageURLSchema.optional().nullable(),
	sampleMovieURL: SampleMovieURLSchema.optional().nullable(),
	prices: z
		.object({
			price: z.string(),
			list_price: z.string(),
			deliveries: z.object({
				delivery: z.array(
					z.object({
						type: z.string(),
						price: z.string(),
						list_price: z.string(),
					}),
				),
			}),
		})
		.optional()
		.nullable(),
	date: z.string().optional().nullable(),
	iteminfo: ItemInfoSchema.optional().nullable(),
	cdinfo: CDInfoSchema.optional().nullable(),
	jancode: z.string().optional().nullable(),
	maker_product: z.string().optional().nullable(),
	isbn: z.string().optional().nullable(),
	stock: z.string().optional().nullable(),
	directory: z
		.array(
			z.object({
				id: z.coerce.number(), // 数値型として定義
				name: z.string(),
			}),
		)
		.optional()
		.nullable(),
	campaign: z.array(CampaignSchema).optional().nullable(),
	db_id: z.coerce.number(), // 数値型として定義
})

// キャンペーンアイテムのリストを取得するスキーマ
export const GetKVCampaignItemsResponseSchema = z.object({
	items: z.array(DMMItemSchema),
	createdAt: z.string(),
})

// キャンペーン名のリストを取得するスキーマ
export const GetKVCampaignNamesResponseSchema = z.object({
	campaignNames: z.array(z.string()),
})

// エラーレスポンスのスキーマ
export const ErrorResponseSchema = z.object({
	error: z.string(),
	message: z.string().optional(),
})

// TypeScript型定義
export type DMMCampaignItem = z.infer<typeof DMMItemSchema>
export type GetKVCampaignNamesResponse = z.infer<typeof GetKVCampaignNamesResponseSchema>
export type GetKVCampaignItemsResponse = z.infer<typeof GetKVCampaignItemsResponseSchema>
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>
