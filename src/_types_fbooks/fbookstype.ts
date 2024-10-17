import { UmamiTrackingFromType } from '@/types/umamiTypes'

import { z } from 'zod'

// DMM APIのレスポンス型をzodスキーマで定義
// TODO 検証必要
const RawFbooksItemSchema = z.object({
	content_id: z.string(),
	title: z.string(),
	volume: z.string().nullable(),
	review_count: z.string().nullable(),
	review_average: z.string().nullable(),
	affiliateURL: z.string().nullable(),
	date: z.string().nullable(),
	prices: z.string().nullable(),
	imageURL: z
		.object({
			list: z.string().url(),
			large: z.string().url(),
		})
		.nullable(),
	comic_number: z.string().nullable(),
	tachiyomi: z.string().url().nullable(),
	genre_names: z.array(z.string()).optional().nullable(),
	series_names: z.array(z.string()).optional().nullable(),
	manufacture_names: z.array(z.string()).optional().nullable(),
	author_names: z.array(z.string()).optional().nullable(),
	created_at: z.string().optional(),
	updated_at: z.string().optional(),
})

// RawFbooksItem 型定義
export type FbooksItem = z.infer<typeof RawFbooksItemSchema>

export const FetchFbooksItemSchema = RawFbooksItemSchema.omit({
	comic_number: true,
	tachiyomi: true,
	created_at: true,
	updated_at: true,
}).extend({
	sample_images: z.array(z.string()).nullish().optional(),
})

export type FetchFbooksItem = z.infer<typeof FetchFbooksItemSchema>
export type FbooksTopItem = z.infer<typeof FetchFbooksItemSchema>

export type FbooksKobetuItem = z.infer<typeof FetchFbooksItemSchema>

// APIレスポンスのスキーマを定義
export const FbooksTopApiResponseSchema = z.object({
	result: z.object({
		items: z.array(FetchFbooksItemSchema),
	}),
})

export type FbooksTopApiResponse = z.infer<typeof FbooksTopApiResponseSchema>

export interface FbooksGenrePaginationProps {
	db_id: number
	content_id: string
	package_images: string
	title: string
}

export type FbooksItemType = 'newrank' | 'newrelease' | 'review' | 'sale'

// PackageImages schema
export const PackageImagesSchema = z.object({
	list: z.string().url(),
	large: z.string().url(),
})

// Timeline item schema
export const TimelineItemSchema = z.object({
	id: z.number(),
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
