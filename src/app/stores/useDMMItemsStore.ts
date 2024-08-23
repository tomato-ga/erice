import { create } from 'zustand'
import { DMMSaleItem, DMMItem, ItemType } from '@/types/dmmtypes'

type ItemsState = {
	[key in ItemType]: DMMSaleItem[] | DMMItem[]
}

type ItemsActions = {
	fetchItems: (itemType: ItemType, endpoint: string) => Promise<void>
	setItems: (itemType: ItemType, items: DMMSaleItem[] | DMMItem[]) => void
}

type ItemsStore = Omit<ItemsState, 'actress' | 'genre'> & ItemsActions

export const useDMMItemsStore = create<ItemsStore>((set) => ({
	sale: [],
	feature: [],
	todaynew: [],
	debut: [],

	fetchItems: async (itemType, endpoint) => {
		try {
			const response = await fetch(endpoint)
			if (!response.ok) {
				throw new Error('Failed to fetch items')
			}
			const data = await response.json()
			set((state) => ({ [itemType]: data }))
		} catch (error) {
			console.error('Error fetching items:', error)
		}
	},

	setItems: (itemType, items) => set((state) => ({ [itemType]: items }))
}))
