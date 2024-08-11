// /Volumes/SSD_1TB/erice2/erice/types/dmmitemzodschema.ts

import { z } from 'zod'

// 基本的なDMMアイテムのスキーマ
const DMMBaseItemSchema = z.object({
	content_id: z.string(),
	title: z.string(),
	affiliateURL: z.string(),
	imageURL: z.string(),
	sampleImageURL: z.array(z.string()).nullable().optional(),
	price: z.string().nullable().optional(),
	actress: z.string().nullable().optional(),
	genre: z.array(z.string()).nullable().optional(),
	date: z.string().nullable().optional(),
	actress_id: z.number().nullable().optional()
})

// セールアイテム特有のプロパティ
const DMMSaleItemExtraSchema = z.object({
	salecount: z.string().nullable().optional(),
	salePrice: z.string().nullable().optional(),
	rate: z.string().nullable().optional(),
	listprice: z.string().nullable().optional()
})

// 全てのDMMアイテムに対応するスキーマ
export const DMMItemSchema = DMMBaseItemSchema.merge(DMMSaleItemExtraSchema.partial())

export type DMMItem = z.infer<typeof DMMItemSchema>

// 特定のアイテムタイプに対応するスキーマ
export const DMMTodayNewItemSchema = DMMBaseItemSchema
export const DMMDebutItemSchema = DMMBaseItemSchema
export const DMMFeatureItemSchema = DMMBaseItemSchema
export const DMMSaleItemSchema = DMMBaseItemSchema.merge(DMMSaleItemExtraSchema)

export type DMMTodayNewItem = z.infer<typeof DMMTodayNewItemSchema>
export type DMMDebutItem = z.infer<typeof DMMDebutItemSchema>
export type DMMFeatureItem = z.infer<typeof DMMFeatureItemSchema>
export type DMMSaleItem = z.infer<typeof DMMSaleItemSchema>
