import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FavoriteStore {
	favorites: number[]
	addFavorite: (id: number) => void
	removeFavorite: (id: number) => void
	setFavorites: (favorites: number[]) => void
	isFavorite: (id: number) => boolean
}

export const useFavoriteStore = create<FavoriteStore>()(
	persist(
		(set, get) => ({
			favorites: [] as number[],
			addFavorite: (id: number) =>
				set((state) => ({
					favorites: state.favorites.includes(id) ? state.favorites : [...state.favorites, id]
				})),
			removeFavorite: (id: number) =>
				set((state) => ({
					favorites: state.favorites.filter((fav) => fav !== id)
				})),
			setFavorites: (favorites: number[]) => set({ favorites }),
			isFavorite: (id: number) => get().favorites.includes(id)
		}),
		{
			name: 'favorite-storage'
		}
	)
)
