import {
	ActressProfileAndWorks,
	ActressProfileAndWorksSchema,
	DMMActressInfo,
	DMMActressInfoSchema,
	DMMActressProfile,
	DMMActressRelatedItem,
} from '@/types/APItypes'
import {
	DMMDebutItem,
	DMMDebutItemSchema,
	DMMFeatureItem,
	DMMFeatureItemSchema,
	DMMItem,
	DMMItemDetailResponse,
	DMMItemDetailResponseSchema,
	DMMItemMainResponse,
	DMMItemMainResponseSchema,
	DMMItemSchema,
	DMMSaleItem,
	DMMSaleItemSchema,
	DMMTodayNewItem,
	DMMTodayNewItemSchema,
} from '@/types/dmmitemzodschema'
import { ItemType } from '@/types/dmmtypes'

import {
	DMMCampaignItem,
	DMMRelatedGenreItem,
	GetKVCampaignItemsResponse,
	GetKVCampaignItemsResponseSchema,
	GetKVCampaignNamesResponseSchema,
} from '@/types/dmm-campaignpage-types'
import { ErrorResponse, GetKVTop100Response } from '@/types/dmm-keywordpage-types'
import { DMMItemProps } from '@/types/dmmtypes'
import { revalidateTag, unstable_cache } from 'next/cache'
import { validate } from 'uuid'
import { z } from 'zod'

// 型定義の修正
export type FetchableItemType = 'todaynew' | 'debut' | 'feature' | 'sale'

// エンドポイントと解析関数のマッピング
const itemTypeConfig = {
	todaynew: {
		endpoint: '/api/dmm-todaynew-getkv',
		parseFunction: (data: unknown) =>
			z.array(DMMTodayNewItemSchema).parse(data) as DMMTodayNewItem[],
	},
	debut: {
		endpoint: '/api/dmm-debut-getkv',
		parseFunction: (data: unknown) => z.array(DMMDebutItemSchema).parse(data) as DMMDebutItem[],
	},
	feature: {
		endpoint: '/api/dmm-feature-getkv',
		parseFunction: (data: unknown) => z.array(DMMFeatureItemSchema).parse(data) as DMMFeatureItem[],
	},
	sale: {
		endpoint: '/api/dmm-sale-getkv',
		parseFunction: (data: unknown) => z.array(DMMSaleItemSchema).parse(data) as DMMSaleItem[],
	},
} satisfies Record<
	FetchableItemType,
	{ endpoint: string; parseFunction: (data: unknown) => DMMItem[] }
>

export async function fetchDataKV(
	itemType: FetchableItemType,
	contentId: string,
): Promise<DMMItem | null> {
	const config = itemTypeConfig[itemType]

	try {
		// Define a fetch callback
		const fetchCallback = async () => {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${config.endpoint}`, {
				next: {
					tags: [`item-${contentId}`],
				},
			})
			return response
		}

		// Use unstable_cache with the fetch callback
		const cachedFetch = unstable_cache(fetchCallback)
		const response = await cachedFetch()

		const data: unknown = await response.json()

		// Parse and validate the data using the parseFunction from config
		const parsedData = config.parseFunction(data)

		// Find the specific item by contentId
		const item = parsedData.find(item => item.content_id === contentId) || null

		if (item) {
			revalidateTag(`item-${item.content_id}`)
			return item
		}

		// Type assertion to DMMItem
		return item as DMMItem | null
	} catch (error) {
		if (error instanceof z.ZodError) {
			console.error(`Validation error for ${itemType} with content_id ${contentId}:`, error.errors)
		} else {
			console.error(`Error fetching data for ${itemType} with content_id ${contentId}:`, error)
		}
		return null
	}
}

export async function fetchItemMainByContentId(dbId: number): Promise<DMMItemMainResponse | null> {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/api/dmm-get-one-item-main?db_id=${dbId}`,
			{
				next: {
					revalidate: 2592000,
					tags: [`item-main-${dbId}`],
				},
			},
		)
		const data: unknown = await response.json()

		// 新しい形式のレスポンス構造に対応
		if (
			typeof data === 'object' &&
			data !== null &&
			'items' in data &&
			typeof data.items === 'object' &&
			data.items !== null &&
			'data' in data.items &&
			Array.isArray(data.items.data) &&
			data.items.data.length > 0
		) {
			const itemData = data.items.data[0] // 最初のアイテムを取得
			const parseResult = DMMItemMainResponseSchema.safeParse(itemData)
			if (parseResult.success) {
				revalidateTag(`item-main-${parseResult.data.content_id}`)
				return parseResult.data
			}
		} else if (typeof data === 'object' && data !== null) {
			// 従来の形式も維持（フォールバック）
			const parseResult = DMMItemMainResponseSchema.safeParse(data)
			if (parseResult.success) {
				revalidateTag(`item-main-${parseResult.data.content_id}`)
				return parseResult.data
			}
		}

		console.error('Unexpected data format:', data)
		return null
	} catch (error) {
		if (error instanceof z.ZodError) {
			console.error('Zod validation error:', error.errors)
		} else if (error instanceof Error) {
			console.error('Error fetching data:', error.message)
		} else {
			console.error('Unknown error occurred while fetching data')
		}
		return null
	}
}

