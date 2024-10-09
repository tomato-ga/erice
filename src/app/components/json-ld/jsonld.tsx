// src/utils/jsonld.ts

import { DoujinKobetuItem } from '@/_types_doujin/doujintypes'
import { DMMActressProfile } from '@/types/APItypes'
import { GetKVTop100Response } from '@/types/dmm-keywordpage-types'
import { DMMItemDetailResponse, DMMItemMainResponse } from '@/types/dmmitemzodschema'
import { DMMItemJsonLDProps, DMMItemProps } from '@/types/dmmtypes'
import {
	Article,
	BreadcrumbList,
	ImageObject,
	ListItem,
	Organization,
	Person,
	VideoObject,
	WithContext
} from 'schema-dts'

// BreadcrumbListを生成する関数
export const generateBreadcrumbList = (
	dbId: number,
	itemDetail?: DMMItemDetailResponse
): WithContext<BreadcrumbList> => {
	const itemListElement: ListItem[] = [
		{
			'@type': 'ListItem',
			position: 1,
			name: 'ホーム',
			item: 'https://erice.cloud/'
		}
	]

	if (itemDetail?.actress) {
		itemListElement.push({
			'@type': 'ListItem',
			position: 2,
			name: itemDetail.actress,
			item: `https://erice.cloud/actressprofile/${encodeURIComponent(itemDetail.actress)}`
		})
	}

	itemListElement.push({
		'@type': 'ListItem',
		position: itemDetail?.actress ? 3 : 2,
		name: 'アイテム詳細',
		item: `https://erice.cloud/item/${dbId}`
	})

	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement
	}
}

// Articleを生成する関数
export const generateArticleStructuredData = (
	itemMain: DMMItemMainResponse,
	itemDetail: DMMItemDetailResponse,
	description: string,
	dbId: number,
	actressProfiles: DMMActressProfile[] | null
): WithContext<Article> => {
	// itemMain.imageURLをImageObjectとして定義
	const mainImage: ImageObject = {
		'@type': 'ImageObject',
		url: itemMain.imageURL,
		description: `${itemMain.title}のメイン画像`
	}

	// relatedImagesをImageObjectとして定義
	const relatedImages: ImageObject[] =
		itemMain.sampleImageURL?.map((url, index) => ({
			'@type': 'ImageObject',
			url: url,
			description: `${itemMain.title}の画像${index + 1}`
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
					actor: itemDetail.actress ? { '@type': 'Person', name: itemDetail.actress } : undefined
			  }
			: undefined

	// 固定のAuthorデータ
	const author: Person = {
		'@type': 'Person',
		name: 'エロコメスト管理人',
		url: 'https://erice.cloud'
	}

	// 女優情報
	let actressData: WithContext<Person>[] | null = null
	if (actressProfiles && actressProfiles.length > 0) {
		// 不完全なプロフィールを除外
		const validActressProfiles = actressProfiles
			.map((profile) => generatePersonStructuredData(profile, description))
			.filter((profile) => profile !== null) as WithContext<Person>[]

		if (validActressProfiles.length > 0) {
			actressData = validActressProfiles
		} else {
			console.warn('All actress profiles are incomplete or missing.')
		}
	}

	// directorデータの生成
	const directors: Person[] | undefined = itemDetail.director
		? itemDetail.director.map((directorName) => ({
				'@type': 'Person',
				name: directorName
		  }))
		: undefined

	// articleSection と keywords を定義（itemDetail.genreが存在する場合）
	const articleSection: string | undefined = itemDetail.genre?.join(', ')
	const keywords: string | undefined = itemDetail.genre?.join(', ')

	// Articleスキーマの生成
	return {
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
		// ...(articleSection && { articleSection: articleSection }),
		...(keywords && { keywords: keywords }),
		...(actressData && { about: actressData })
	}
}

// 女優のPerson構造化データを生成する関数
export const generatePersonStructuredData = (
	actressProfile: DMMActressProfile,
	description: string
): WithContext<Person> | null => {
	// actressProfile 内の actress オブジェクトを取得し、存在チェック
	const actress = actressProfile.actress
	if (!actress) {
		console.warn('Actress data is missing in actressProfile:', actressProfile)
		return null
	}

	// 女優の画像URLを取得（なければnull）
	const actressImage = actress.image_url_large || actress.image_url_small || null

	// 構造化データオブジェクトを作成
	const structuredData: WithContext<Person> = {
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: actress.name,
		birthDate: actress.birthday || undefined, // 誕生日がある場合のみ追加
		height: actress.height ? `${actress.height}` : undefined, // 身長がある場合のみ追加
		description: description,
		sameAs: actress.list_url || undefined // 外部の関連URLがあれば設定
	}

	// actressImageが存在する場合のみ image フィールドを追加
	if (actressImage) {
		structuredData.image = actressImage
	}

	return structuredData
}

// 女優ページの構造化データを生成する関数
export const generateActressArticleStructuredData = (
	h1: string,
	description: string,
	profile: DMMActressProfile
): WithContext<Article> => {
	// 固定のAuthorデータ
	const author: Person = {
		'@type': 'Person',
		name: 'エロコメスト管理人',
		url: 'https://erice.cloud'
	}

	// 女優のPerson構造化データを生成
	const actressPersonData = generatePersonStructuredData(profile, description)

	// Articleスキーマの生成
	return {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: h1,
		image: [
			profile.actress.image_url_large || profile.actress.image_url_small || ''
			// 複数の画像サイズがある場合は追加することをお勧めします
		],
		author: author,
		description: description,
		datePublished: new Date().toISOString(), // 記事の公開日時
		dateModified: new Date().toISOString(), // 記事の最終更新日時
		mainEntityOfPage: `https://erice.cloud/actressprofile/${profile.actress.name}`,
		...(actressPersonData && { about: actressPersonData }) // 女優のPerson構造化データを追加
	}
}

export const generateDoujinKobetuItemStructuredData = (
	item: DoujinKobetuItem,
	description: string
): WithContext<Article> => {
	// メイン画像をImageObjectとして定義
	const mainImage: ImageObject = {
		'@type': 'ImageObject',
		url: item.package_images,
		description: `${item.title}のパッケージ画像`
	}

	// サンプル画像をImageObjectとして定義
	const sampleImages: ImageObject[] =
		item.sample_images?.map((url, index) => ({
			'@type': 'ImageObject',
			url: url ?? '', // Provide an empty string as fallback
			description: `${item.title}の画像${index + 1}`
		})) ?? []

	// 全ての画像を統合
	const allImages: ImageObject[] = [mainImage, ...sampleImages]

	// 固定のAuthorデータ
	const author: Person = {
		'@type': 'Person',
		name: 'エロコメスト管理人',
		url: 'https://erice.cloud'
	}

	// 日付のフォーマット
	const formattedDate = item.release_date ? new Date(item.release_date).toISOString() : new Date().toISOString()

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
		...(item.genres && { keywords: item.genres.map((genre) => genre.name).join(', ') })
	}
}

// 同人誌アイテム用のBreadcrumbListを生成する関数
export const generateDoujinBreadcrumbList = (item: DoujinKobetuItem): WithContext<BreadcrumbList> => {
	const itemListElement: ListItem[] = [
		{
			'@type': 'ListItem',
			position: 1,
			name: 'ホーム',
			item: 'https://erice.cloud/'
		},
		{
			'@type': 'ListItem',
			position: 2,
			name: '同人トップページ',
			item: 'https://erice.cloud/doujin/'
		}
	]

	if (item.makers && item.makers.length > 0) {
		itemListElement.push({
			'@type': 'ListItem',
			position: 3,
			name: item.makers[0].name,
			item: `https://erice.cloud/doujin/maker/${encodeURIComponent(item.makers[0].name)}`
		})
	}

	itemListElement.push({
		'@type': 'ListItem',
		position: item.makers && item.makers.length > 0 ? 4 : 3,
		name: item.title,
		item: `https://erice.cloud/doujin/itemd/${item.db_id}`
	})

	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement
	}
}

