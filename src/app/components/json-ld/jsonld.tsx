// src/utils/jsonld.ts

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

export const generateIndependentStatsStructuredData = (
	actressName: string,
	actressStats: Stats,
): WithContext<Article> => {
	if (!actressStats || !actressStats.metadata) {
		console.warn('No actress stats available.')
		return {} as WithContext<Article>
	}

	// 正しいプロパティを使用
	const { review_average, total_review_count, top_3_popular_items } = actressStats.metadata

	return {
		'@context': 'https://schema.org',
		'@type': 'Article', // Articleとして定義
		headline: `${actressName}さんのレビュー統計`,
		author: {
			'@type': 'Person',
			name: actressName,
		},
		description: `${actressName}さんの作品に基づく統計データ`,
		aggregateRating: {
			'@type': 'AggregateRating',
			ratingValue: review_average.toFixed(2),
			ratingCount: total_review_count,
			bestRating: '5',
			worstRating: '1',
		},
		// 'review'プロパティは削除、または適切な'IdReference | Review | Role'を使用する
	}
}

// BreadcrumbListを生成する関数
export const generateBreadcrumbList = (
	dbId: number,
	itemDetail?: DMMItemDetailResponse,
): WithContext<BreadcrumbList> => {
	const itemListElement: ListItem[] = [
		{
			'@type': 'ListItem',
			position: 1,
			name: 'ホーム',
			item: 'https://erice.cloud/',
		},
	]

	if (itemDetail?.actress) {
		itemListElement.push({
			'@type': 'ListItem',
			position: 2,
			name: itemDetail.actress,
			item: `https://erice.cloud/actressprofile/${encodeURIComponent(itemDetail.actress)}`,
		})
	}

	itemListElement.push({
		'@type': 'ListItem',
		position: itemDetail?.actress ? 3 : 2,
		name: 'アイテム詳細',
		item: `https://erice.cloud/item/${dbId}`,
	})

	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement,
	}
}

// Articleを生成する関数
export const generateArticleStructuredData = async (
	itemMain: DMMItemMainResponse,
	itemDetail: DMMItemDetailResponse,
	description: string,
	dbId: number,
	actressProfiles: DMMActressProfile[] | null,
): Promise<WithContext<Article>> => {
	// itemMain.imageURLをImageObjectとして定義
	const mainImage: ImageObject = {
		'@type': 'ImageObject',
		url: itemMain.imageURL,
		description: `${itemMain.title}のメイン画像`,
	}

	// relatedImagesをImageObjectとして定義
	const relatedImages: ImageObject[] =
		itemMain.sampleImageURL?.map((url, index) => ({
			'@type': 'ImageObject',
			url: url,
			description: `${itemMain.title}の画像${index + 1}`,
		})) || []

	// 全画像を統合
	const allImages: ImageObject[] = [mainImage, ...relatedImages]

	// VideoObject（存在する場合）
	const videoObject: VideoObject | undefined =
		itemMain.sampleMovieURL && itemMain.sampleMovieURL.length > 0
			? {
					'@type': 'VideoObject',
					name: `${itemMain.content_id} ${itemMain.title}`,
					description: description,
					thumbnailUrl: itemMain.imageURL,
					uploadDate: itemDetail.date
						? (() => {
								const [datePart, timePart] = itemDetail.date.split(' ')
								const [year, month, day] = datePart.split('-')
								const [hour, minute, second] = timePart.split(':')
								return `${year}-${month}-${day}T${hour}:${minute}:${second}+09:00`
							})()
						: new Date().toISOString(),
					contentUrl: itemMain.sampleMovieURL[0],
					embedUrl: itemMain.sampleMovieURL[0],
					actor: itemDetail.actress ? { '@type': 'Person', name: itemDetail.actress } : undefined,
				}
			: undefined

	// 固定のAuthorデータ
	const author: Person = {
		'@type': 'Person',
		name: 'エロコメスト管理人',
		url: 'https://erice.cloud',
	}

	// 女優情報
	let actressData: WithContext<Person>[] | null = null
	if (actressProfiles && actressProfiles.length > 0) {
		// 各女優プロフィールに対してActressStatsをフェッチし、構造化データを生成
		const actressPersonDataPromises = actressProfiles.map(async profile => {
			const actressStats = await fetchActressStats(profile.actress.id)
			return generatePersonStructuredData(profile, description, actressStats)
		})

		// 全てのPromiseを解決
		const actressPersonDataResults = await Promise.all(actressPersonDataPromises)

		// 有効なデータのみをフィルタリング
		const validActressPersonData = actressPersonDataResults.filter(
			data => data !== null,
		) as WithContext<Person>[]

		if (validActressPersonData.length > 0) {
			actressData = validActressPersonData
		} else {
			console.warn('All actress profiles are incomplete or missing.')
		}
	}

	// directorデータの生成
	const directors: Person[] | undefined = itemDetail.director
		? itemDetail.director.map(directorName => ({
				'@type': 'Person',
				name: directorName,
			}))
		: undefined

	// articleSection と keywords を定義（itemDetail.genreが存在する場合）
	const articleSection: string | undefined = itemDetail.genre?.join(', ')
	const keywords: string | undefined = itemDetail.genre?.join(', ')

	// Articleスキーマの生成
	const articleStructuredData: WithContext<Article> = {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: `${itemMain.title} ${itemMain.content_id} `,
		image: allImages, // ImageObject の配列
		datePublished: itemDetail.date
			? (() => {
					const [datePart, timePart] = itemDetail.date.split(' ')
					const [year, month, day] = datePart.split('-')
					const [hour, minute, second] = timePart.split(':')
					return `${year}-${month}-${day}T${hour}:${minute}:${second}+09:00`
				})()
			: new Date().toISOString(),
		author: author,
		...(directors && { director: directors }), // 監督情報がある場合に追加
		description: description,
		mainEntityOfPage: `https://erice.cloud/item/${dbId}`,
		...(videoObject && { video: videoObject }), // VideoObjectが存在する場合のみ追加
		// ...(articleSection && { articleSection: articleSection }), // コメントアウトされている場合は不要
		...(keywords && { keywords: keywords }),
		...(actressData && { about: actressData }), // 女優のPerson構造化データを追加
	}

	return articleStructuredData
}

