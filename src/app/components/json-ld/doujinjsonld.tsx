import { Stats } from '@/_types_dmm/statstype'
import { DoujinKobetuItem } from '@/_types_doujin/doujintypes'
import { FbooksKobetuItem } from '@/_types_fbooks/fbookstype'
import { DMMActressProfile } from '@/types/APItypes'
import { GetKVTop100Response } from '@/types/dmm-keywordpage-types'
import { DMMItemDetailResponse, DMMItemMainResponse } from '@/types/dmmitemzodschema'
import { DMMItemJsonLDProps, DMMItemProps } from '@/types/dmmtypes'
import {
	AggregateRating,
	Article,
	BreadcrumbList,
	CreativeWork,
	ImageObject,
	ListItem,
	Organization,
	Person,
	Review,
	Thing,
	VideoObject,
	WithContext,
} from 'schema-dts'
import { ReviewData } from '../dmmcomponents/DMMActressRegression'
import { fetchSeriesStats } from '../dmmcomponents/fetch/itemFetchers'

export const generateDoujinKobetuItemStructuredData = async (
	item: DoujinKobetuItem,
	description: string,
): Promise<WithContext<Article>> => {
	// メイン画像をImageObjectとして定義
	const mainImage: ImageObject = {
		'@type': 'ImageObject',
		url: item.package_images || '',
		description: `${item.title}のパッケージ画像`,
	}

	// サンプル画像をImageObjectとして定義
	const sampleImages: ImageObject[] =
		item.sample_images?.map((url, index) => ({
			'@type': 'ImageObject',
			url: url ?? '', // Provide an empty string as fallback
			description: `${item.title}の画像${index + 1}`,
		})) ?? []

	// 全ての画像を統合
	const allImages: ImageObject[] = [mainImage, ...sampleImages]

	// 固定のAuthorデータ
	const author: Person = {
		'@type': 'Person',
		name: 'エロコメスト管理人',
		url: 'https://erice.cloud',
	}

	// 日付のフォーマット
	const formattedDate = item.release_date
		? new Date(item.release_date).toISOString()
		: new Date().toISOString()

	// aboutフィールドの生成
	const aboutData: Thing[] = []

	// シリーズデータの追加
	if (item.series && item.series.length > 0) {
		const statsResponse = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/api/doujin-series-stats?series_id=${item.series[0].id}`,
			{
				cache: 'force-cache',
			},
		)
		const stats = await statsResponse.json()
		const seriesStructuredData = generateSeriesAndMakerArticleStructuredData(
			stats,
			item.series[0].name,
			'series',
			item.package_images || '',
		)
		if (seriesStructuredData) {
			aboutData.push(seriesStructuredData)
		}
	}

	// メーカーデータの追加
	if (item.makers && item.makers.length > 0) {
		const statsResponse = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/api/doujin-maker-stats?maker_id=${item.makers[0].id}`,
			{
				cache: 'force-cache',
			},
		)
		const stats = await statsResponse.json()
		const makerStructuredData = generateSeriesAndMakerArticleStructuredData(
			stats,
			item.makers[0].name,
			'maker',
			item.package_images || '',
		)
		if (makerStructuredData) {
			aboutData.push(makerStructuredData)
		}
	}

	// Articleスキーマの生成
	return {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: item.title,
		image: allImages,
		datePublished: formattedDate,
		author: author,
		description: description,
		mainEntityOfPage: `https://erice.cloud/doujin/itemd/${item.db_id}`,
		...(item.genres && { keywords: item.genres.map(genre => genre.name).join(', ') }),
		...(aboutData.length > 0 && { about: aboutData }), // シリーズとメーカーのデータを追加
	}
}

// 同人誌アイテム用のBreadcrumbListを生成する関数
export const generateDoujinBreadcrumbList = (
	item: DoujinKobetuItem,
): WithContext<BreadcrumbList> => {
	const itemListElement: ListItem[] = [
		{
			'@type': 'ListItem',
			position: 1,
			name: 'ホーム',
			item: 'https://erice.cloud/',
		},
		{
			'@type': 'ListItem',
			position: 2,
			name: '同人トップページ',
			item: 'https://erice.cloud/doujin/',
		},
	]

	if (item.makers && item.makers.length > 0) {
		itemListElement.push({
			'@type': 'ListItem',
			position: 3,
			name: item.makers[0].name,
			item: `https://erice.cloud/doujin/maker/${encodeURIComponent(item.makers[0].name)}`,
		})
	}

	itemListElement.push({
		'@type': 'ListItem',
		position: item.makers && item.makers.length > 0 ? 4 : 3,
		name: item.title,
		item: `https://erice.cloud/doujin/itemd/${item.db_id}`,
	})

	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement,
	}
}

export const generateSeriesAndMakerArticleStructuredData = (
	stats: Stats,
	name: string,
	seriesormaker: string,
	itemImage?: string,
): WithContext<Article> | null => {
	if (!stats?.metadata) {
		console.warn('Series metadata is missing')
		return null
	}

	const { metadata } = stats

	let ldname: string
	switch (seriesormaker) {
		case 'series':
			ldname = '「' + name + '」' + 'シリーズ'
			break
		case 'maker':
			ldname = 'サークル' + '「' + name + '」'
			break
		default:
			ldname = name
	}

	const aggregateRatingData: AggregateRating = {
		'@type': 'AggregateRating',
		ratingValue: Number.parseFloat(metadata.overall_review_average?.toFixed(2)) || 0,
		reviewCount: metadata.total_review_count || 0,
		bestRating: 5,
		worstRating: 1,
		itemReviewed: {
			'@type': 'CreativeWorkSeries',
			name: ldname,
		},
	}

	const popularItemsData =
		stats.metadata?.top_3_popular_items?.map(item => ({
			'@type': 'CreativeWork',
			name: item?.title || 'N/A',
			aggregateRating: {
				'@type': 'AggregateRating',
				ratingValue: item?.review_average?.toFixed(2) || '0',
				reviewCount: item?.review_count || 0,
			},
			datePublished: item?.release_date,
			description: item?.description,
		})) || []

	// 統計データと人気作品情報を ldDescription に追加
	let ldDescription = `${ldname}の平均評価は${metadata.review_average.toFixed(
		2,
	)}、中央値は${metadata.review_median.toFixed(2)}、標準偏差は${metadata.review_std_dev.toFixed(
		2,
	)}です。総レビュー数は${metadata.total_review_count}件で、総合平均評価は${metadata.overall_review_average.toFixed(
		2,
	)}です。`

	// トップ3人気作品の情報を追加
	if (popularItemsData.length > 0) {
		const topItemsDescription = popularItemsData
			.map(
				item =>
					`${item.name}（評価: ${item.aggregateRating.ratingValue}、レビュー数: ${item.aggregateRating.reviewCount}）`,
			)
			.join('、')
		ldDescription += ` 特に人気の高い作品は次の通りです: ${topItemsDescription}。`
	}

	const articleStructuredData: WithContext<Article> = {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: `${ldname}のレビュー統計データ`,
		description: ldDescription,
		author: {
			'@type': 'Person',
			name: 'エロコメスト管理人',
			url: 'https://erice.cloud',
		},
		image: itemImage || '',
		mainEntityOfPage: `https://erice.cloud/series/${encodeURIComponent(ldname)}`,
		mainEntity: {
			'@type': 'CreativeWorkSeries',
			name: ldname,
		},
		aggregateRating: aggregateRatingData, // Article に aggregateRating を移動
	}

	return articleStructuredData
}
