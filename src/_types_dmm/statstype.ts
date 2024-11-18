import { z } from 'zod'

// 人気アイテムの型定義
const PopularItemSchema = z
	.object({
		id: z.number(),
		title: z.string(),
		review_average: z.number(),
		review_count: z.number(),
		release_date: z.string(),
		description: z.string().optional(),
	})
	.nullable()

// レビュースコア分布の型定義
const ReviewScoreDistributionSchema = z
	.object({
		histogram: z.array(z.number()),
		frequencies: z.record(z.string(), z.number()),
	})
	.nullable()

// メタデータのスキーマ
const MetadataSchema = z
	.object({
		actress_id: z.number().optional().nullable(),
		series_id: z.number().optional().nullable(),
		maker_id: z.number().optional().nullable(),
		review_average: z.number(),
		review_median: z.number(),
		review_std_dev: z.number(),
		weighted_average: z.number(),
		total_review_count: z.number(),
		overall_review_average: z.number(),
		last_updated: z.string(),
		top_3_popular_items: z.array(PopularItemSchema),
		review_score_distribution: ReviewScoreDistributionSchema,
	})
	.nullable()

// 年間データのボックスプロットスキーマ
const BoxPlotSchema = z
	.object({
		min: z.number(),
		q1: z.number(),
		median: z.number(),
		q3: z.number(),
		max: z.number(),
	})
	.nullable()

// 年間データのスキーマ
const AnnualDataSchema = z
	.object({
		annual_review_average: z.record(z.string(), z.number()),
		annual_review_median: z.record(z.string(), z.number()),
		annual_review_std_dev: z.record(z.string(), z.number()),
		annual_box_plot: z.record(z.string(), BoxPlotSchema),
	})
	.nullable()

// 時系列データのスキーマ
const TimeSeriesDataSchema = z
	.object({
		time_series_review_average: z.array(
			z.object({
				year: z.string(),
				average: z.number(),
			}),
		),
		time_series_analysis: z.object({
			monthly_trends: z.record(z.string(), z.number()),
			quarterly_trends: z.record(z.string(), z.number()),
			cumulative_review_count: z.record(z.string(), z.number()),
		}),
	})
	.nullable()

// 全体のレスポンススキーマ
export const StatsSchema = z.object({
	metadata: MetadataSchema,
	annualData: AnnualDataSchema,
	timeSeriesData: TimeSeriesDataSchema,
})

// 型の抽出
export type Stats = z.infer<typeof StatsSchema>

// スリーサイズのスキーマ
export const ThreeSizeAndHeightSchema = z.object({
	bust: z.number().optional(),
	waist: z.number().optional(),
	hip: z.number().optional(),
	height: z.number().optional(),
})

// 人気作品アイテムのスキーマ
export const ThreeSizePopularItemSchema = z.object({
	id: z.number(),
	title: z.string(),
	review_average: z.number(),
	review_count: z.number(),
	release_date: z.string(),
})

// スリーサイズ検索結果の各アクトレスのスキーマ
export const ThreeSizeActressSchema = z.object({
	id: z.number(),
	name: z.string(),
	bust: z.number(),
	waist: z.number(),
	hip: z.number(),
	size_difference: z.number(),
	top_3_popular_items: z.array(ThreeSizePopularItemSchema),
})

// レスポンス全体のスキーマ
export const ThreeSizeResponseSchema = z.object({
	threeSizeData: z.array(ThreeSizeActressSchema),
})

export type ThreeSizeAndHeight = z.infer<typeof ThreeSizeAndHeightSchema>
export type ThreeSizePopularItem = z.infer<typeof ThreeSizePopularItemSchema>
export type ThreeSizeActress = z.infer<typeof ThreeSizeActressSchema>
export type ThreeSizeResponse = z.infer<typeof ThreeSizeResponseSchema>