export const generatePersonStructuredData = (
	actressProfile: DMMActressProfile,
	description: string,
	data?: Stats | null,
	predictedReview?: number,
	nextMovieData?: ReviewData,
): WithContext<Person> | null => {
	const actress = actressProfile.actress
	if (!actress) {
		console.warn('Actress data is missing in actressProfile:', actressProfile)
		return null
	}

	const actressImage = actress.image_url_large || actress.image_url_small || null

	const structuredData: WithContext<Person> = {
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: actress.name,
		birthDate: actress.birthday || undefined,
		height: actress.height ? `${actress.height}` : undefined,
		description: description,
		sameAs: actress.list_url || undefined,
		image: actressImage || undefined,
	}

	let statsDescription = ''

	if (data?.metadata) {
		const { metadata } = data

		statsDescription += ` ${actress.name}さんは、平均評価${metadata.review_average.toFixed(
			2,
		)}、中央値${metadata.review_median.toFixed(2)}、標準偏差${metadata.review_std_dev.toFixed(
			2,
		)}です。全レビュー数は${metadata.total_review_count}件で、総合平均評価は${metadata.overall_review_average.toFixed(
			2,
		)}です。`

		// トップ3作品の情報を追加
		if (metadata.top_3_popular_items && metadata.top_3_popular_items.length > 0) {
			const topItemsDescription = metadata.top_3_popular_items
				.filter(item => item)
				.map(
					item =>
						`${item?.title}（評価: ${item?.review_average.toFixed(
							2,
						)}、レビュー数: ${item?.review_count}）`,
				)
				.join('、')
			statsDescription += ` 特に人気の高い作品は次の通りです: ${topItemsDescription}。`
		}
	}

	// レビュー予測データを追加
	if (predictedReview !== undefined && nextMovieData) {
		statsDescription += ` 次回作の予測レビュー平均点は ${predictedReview.toFixed(2)} 点です。`

		// 詳細な要因を記述
		statsDescription += ` 評価バランス平均: ${nextMovieData.weightedAverage.toFixed(
			2,
		)}、標準偏差: ${nextMovieData.stdDev.toFixed(2)}、レビュー数: ${
			nextMovieData.reviewCount
		} 件、過去作品の平均スコア: ${
			nextMovieData.previousItemScores.length > 0
				? (
						nextMovieData.previousItemScores.reduce((a, b) => a + b, 0) /
						nextMovieData.previousItemScores.length
					).toFixed(2)
				: 'データなし'
		}。`
	}

	// description に統計データとレビュー予測を含める
	structuredData.description += statsDescription

	return structuredData
}

