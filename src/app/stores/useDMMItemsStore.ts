import { DMMItem, DMMSaleItem, ItemType } from '@/types/dmmtypes'
import { create } from 'zustand'

type ItemsState = {
	[key in ItemType]: DMMSaleItem[] | DMMItem[]
}

type ItemsActions = {
	fetchItems: (itemType: ItemType, endpoint: string) => Promise<void>
	setItems: (itemType: ItemType, items: DMMSaleItem[] | DMMItem[]) => void
}

type ItemsStore = {
	[K in Exclude<ItemType, 'actress' | 'genre'>]: DMMSaleItem[] | DMMItem[]
} & ItemsActions

export const useDMMItemsStore = create<ItemsStore>(set => ({
	sale: [],
	feature: [],
	todaynew: [],
	debut: [],
	last7days: [], // 追加

	fetchItems: async (itemType, endpoint) => {
		try {
			const response = await fetch(endpoint)
			if (!response.ok) {
				throw new Error('Failed to fetch items')
			}
			const data = await response.json()
			set(state => ({ [itemType]: data }))
		} catch (error) {
			console.error('Error fetching items:', error)
		}
	},

	setItems: (itemType, items) => set(state => ({ [itemType]: items })),
}))
