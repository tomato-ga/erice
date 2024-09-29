// /src/utils/jsonld.ts

import { DMMItemDetailResponse, DMMItemMainResponse } from '@/types/dmmitemzodschema'
import {
	BreadcrumbList,
	ImageObject,
	ItemPage,
	Movie,
	Person,
	VideoObject,
	WithContext,
} from 'schema-dts'
import SampleImages from '../doujincomponents/kobetu/SampleImage'

// 構造化データを生成する関数
export const generateStructuredData = (
	itemMain: DMMItemMainResponse,
	itemDetail: DMMItemDetailResponse,
	description: string,
	dbId: number,
): WithContext<ItemPage> => {
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
						: new Date().toLocaleTimeString('ja-JP', {
								year: 'numeric',
								month: '2-digit',
								day: '2-digit',
							}),
					embedUrl: itemMain.sampleMovieURL[0],
					actor: itemDetail.actress ? { '@type': 'Person', name: itemDetail.actress } : undefined,
					interactionStatistic: {
						'@type': 'InteractionCounter',
						interactionType: { '@type': 'WatchAction' },
					},
				}
			: undefined

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
			description: `サンプル画像 ${index + 1}`,
		})) || []

	// ItemPage の定義
	const itemPage: WithContext<ItemPage> = {
		'@context': 'https://schema.org',
		'@type': 'ItemPage',
		name: `${itemMain.content_id} ${itemMain.title}【${new Date().toLocaleDateString('ja-JP', { year: 'numeric' })}】`,
		url: `https://erice.cloud/item/${dbId}`,
		description: description,
		breadcrumb: breadcrumb,
		about: {
			'@type': 'Movie',
			name: itemMain.title,
			description: itemDetail.genre?.join(', ') || 'この作品に関する説明',
			genre: itemDetail.genre?.join(', ') || 'ジャンル情報なし',
			actor: itemDetail.actress ? { '@type': 'Person', name: itemDetail.actress } : undefined,
			director: itemDetail.director ? { '@type': 'Person', name: itemDetail.director } : undefined,
			datePublished: itemDetail.date || undefined,
			thumbnailUrl: itemMain.imageURL,
			image: Array.isArray(itemMain.sampleImageURL) ? relatedImages : undefined,
		},
		author: itemDetail.actress
			? ({ '@type': 'Person', name: itemDetail.actress } as Person)
			: undefined,
		mainEntity: videoObject,
	}

	return itemPage
}