// fetchActressStats 関数
export const fetchActressStats = async (actressId: number): Promise<Stats | null> => {
	try {
		const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/dmm-actress-stats?actress_id=${actressId}`
		const response = await fetch(apiUrl)
		if (!response.ok) {
			console.warn('Failed to fetch actress stats:', response.status)
			return null
		}
		return (await response.json()) as Stats
	} catch (error) {
		console.error('Error fetching actress stats:', error)
		return null
	}
}

// 女優ページの構造化データを生成する関数

export const generateActressArticleStructuredData = async (
	h1: string,
	description: string,
	profile: DMMActressProfile,
	actressStats: Stats,
	predictedReview: number,
	nextMovieData: ReviewData,
): Promise<WithContext<Article>> => {
	const author: Person = {
		'@type': 'Person',
		name: 'エロコメスト管理人',
		url: 'https://erice.cloud',
	}

	const actressPersonData = generatePersonStructuredData(
		profile,
		description,
		actressStats,
		predictedReview,
		nextMovieData,
	)

	const mainEntity = actressPersonData ?? undefined

	const aggregateRatingData: AggregateRating = {
		'@type': 'AggregateRating',
		ratingValue: actressStats.metadata
			? actressStats.metadata?.overall_review_average?.toFixed(2)
			: '0',
		reviewCount: actressStats.metadata ? actressStats.metadata?.total_review_count : 0,
		bestRating: '5',
		worstRating: '1',
	}

	const articleStructuredData: WithContext<Article> = {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: h1,
		image: [profile.actress.image_url_large || profile.actress.image_url_small || ''],
		author: author,
		description: description,
		mainEntityOfPage: `https://erice.cloud/actressprofile/${encodeURIComponent(profile.actress.name)}`,
		mainEntity: mainEntity,
		aggregateRating: aggregateRatingData,
	}

	return articleStructuredData
}

// 女優のレビュー予測専用のPerson構造化データを生成する関数
export const generateReviewPredictionStructuredData = (
	actressName: string,
	predictedReview: number,
	nextMovieData: ReviewData,
): WithContext<Person> | null => {
	const structuredData: WithContext<Person> = {
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: actressName,
		description: `${actressName}さんの次回作の予測レビュー平均点は ${predictedReview.toFixed(2)} 点です。`,
	}

	// レビュー予測に関連する追加情報
	structuredData.description += `
        レビュー予測は以下の要素を考慮しています。評価バランス平均: ${nextMovieData.weightedAverage.toFixed(2)},標準偏差: ${nextMovieData.stdDev.toFixed(2)},レビュー数: ${nextMovieData.reviewCount} 件,過去作品の平均スコア: ${
					nextMovieData.previousItemScores.length > 0
						? (
								nextMovieData.previousItemScores.reduce((a, b) => a + b, 0) /
								nextMovieData.previousItemScores.length
							).toFixed(2)
						: 'データなし'
				}
    `.trim()

	return structuredData
}

/**
 * アクターのプロフィールページ専用の構造化データを生成する関数
 * @param actressName 女優の名前
 * @param actressStats 女優の統計データ
 * @param profile 女優のプロフィールデータ
 * @param predictedReview 次回作の予測レビュー
 * @returns 複数のスキーマオブジェクトを含む配列
 */

