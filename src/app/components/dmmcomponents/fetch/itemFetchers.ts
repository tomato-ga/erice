import { z } from 'zod'
import { ItemType } from '@/types/dmmtypes'
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
	DMMTodayNewItemSchema
} from '@/types/dmmitemzodschema'
import { DMMItemProps } from '@/types/dmmtypes'
import { revalidateTag } from 'next/cache'
import {
	ActressProfileAndWorks,
	ActressProfileAndWorksSchema,
	DMMActressInfo,
	DMMActressInfoSchema,
	DMMActressProfile,
	DMMActressRelatedItem
} from '@/types/APItypes'

export async function fetchDataKV(itemType: ItemType, contentId: string): Promise<DMMItem | null> {
	let endpoint = ''
	let parseFunction: (data: unknown) => DMMItem[]

	switch (itemType) {
		case 'todaynew':
			endpoint = '/api/dmm-todaynew-getkv'
			parseFunction = (data) => z.array(DMMTodayNewItemSchema).parse(data) as DMMTodayNewItem[]
			break
		case 'debut':
			endpoint = '/api/dmm-debut-getkv'
			parseFunction = (data) => z.array(DMMDebutItemSchema).parse(data) as DMMDebutItem[]
			break
		case 'feature':
			endpoint = '/api/dmm-feature-getkv'
			parseFunction = (data) => z.array(DMMFeatureItemSchema).parse(data) as DMMFeatureItem[]
			break
		case 'sale':
			endpoint = '/api/dmm-sale-getkv'
			parseFunction = (data) => z.array(DMMSaleItemSchema).parse(data) as DMMSaleItem[]
			break
		default:
			throw new Error(`Invalid itemType: ${itemType}`)
	}

	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
			next: {
				tags: [`item-${contentId}`]
			}
		})
		const data: unknown = await response.json()

		const validatedData = parseFunction(data)
		const item = validatedData.find((item) => item.content_id === contentId)

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
		const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dmm-get-one-item-main?db_id=${dbId}`, {
			cache: 'force-cache',
			next: {
				tags: [`item-main-${dbId}`]
			}
		})
		const data: unknown = await response.json()

		// console.log('Raw API response fetchItemMainByContentId:', data)

		if (typeof data === 'object' && data !== null) {
			const parseResult = DMMItemMainResponseSchema.safeParse(data)
			if (parseResult.success) {
				revalidateTag(`item-main-${parseResult.data.content_id}`)
				return parseResult.data
			} else {
				console.error('Validation error:', parseResult.error.errors)
				return null
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

export async function fetchItemDetailByContentId(dbId: number): Promise<DMMItemDetailResponse | null> {
	// console.log('fetchItemDetailByContentId関数を呼び出します', contentId)

	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dmm-get-one-item-detail?db_id=${dbId}`, {
			next: {
				tags: [`item-detail-${dbId}`]
			}
		})
		const data: unknown = await response.json()

		// console.log('Raw API response fetchItemDetailByContentId:', data)

		// データが{ items: { ... } }の形式であることを期待
		if (typeof data === 'object' && data !== null && 'items' in data) {
			const itemData = (data as { items: unknown }).items
			const parseResult = DMMItemDetailResponseSchema.safeParse(itemData)
			if (parseResult.success) {
				revalidateTag(`item-detail-${dbId}`)
				return parseResult.data
			} else {
				console.error('Validation error:', parseResult.error.errors)
				console.error('Invalid data:', itemData)
				return null
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

export async function fetchRelatedItems(itemType: ItemType): Promise<DMMItemProps[]> {
	const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dmm-${itemType}-getkv`, {
		next: {
			revalidate: 43200 // 12時間（秒単位）
		}
	})
	const data: DMMItemProps[] = await response.json()
	return data.slice(0, 50)
}

export async function fetchActressRelatedItem(actressName: string): Promise<DMMActressRelatedItem[] | null> {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/api/dmm-actress-relateditems?actressname=${encodeURIComponent(actressName)}`
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
			`${process.env.NEXT_PUBLIC_API_URL}/api/dmm-actress-profile?actressname=${encodeURIComponent(actressName)}`
		)
		const data: DMMActressProfile = await response.json()
		// console.log('actressProfile:', data)

		return data
	} catch (error) {
		console.error('Failed to fetch actress profile:', error)
		return null
	}
}

export async function fetchActressProfileAndWorks(actressName: string): Promise<ActressProfileAndWorks | null> {
	if (!actressName) {
		console.error('女優名が指定されていません。')
		return null
	}

	const encodedActressName = encodeURIComponent(actressName.trim())

	try {
		const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/dmm-actress-profile-page?actressname=${encodedActressName}`
		// console.log('Fetching from URL:', apiUrl) // デバッグ用

		const response = await fetch(apiUrl, {
			next: { revalidate: 2592000 } // 30日キャッシュ
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
		// console.log('fetchActressProfileAndWorks validatedData', validatedData)

		return validatedData
	} catch (error) {
		console.error('APIリクエストでエラーが発生しました:', error)
		if (error instanceof z.ZodError) {
			console.error('データの形式が不正です:', error.errors)
		}
		return null
	}
}

export async function fetchItemMainByContentIdToActressInfo(dbId: number): Promise<DMMActressInfo | null> {
	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dmm-get-actressonly-info?db_id=${dbId}`, {
			cache: 'force-cache',
			next: {
				tags: [`item-actressInfo-${dbId}`]
			}
		})
		const data: DMMActressInfo[] = await response.json()

		// console.log('Raw API response fetchItemMainByContentId:', data)

		if (typeof data === 'object' && data !== null) {
			const parseResult = DMMActressInfoSchema.safeParse(data)
			if (parseResult.success) {
				revalidateTag(`item-actressInfo-${dbId}`)
				return parseResult.data
			} else {
				console.error('Validation error:', parseResult.error.errors)
				return null
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
