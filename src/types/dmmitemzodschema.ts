// /Volumes/SSD_1TB/erice2/erice/types/dmmitemzodschema.ts

import { z } from 'zod'

// 基本的なDMMアイテムのスキーマ
const DMMBaseItemSchema = z.object({
	content_id: z.string(),
	title: z.string(),
	affiliateURL: z.string(),
	imageURL: z.string(),
	sampleImageURL: z.array(z.string()).nullable().optional(),
	sampleMovieURL: z.array(z.string()).nullable().optional(),
	price: z.string().nullable().optional(),
	actress: z.string().nullable().optional(),
	genre: z.array(z.string()).nullable().optional(),
	date: z.string().nullable().optional(),
	actress_id: z.number().nullable().optional()
})

/////////////////// 商品個別ページのfetch用スキーマ /////////////////////
export const DMMItemMainResponseSchema = z.object({
	content_id: z.string(),
	affiliateURL: z.string().url(),
	sampleImageURL: z.array(z.string()).nullable().optional(),
	sampleMovieURL: z.array(z.string()).nullable().optional(),
	imageURL: z.string().url(),
	title: z.string()
})

export type DMMItemMainResponse = z.infer<typeof DMMItemMainResponseSchema>

/////////////////// 商品詳細ページのfetch用スキーマ /////////////////////

/////////////////// 商品詳細ページのfetch用スキーマ /////////////////////
export const DMMItemDetailResponseSchema = z.object({
	date: z.string().nullable().optional(),
	price: z.string().nullable().optional(),
	actress: z.string().nullable().optional(),
	genre: z.array(z.string()).nullable().optional(),
	director: z.array(z.string()).nullable().optional(),
	label: z.array(z.string()).nullable().optional(),
	series: z.array(z.string()).nullable().optional(),
	maker: z.array(z.string()).nullable().optional()
})

export type DMMItemDetailResponse = z.infer<typeof DMMItemDetailResponseSchema>

/////////////////// 商品詳細ページのfetch用スキーマ /////////////////////

// セールアイテム特有のプロパティ
const DMMSaleItemExtraSchema = z.object({
	salecount: z.string().nullable().optional(),
	salePrice: z.string().nullable().optional(),
	rate: z.string().nullable().optional(),
	listprice: z.string().nullable().optional()
})

const DMMItemInfo = z.object({
	maker: z
		.union([z.string(), z.array(z.string())])
		.nullable()
		.optional(),
	label: z
		.union([z.string(), z.array(z.string())])
		.nullable()
		.optional(),
	series: z
		.union([z.string(), z.array(z.string())])
		.nullable()
		.optional(),
	director: z
		.union([z.string(), z.array(z.string())])
		.nullable()
		.optional()
})

// 全てのDMMアイテムに対応するスキーマ
export const DMMItemSchema = DMMBaseItemSchema.merge(DMMSaleItemExtraSchema.partial()).merge(DMMItemInfo)

export type DMMItem = z.infer<typeof DMMItemSchema>

// 特定のアイテムタイプに対応するスキーマ
export const DMMTodayNewItemSchema = DMMBaseItemSchema.merge(DMMItemInfo.partial())
export const DMMDebutItemSchema = DMMBaseItemSchema.merge(DMMItemInfo.partial())
export const DMMFeatureItemSchema = DMMBaseItemSchema.merge(DMMItemInfo.partial())
export const DMMSaleItemSchema = DMMBaseItemSchema.merge(DMMSaleItemExtraSchema)

export type DMMTodayNewItem = z.infer<typeof DMMTodayNewItemSchema>
export type DMMDebutItem = z.infer<typeof DMMDebutItemSchema>
export type DMMFeatureItem = z.infer<typeof DMMFeatureItemSchema>
export type DMMSaleItem = z.infer<typeof DMMSaleItemSchema>