// TODO 似たような関数を用意して、series_idを取得する？分割関数したほうがworkersで処理できる時間を小分けにできるのでそっちのがいい気がする
export async function fetchItemDetailByContentId(
	dbId: number,
): Promise<DMMItemDetailResponse | null> {
	// console.log('fetchItemDetailByContentId関数を呼出します', contentId)

	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/api/dmm-get-one-item-detail?db_id=${dbId}`,
			{
				next: {
					revalidate: 2592000, // 1ヶ月（30日）
					tags: [`item-detail-${dbId}`],
				},
			},
		)
		const data: unknown = await response.json()

		// console.log('Raw API response fetchItemDetailByContentId:', data)

		// データが{ items: { ... } }の形式であることを期待
		if (typeof data === 'object' && data !== null && 'items' in data) {
			const itemData = (data as { items: unknown }).items
			const parseResult = DMMItemDetailResponseSchema.safeParse(itemData)
			if (parseResult.success) {
				revalidateTag(`item-detail-${dbId}`)
				return parseResult.data
			}
			console.error('Validation error:', parseResult.error.errors)
			console.error('Invalid data:', itemData)
		}
		return null
	} catch (error) {
		if (error instanceof z.ZodError) {
			console.error('Zod validation error:', error.errors)
		} else if (error instanceof Error) {
			console.error('Error fetching data:', error.message)
		} else {
			console.error('Unknown error occurred while fetching data')
		}
		return null
	}
}

export async function fetchRelatedItems(itemType: ItemType): Promise<DMMItemProps[]> {
	const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dmm-${itemType}-getkv`, {
		next: {
			revalidate: 21600, // 6時間
			tags: [`item-relateditem-${itemType}`],
		},
	})
	const data: DMMItemProps[] = await response.json()
	return data.slice(0, 50)
}

export async function fetchActressRelatedItem(
	actressName: string,
): Promise<DMMActressRelatedItem[] | null> {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/api/dmm-actress-relateditems?actressname=${encodeURIComponent(actressName)}`,
		)

		if (!response.ok) {
			if (response.status === 404) {
				return null // 404エラーの場合は空の配列を返す
			}
			// その他のエラーの場合はnullを返す
			console.error(`API error: ${response.status} ${response.statusText}`)
			return null
		}

		const data: { items: DMMActressRelatedItem[] } = await response.json()
		return data.items // items配列を返す
	} catch (error) {
		console.error('Failed to fetch actress related items:', error)
		return null
	}
}

export async function fetchActressProfile(
	actressName: string,
): Promise<DMMActressProfile[] | null> {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/api/dmm-actress-profile?actressname=${encodeURIComponent(actressName)}`,
		)
		const data = (await response.json()) as { actresses: DMMActressProfile[] }
		console.log('actressProfile:', data)
		console.dir(data, { depth: 3 })

		return data.actresses
	} catch (error) {
		console.error('Failed to fetch actress profile:', error)
		return null
	}
}

// series nameを入れたらstatsが返ってくる関数
export async function fetchSeriesStats(seriesName: string): Promise<Stats | null> {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/api/dmm-series-stats?seriesname=${encodeURIComponent(seriesName)}`,
		)

		if (!response.ok) {
			return null
		}

		const data = (await response.json()) as Stats
		return data
	} catch (error) {
		return null
	}
}

export const fetchActressProfileAndWorks = unstable_cache(
	async (actressName: string): Promise<ActressProfileAndWorks | null> => {
		if (!actressName) {
			console.error('女優名が指定されていません。')
			return null
		}

		const encodedActressName = encodeURIComponent(actressName.trim())

		try {
			const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/dmm-actress-profile-page?actressname=${encodedActressName}`
			// console.log('Fetching from URL:', apiUrl) // デバッグ用

			const response = await fetch(apiUrl, {
				next: { revalidate: 2592000 }, // 30日キャッシュ
			})

			if (response.status === 404) {
				// console.log(`女優が見つかりません: ${actressName}`)
				return null
			}

			if (!response.ok) {
				console.error(`APIエラー: ${response.status} ${response.statusText}`)
				throw new Error(`APIからのデータ取得に失敗しました: ${response.status}`)
			}

			const data = await response.json()
			// console.log('Received data:', data) // デバッグ用

			const validatedData = ActressProfileAndWorksSchema.parse(data)
			// console.log('fetchActressProfileAndWorks validatedData', validatedData.profile.actress)

			return validatedData
		} catch (error) {
			console.error('APIリクエストでエラーが発生しました:', error)
			if (error instanceof z.ZodError) {
				console.error('データの形式が不正です:', error.errors)
			}
			return null
		}
	},
)

