// /src/utils/jsonld.ts

import { DMMActressProfile, DMMActressRelatedItem } from '@/types/APItypes'
import { DMMItemDetailResponse, DMMItemMainResponse } from '@/types/dmmitemzodschema'
import { ItemType } from '@/types/dmmtypes'
import {
	Article,
	BreadcrumbList,
	ImageObject,
	ListItem,
	OfferCatalog,
	Organization,
	Person,
	VideoObject,
	WebPage,
	WithContext,
} from 'schema-dts'

// BreadcrumbListを生成する関数
export const generateBreadcrumbList = (dbId: number): WithContext<BreadcrumbList> => {
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
				name: 'アイテム詳細',
				item: `https://erice.cloud/item/${dbId}`,
			},
		],
	}
}

// Articleを生成する関数
export const generateArticleStructuredData = (
	itemMain: DMMItemMainResponse,
	itemDetail: DMMItemDetailResponse,
	description: string,
	dbId: number,
): WithContext<Article> => {
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
	return {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: `${itemMain.content_id} ${itemMain.title}`,
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
	}
}

// 女優のPerson構造化データを生成する関数
// export const generatePersonStructuredData = (
// 	actressProfile: DMMActressProfile,
// ): WithContext<Person> => {
// 	const actress = actressProfile.actress

// 	// 女優の画像URL
// 	const actressImage = actress?.image_url_large || actress?.image_url_small || ''

// 	return {
// 		'@context': 'https://schema.org',
// 		'@type': 'Person',
// 		name: actress.name,
// 		birthDate: actress.birthday || undefined, // 誕生日がある場合のみ追加
// 		height: actress.height ? `${actress.height}` : undefined, // 身長がある場合のみ追加
// 		image: actressImage,
// 		description: `人気セクシー女優 ${actress.name} のプロフィールです。`,
// 		sameAs: actress.list_url || undefined, // 外部の関連URLがあれば設定
// 	}
// }

export const generateWebPageStructuredData = (
	actressProfile: DMMActressProfile,
	relatedItems: DMMActressRelatedItem[],
): WithContext<WebPage> => {
	const actress = actressProfile.actress
	const actressImage = actress?.image_url_large || actress?.image_url_small || ''

	const itemList: ListItem[] = relatedItems.map((item, index) => ({
		'@type': 'ListItem',
		position: index + 1,
		url: item.url,
		name: item.title,
	}))

	const offerCatalog: OfferCatalog = {
		'@type': 'OfferCatalog',
		name: `${actress.name} 出演作品`,
		itemListElement: itemList,
	}

	const organization: Organization = {
		'@type': 'Organization',
		name: 'DMM',
		hasOfferCatalog: offerCatalog,
	}

	return {
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		name: `この動画の出演者「${actress.name}」のプロフィール`,
		mainEntity: {
			'@type': 'Person',
			name: actress.name,
			birthDate: actress.birthday || undefined,
			height: actress.height ? `${actress.height}cm` : undefined,
			image: actressImage,
			description: `人気セクシー女優 ${actress.name} のプロフィールです。`,
			sameAs: actress.list_url || undefined,
			worksFor: organization, // worksForを追加
		},
	}
}
