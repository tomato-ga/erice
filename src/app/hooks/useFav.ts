import { useState, useEffect } from 'react'
import { useFavoriteStore } from '../stores/favStore'

export const useFavorite = (articleId: number) => {
	const { favorites, addFavorite, removeFavorite } = useFavoriteStore()
	const [isFavorite, setIsFavorite] = useState(false)

	useEffect(() => {
		setIsFavorite(favorites.includes(articleId))
	}, [favorites, articleId])

	const toggleFavorite = async () => {
		try {
			const response = await fetch('/api/favorite', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ articleId, action: isFavorite ? 'remove' : 'add' })
			})

			if (!response.ok) {
				throw new Error('Failed to update favorite')
			}

			if (isFavorite) {
				removeFavorite(articleId)
			} else {
				addFavorite(articleId)
			}
		} catch (error) {
			console.error('Error toggling favorite:', error)
		}
	}

	return { isFavorite, toggleFavorite }
}