export const fetchItemMainByContentIdToActressInfo = unstable_cache(
	async (dbId: number): Promise<DMMActressInfo | null> => {
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/dmm-get-actressonly-info?db_id=${dbId}`,
				{
					next: {
						revalidate: 2592000, // 1ヶ月（30日）
						tags: [`item-detail-${dbId}`],
					},
				},
			)
			const data: DMMActressInfo[] = await response.json()

			// console.log('Raw API response fetchItemMainByContentId:', data)

			if (typeof data === 'object' && data !== null) {
				const parseResult = DMMActressInfoSchema.safeParse(data)
				if (parseResult.success) {
					revalidateTag(`item-actressInfo-${dbId}`)
					return parseResult.data
				}
			} else {
				console.error('Unexpected data format:', data)
			}

			console.error('Unexpected data format:', data)
			return null
		} catch (error) {
			if (error instanceof z.ZodError) {
				console.error('Zod validation error:', error.errors)
			} else if (error instanceof Error) {
				console.error('Error fetching data:', error.message)
			} else {
				console.error('Unknown error occurred while fetching data')
			}
			return null
		}
	},
)

export async function fetchData<TResponse>(
	endpoint: string,
	queryParams?: Record<string, string>,
): Promise<TResponse | null> {
	console.log('fetchData endpoint:', endpoint, 'queryParams:', queryParams)

	// クエリパラメータが存在する場合、URLに追加
	const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`)
	if (queryParams) {
		for (const [key, value] of Object.entries(queryParams)) {
			url.searchParams.append(key, value)
		}
	}

	try {
		const response = await fetch(url.toString(), { cache: 'no-store' })
		if (!response.ok) {
			console.error(`Failed to fetch data from ${url}: ${response.statusText}`)
			return null
		}

		const data: TResponse = await response.json()
		return data
	} catch (error) {
		console.error('データの取得に失敗しました:', error)
		return null
	}
}

/**
 * キーワードに基づいてTop100データを取得します。
 * @param keyword - 検索キーワード
 * @returns GetKVTop100Response | null - データ取得結果またはnull
 */
export async function fetchTOP100KeywordData(keyword: string): Promise<GetKVTop100Response | null> {
	try {
		const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/dmm-top100-getkv?keywords=${keyword}`

		// デバッグログ: リクエストURL
		console.debug(`データ取得用APIエンドポイント: ${apiUrl}`)

		const res = await fetch(apiUrl, {
			next: { revalidate: 1209600 }, // 2週間キャッシュ
		})

		// デバッグログ: レスポンスURLとステータス
		console.debug(`リクエストURL: ${res.url}`)
		console.debug(`レスポンスステータス: ${res.status}`)

		if (!res.ok) {
			// デバッグログ: レスポンスエラー
			console.error(
				`キーワード「${keyword}」のデータ取得に失敗しました。ステータスコード: ${res.status}`,
			)
			return null
		}

		const data: GetKVTop100Response = await res.json()

		// デバッグログ: 取得したデータ
		// console.debug('取得したデータ件数:', data.items.length)

		return data
	} catch (error: unknown) {
		if (error instanceof Error) {
			// デバッグログ: エラー内容
			console.error(
				`キーワード「${keyword}」のデータ取得中にエラーが発生しました: ${error.message}`,
			)
		} else {
			console.error(`キーワード「${keyword}」のデータ取得中に予期せぬエラーが発生しました。`)
		}
		return null
	}
}

import { Stats, ThreeSizeResponseSchema } from '@/_types_dmm/statstype'
// キャンペーン名を取得する関数
import { cache } from 'react'

// キャッシュされたキャンペーン名を取得する関数
export const fetchCampaignNames = cache(async (): Promise<string[] | null> => {
	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/campaign/names`)
		if (!response.ok) {
			console.error(`Failed to fetch campaign names: ${response.status} ${response.statusText}`)
			return null
		}
		const data = await response.json()
		const parseResult = GetKVCampaignNamesResponseSchema.safeParse(data)
		if (!parseResult.success) {
			console.error('Failed to parse campaign names:', parseResult.error)
			return null
		}
		return parseResult.data.campaignNames
	} catch (error) {
		console.error('Error fetching campaign names:', error)
		return null
	}
})