export const generateActressProfileStructuredData = (
	actressName: string,
	actressStats: Stats,
	profile: DMMActressProfile,
	predictedReview: number,
): WithContext<Thing>[] => {
	const actress = profile.actress
	if (!actress || !actressStats.metadata) {
		console.warn('Actress data or metadata is missing in profile:', profile, actressStats)
		return []
	}

	const { metadata } = actressStats

	const structuredData: WithContext<Thing>[] = []

	// 1. Personオブジェクト
	const person: WithContext<Person> = {
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: actress.name,
		birthDate: actress.birthday || undefined,
		height: actress.height ? `${actress.height}` : undefined,
		description: `セクシー女優${actress.name}さんのプロフィールと作品一覧、レビュー統計データを見ることができるページです。`,
		sameAs: actress.list_url || undefined,
		image: actress.image_url_large || actress.image_url_small || undefined,
	}
	structuredData.push(person)

	// 2. AggregateRatingオブジェクト
	const aggregateRating: AggregateRating = {
		'@type': 'AggregateRating',
		itemReviewed: {
			'@type': 'Person',
			name: actress.name,
			sameAs: actress.list_url || undefined,
		},
		ratingValue: Number.parseFloat(metadata.overall_review_average.toFixed(2)),
		reviewCount: metadata.total_review_count,
		bestRating: 5,
		worstRating: 0,
		description: `中央値: ${Number.parseFloat(metadata.review_median.toFixed(2))}, 標準偏差: ${Number.parseFloat(metadata.review_std_dev.toFixed(2))}`,
	}
	const aggregateRatingWithContext: WithContext<AggregateRating> = {
		'@context': 'https://schema.org',
		...aggregateRating,
	}
	structuredData.push(aggregateRatingWithContext)

	// 3. Reviewオブジェクト（予測レビュー）
	const avgPreviousItemScore =
		metadata.top_3_popular_items.length > 0
			? Number.parseFloat(
					(
						metadata.top_3_popular_items.reduce((sum, item) => {
							return item ? sum + (item.review_average || 0) : sum
						}, 0) / metadata.top_3_popular_items.length
					).toFixed(2),
				)
			: 0

	const review: Review = {
		'@type': 'Review',
		author: {
			'@type': 'Person',
			name: 'エロコメスト管理人',
		},
		reviewBody: `${actress.name}さんの次回作の予測レビュー平均点は ${predictedReview.toFixed(2)} 点です。 評価バランス平均: ${metadata.weighted_average.toFixed(2)}, 標準偏差: ${metadata.review_std_dev.toFixed(2)}, レビュー数: ${metadata.total_review_count} 件, 過去作品の平均スコア: ${avgPreviousItemScore > 0 ? avgPreviousItemScore.toFixed(2) : 'データなし'}`,
		reviewRating: {
			'@type': 'Rating',
			ratingValue: Number.parseFloat(predictedReview.toFixed(2)),
			bestRating: 5,
			worstRating: 0,
		},
		itemReviewed: {
			'@type': 'Person',
			name: actress.name,
			sameAs: actress.list_url || undefined,
		},
	}

	const reviewWithContext: WithContext<Review> = {
		'@context': 'https://schema.org',
		...review,
	}
	structuredData.push(reviewWithContext)

	// 4. CreativeWorkオブジェクト（トップ3作品）
	const top3Items = metadata.top_3_popular_items.filter(item => item != null)
	for (const item of top3Items) {
		// 追加の null チェック（念のため）
		if (!item) {
			console.warn('Top popular item is null or undefined:', item)
			continue
		}

		const creativeWork: CreativeWork = {
			'@type': 'CreativeWork',
			name: item.title,
			aggregateRating: {
				'@type': 'AggregateRating',
				ratingValue: Number.parseFloat(item.review_average.toFixed(2)),
				reviewCount: item.review_count,
				bestRating: 5,
				worstRating: 0,
			},
		}

		const creativeWorkWithContext: WithContext<CreativeWork> = {
			'@context': 'https://schema.org',
			...creativeWork,
		}
		structuredData.push(creativeWorkWithContext)
	}

	return structuredData
}