// キーワードページ用の Article 構造化データ生成関数
export const generateKeywordArticleStructuredData = (
	keyword: string,
	data: GetKVTop100Response,
	description: string
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
			url: 'https://erice.cloud'
		},
		datePublished: new Date(data.createdAt).toISOString(),
		dateModified: new Date(data.createdAt).toISOString(),
		image: data.items.slice(0, 3).map((item) => item.imageURL?.large || ''),
		mainEntityOfPage: `https://erice.cloud/keywords/${encodeURIComponent(decodedKeyword)}`
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
				item: 'https://erice.cloud/'
			},
			{
				'@type': 'ListItem',
				position: 2,
				name: 'エロ動画キーワード一覧',
				item: 'https://erice.cloud/keywords'
			},
			{
				'@type': 'ListItem',
				position: 3,
				name: `${keyword} の人気エロ動画`,
				item: `https://erice.cloud/keywords/${encodeURIComponent(keyword)}`
			}
		]
	}
}

export const generateGenreArticleStructuredData = (
	genreName: string,
	currentPage: number,
	items: DMMItemJsonLDProps[],
	description: string
): WithContext<Article> => {
	const currentYear = new Date().getFullYear()

	return {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: `【${currentYear}年最新】${genreName} の人気エロ動画を厳選して${items.length}件集めました${
			currentPage > 1 ? ` - ページ ${currentPage}` : ''
		}`,
		description: description,
		author: {
			'@type': 'Person',
			name: 'エロコメスト管理人',
			url: 'https://erice.cloud'
		},
		datePublished: new Date().toISOString(),
		dateModified: new Date().toISOString(),
		image: items[0]?.priorityImageURL || '',
		mainEntityOfPage: `https://erice.cloud/genre/${encodeURIComponent(genreName)}${
			currentPage > 1 ? `/page/${currentPage}` : ''
		}`
	}
}

// ジャンルページ用の BreadcrumbList 構造化データ生成関数
export const generateGenreBreadcrumbList = (genreName: string, currentPage: number): WithContext<BreadcrumbList> => {
	const itemListElement: ListItem[] = [
		{
			'@type': 'ListItem',
			position: 1,
			name: 'ホーム',
			item: 'https://erice.cloud/'
		},
		{
			'@type': 'ListItem',
			position: 2,
			name: 'エロ動画ジャンル一覧',
			item: 'https://erice.cloud/genres'
		},
		{
			'@type': 'ListItem',
			position: 3,
			name: `${genreName}`,
			item: `https://erice.cloud/genre/${encodeURIComponent(genreName)}`
		}
	]

	if (currentPage > 1) {
		itemListElement.push({
			'@type': 'ListItem',
			position: 4,
			name: `ページ ${currentPage}`,
			item: `https://erice.cloud/genre/${encodeURIComponent(genreName)}/page/${currentPage}`
		})
	}

	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement
	}
}
