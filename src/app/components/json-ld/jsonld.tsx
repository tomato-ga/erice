// /src/utils/jsonld.ts

import { DMMItemDetailResponse, DMMItemMainResponse } from '@/types/dmmitemzodschema'
import { BreadcrumbList, ImageObject, ItemPage, Person, VideoObject, WithContext } from 'schema-dts'
import SampleImages from '../doujincomponents/kobetu/SampleImage'

// 構造化データを生成する関数
export const generateStructuredData = (
	itemMain: DMMItemMainResponse,
	itemDetail: DMMItemDetailResponse,
	description: string,
	dbId: number,
): WithContext<ItemPage> => {
	// BreadcrumbListの作成
	const breadcrumb: BreadcrumbList = {
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

	// 画像のサンプルを ImageObject として定義
	const relatedImages: ImageObject[] =
		itemMain.sampleImageURL?.map((url, index) => ({
			'@type': 'ImageObject',
			contentUrl: url,
			description: `${itemMain.title}の画像${index + 1}`,
		})) || []

	// VideoObject（存在する場合）
	const videoObject: VideoObject | undefined =
		itemMain.sampleMovieURL && itemMain.sampleMovieURL.length > 0
			? {
					'@type': 'VideoObject',
					name:
						itemMain.title +
						`【${new Date().toLocaleDateString('ja-JP', { year: 'numeric' })} 最新】`,
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

	// ItemPage の定義
	const itemPage: WithContext<ItemPage> = {
		'@context': 'https://schema.org',
		'@type': 'ItemPage',
		name: `${itemMain.content_id} ${itemMain.title}【${new Date().toLocaleDateString('ja-JP', { year: 'numeric' })}】`,
		url: `https://erice.cloud/item/${dbId}`,
		description: description,
		breadcrumb: breadcrumb,
		mainEntity: {
			'@type': 'Thing',
			name: itemMain.title,
			description: itemDetail.genre?.join(', ') || 'この商品に関する説明',
			identifier: itemMain.content_id,
			image: relatedImages,
		},
		video: videoObject,
		genre: itemDetail.genre?.join(', ') || 'ジャンル情報なし',
		datePublished: itemDetail.date
			? (() => {
					const [datePart, timePart] = itemDetail.date.split(' ')
					const [year, month, day] = datePart.split('-')
					const [hour, minute, second] = timePart.split(':')
					return `${year}-${month}-${day}T${hour}:${minute}:${second}+09:00`
				})()
			: new Date().toISOString(),
		provider: itemDetail.maker
			? {
					'@type': 'Organization',
					name: itemDetail.maker,
				}
			: undefined,
	}

	return itemPage
}