export const generateDoujinKobetuItemStructuredData = (
	item: DoujinKobetuItem,
	description: string,
): WithContext<Article> => {
	// メイン画像をImageObjectとして定義
	const mainImage: ImageObject = {
		'@type': 'ImageObject',
		url: item.package_images,
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

// キーワードページ用の Article 構造化データ生成関数
export const generateKeywordArticleStructuredData = (
	keyword: string,
	data: GetKVTop100Response,
	description: string,
): WithContext<Article> => {
	const currentYear = new Date(data.createdAt).getFullYear()
	const decodedKeyword = decodeURIComponent(keyword)

	return {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: `【${currentYear}年最新】${decodedKeyword} の人気エロ動画を厳選して${data.items.length}件集めました`,
		description: description,
		author: {
			'@type': 'Person',
			name: 'エロコメスト管理人',
			url: 'https://erice.cloud',
		},
		datePublished: new Date(data.createdAt).toISOString(),
		dateModified: new Date(data.createdAt).toISOString(),
		image: data.items.slice(0, 3).map(item => item.imageURL?.large || ''),
		mainEntityOfPage: `https://erice.cloud/keywords/${encodeURIComponent(decodedKeyword)}`,
	}
}

// キーワードページ用の BreadcrumbList 構造化データ生成関数
export const generateKeywordBreadcrumbList = (keyword: string): WithContext<BreadcrumbList> => {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{
				'@type': 'ListItem',
				position: 1,
				name: 'ホーム',
				item: 'https://erice.cloud/',
			},
			{
				'@type': 'ListItem',
				position: 2,
				name: 'エロ動画キーワード一覧',
				item: 'https://erice.cloud/keywords',
			},
			{
				'@type': 'ListItem',
				position: 3,
				name: `${keyword} の人気エロ動画`,
				item: `https://erice.cloud/keywords/${encodeURIComponent(keyword)}`,
			},
		],
	}
}

export const generateGenreArticleStructuredData = (
	genreName: string,
	currentPage: number,
	items: DMMItemJsonLDProps[],
	description: string,
): WithContext<Article> => {
	const currentYear = new Date().getFullYear()

	return {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: `【${currentYear}年最新】${genreName} の人気エロ動画を紹介しています。${
			currentPage > 1 ? ` - ページ ${currentPage}` : ''
		}`,
		description: description,
		author: {
			'@type': 'Person',
			name: 'エロコメスト管理人',
			url: 'https://erice.cloud',
		},
		datePublished: new Date().toISOString(),
		dateModified: new Date().toISOString(),
		image: items[0]?.priorityImageURL || '',
		mainEntityOfPage: `https://erice.cloud/genre/${encodeURIComponent(genreName)}${
			currentPage > 1 ? `/page/${currentPage}` : ''
		}`,
	}
}

// ジャンルページ用の BreadcrumbList 構造化データ生成関数
export const generateGenreBreadcrumbList = (
	genreName: string,
	currentPage: number,
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
			name: 'エロ動画ジャンル一覧',
			item: 'https://erice.cloud/genre-name',
		},
		{
			'@type': 'ListItem',
			position: 3,
			name: `${genreName}`,
			item: `https://erice.cloud/genre/${encodeURIComponent(genreName)}`,
		},
	]

	if (currentPage > 1) {
		itemListElement.push({
			'@type': 'ListItem',
			position: 4,
			name: `ページ ${currentPage}`,
			item: `https://erice.cloud/genre/${encodeURIComponent(genreName)}/page/${currentPage}`,
		})
	}

	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement,
	}
}

export const generateFbooksKobetuItemStructuredData = (
	item: FbooksKobetuItem,
	description: string,
): WithContext<Article> => {
	// メイン画像をImageObjectとして定義
	const mainImage: ImageObject = {
		'@type': 'ImageObject',
		url: item.imageURL?.large || '',
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
	const formattedDate = item.date ? new Date(item.date).toISOString() : new Date().toISOString()

	// Articleスキーマの生成
	return {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: item.title,
		image: allImages,
		datePublished: formattedDate,
		author: author,
		description: description,
		mainEntityOfPage: `https://erice.cloud/doujin/itemd/${item.content_id}`,
		...(item.genre_names && { keywords: item.genre_names.join(', ') }),
	}
}

// 同人誌アイテム用のBreadcrumbListを生成する関数
export const generateFbooksBreadcrumbList = (
	item: FbooksKobetuItem,
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
			name: 'エロ漫画トップページ',
			item: 'https://erice.cloud/fbooks/',
		},
	]

	if (item.manufacture_names && item.manufacture_names.length > 0) {
		itemListElement.push({
			'@type': 'ListItem',
			position: 3,
			name: item.manufacture_names[0],
			item: `https://erice.cloud/fbooks/manufacture/${encodeURIComponent(item.manufacture_names[0])}`,
		})
	}

	itemListElement.push({
		'@type': 'ListItem',
		position: item.manufacture_names && item.manufacture_names.length > 0 ? 4 : 3,
		name: item.title,
		item: `https://erice.cloud/fbooks/itemb/${item.content_id}`,
	})

	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement,
	}
}
