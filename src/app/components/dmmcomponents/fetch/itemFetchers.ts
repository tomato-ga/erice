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
import { ErrorResponse, GetKVTop100Response, ItemType } from '@/types/dmmtypes'
import { DMMItemProps } from '@/types/dmmtypes'
import { revalidateTag } from 'next/cache'
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
		const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${config.endpoint}`, {
			next: {
				tags: [`item-${contentId}`],
			},
		})
		const data: unknown = await response.json()

		const validatedData = config.parseFunction(data)
		const item = validatedData.find(item => item.content_id === contentId)

		if (item) {
			revalidateTag(`item-${item.content_id}`)
			return item
		}

		return null
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
				cache: 'force-cache',
				next: {
					tags: [`item-main-${dbId}`],
				},
			},
		)
		const data: unknown = await response.json()

		// console.log('Raw API response fetchItemMainByContentId:', data)

		if (typeof data === 'object' && data !== null) {
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

export async function fetchItemDetailByContentId(
	dbId: number,
): Promise<DMMItemDetailResponse | null> {
	// console.log('fetchItemDetailByContentId関数を呼出します', contentId)

	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/api/dmm-get-one-item-detail?db_id=${dbId}`,
			{
				next: {
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
			revalidate: 43200, // 12時間（秒単位）
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

export async function fetchActressProfile(actressName: string): Promise<DMMActressProfile | null> {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/api/dmm-actress-profile?actressname=${encodeURIComponent(actressName)}`,
		)
		const data: DMMActressProfile = await response.json()
		// console.log('actressProfile:', data)

		return data
	} catch (error) {
		console.error('Failed to fetch actress profile:', error)
		return null
	}
}

export async function fetchActressProfileAndWorks(
	actressName: string,
): Promise<ActressProfileAndWorks | null> {
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
}

export async function fetchItemMainByContentIdToActressInfo(
	dbId: number,
): Promise<DMMActressInfo | null> {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/api/dmm-get-actressonly-info?db_id=${dbId}`,
			{
				cache: 'force-cache',
				next: {
					tags: [`item-actressInfo-${dbId}`],
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
}

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

	const fetchOptions = { next: { revalidate: 43200 } }

	try {
		const response = await fetch(url.toString(), fetchOptions)
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
			cache: 'no-store', // 常に最新データを取得
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