// キャンペーンデータを取得する関数
export const fetchCampaignData = async (
	campaignName: string,
): Promise<GetKVCampaignItemsResponse | null> => {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/api/campaign/data/${encodeURIComponent(campaignName)}`,
			{
				headers: {
					'X-API-KEY': process.env.CLOUDFLARE_DMM_API_TOKEN || '',
				},
			},
		)

		if (!response.ok) {
			console.error(
				`Failed to fetch campaign data for ${campaignName}: ${response.status} ${response.statusText}`,
			)
			return null
		}

		const data = await response.json()
		const parseResult = GetKVCampaignItemsResponseSchema.safeParse(data)

		if (!parseResult.success) {
			console.error('Failed to parse campaign data:', parseResult.error)
			return null
		}

		const campaignData: GetKVCampaignItemsResponse = parseResult.data
		return campaignData
	} catch (error) {
		console.error(`Error fetching campaign data for ${campaignName}:`, error)
		return null
	}
}

// export const fetchCampaignData = async (
// 	campaignName: string,
// ): Promise<GetKVCampaignItemsResponse | null> => {
// 	try {
// 		const res = await fetch(`/api/campaign/data/${encodeURIComponent(campaignName)}`)
// 		if (!res.ok) {
// 			console.error('キャンペーンデータの取得に失敗しました')
// 			return null
// 		}
// 		const data = await res.json()
// 		return data as GetKVCampaignItemsResponse
// 	} catch (error) {
// 		console.error('データ取得エラー:', error)
// 		return null
// 	}
// }

export const fetchCampaignBatchData = async (
	campaignName: string,
	batchIndex: number,
): Promise<GetKVCampaignItemsResponse | null> => {
	try {
		const res = await fetch(
			`/api/campaign/data/${encodeURIComponent(campaignName)}?batch=${batchIndex}`,
		)
		if (!res.ok) {
			return null
		}
		const data = await res.json()
		return data as GetKVCampaignItemsResponse
	} catch (error) {
		console.error('バッチデータ取得エラー:', error)
		return null
	}
}

/**
 * キャンペーンバッチデータをフェッチする関数
 * @param campaignName キャンペーン名
 * @param batchIndex バッチ番号
 * @returns DMMCampaignItem の配列
 */
export const fetchCampaignBatch = async (
	campaignName: string,
	batchIndex: number,
): Promise<DMMCampaignItem[]> => {
	// console.log(
	// 	`fetchCampaignBatch: キャンペーン "${campaignName}", バッチ ${batchIndex} のデータをフェッチします`,
	// )

	const response = await fetch(
		`/api/campaign/data/${encodeURIComponent(campaignName)}?batch=${batchIndex}`,
		{
			headers: {
				'X-API-Key': process.env.CLOUDFLARE_DMM_API_TOKEN || '',
			},
		},
	)

	if (!response.ok) {
		const errorText = await response.text()
		console.error(
			`fetchCampaignBatch: キャンペーン "${campaignName}", バッチ ${batchIndex} のフェッチに失敗しました: ${response.status} ${errorText}`,
		)
		throw new Error(
			`Failed to fetch campaign data for ${campaignName}, batch ${batchIndex}: ${response.status} ${errorText}`,
		)
	}

	const data = await response.json()

	// デバッグログを追加
	// console.log('fetchCampaignBatch: APIから取得したデータ:', JSON.stringify(data, null, 2))

	// データのパース
	const parsedData = GetKVCampaignItemsResponseSchema.safeParse(data)

	if (!parsedData.success) {
		console.error('fetchCampaignBatch: データのパースに失敗しました:', parsedData.error)
		throw new Error(`Failed to parse campaign data for ${campaignName}, batch ${batchIndex}`)
	}

	// パース結果のデバッグログ
	// console.log('fetchCampaignBatch: パース後のデータ:', JSON.stringify(parsedData.data, null, 2))

	return parsedData.data.items
}

export const fetchRelatedGenre = async (genreName: string) => {
	const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/dmm-genre-related?genre=${encodeURIComponent(genreName)}`
	const response = await fetch(apiUrl)
	if (!response.ok) {
		console.error('Failed to fetch related genre data:', response.statusText)
		return null
	}
	const data: DMMRelatedGenreItem = await response.json()
	return data
}

export const fetchThreeSizeActresses = async (
	threeSize: {
		bust: number
		waist: number
		hip: number
	},
	actressId: number,
) => {
	console.log('Fetching three size data with:', threeSize, 'and actressId:', actressId)

	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dmm-actress-threesize`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ threeSize, actressId }),
			cache: 'no-store',
		})

		if (!response.ok) {
			const errorText = await response.text()
			console.error('Error response:', errorText)
			throw new Error(`Failed to fetch three size data: ${response.status} ${errorText}`)
		}

		const rawData = await response.json()

		// レスポンスの型検証とキャスト
		const validatedData = ThreeSizeResponseSchema.parse(rawData)

		return validatedData
	} catch (error) {
		console.error('Fetch error:', error)
		throw error
	}
}
