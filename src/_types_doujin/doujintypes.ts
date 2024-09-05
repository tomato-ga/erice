import { z } from 'zod'

// 基本的なDoujinアイテムのスキーマ
const DoujinBaseItemSchema = z.object({
	content_id: z.string(),
	title: z.string(),
	affiliateURL: z.string(),
	imageURL: z.object({
		list: z.string(),
		small: z.string(),
		large: z.string(),
	}),
	sampleImageURL: z.object({
		sample_s: z.object({
			image: z.array(z.string()),
		}),
		sample_l: z.object({
			image: z.array(z.string()),
		}),
	}),
	price: z.string().nullable().optional(),
	// doujin specific properties
	maker: z.string(),
	author: z.string(),
	genres: z.array(z.string()),
	release_date: z.string(),
	review: z.object({
		count: z.number(),
		average: z.number(),
	}),
})

/////////////////// 商品個別ページのfetch用スキーマ /////////////////////
export const DoujinItemMainResponseSchema = z.object({
	content_id: z.string(),
	affiliateURL: z.string().url(),
	sampleImageURL: DoujinBaseItemSchema.shape.sampleImageURL,
	imageURL: DoujinBaseItemSchema.shape.imageURL,
	title: z.string(),
})

export type DoujinItemMainResponse = z.infer<typeof DoujinItemMainResponseSchema>

/////////////////// 商品詳細ページのfetch用スキーマ /////////////////////
export const DoujinItemDetailResponseSchema = z.object({
	release_date: z.string().nullable().optional(),
	price: z.string().nullable().optional(),
	maker: z.string().nullable().optional(),
	author: z.string().nullable().optional(),
	genres: z.array(z.string()).nullable().optional(),
})

export type DoujinItemDetailResponse = z.infer<typeof DoujinItemDetailResponseSchema>

/////////////////// 商品詳細ページのfetch用スキーマ /////////////////////

// セールアイテム特有のプロパティ
const DoujinSaleItemExtraSchema = z.object({
	salecount: z.string().nullable().optional(),
	salePrice: z.string().nullable().optional(),
	rate: z.string().nullable().optional(),
	listprice: z.string().nullable().optional(),
})

// 全てのDoujinアイテムに対応するスキーマ
export const DoujinItemSchema = DoujinBaseItemSchema.merge(DoujinSaleItemExtraSchema.partial())

export type DoujinItem = z.infer<typeof DoujinItemSchema>

// DoujinItemProps型定義
export interface DoujinItemProps extends DoujinItem {
	db_id: string
}

// DoujinページのAPIレスポンス
export interface DoujinApiResponse {
	items: DoujinItem[]
}
