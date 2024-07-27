'use client'

import { useState, useEffect, useCallback } from 'react'
import { useFavoriteStore } from '../stores/favStore'

interface UseFavoriteResult {
	isFavorite: boolean
	toggleFavorite: () => Promise<void>
	isLoading: boolean
	error: string | null
}

export const useFavorite = (articleId: number): UseFavoriteResult => {
	const { favorites, addFavorite, removeFavorite } = useFavoriteStore()
	const [isFavorite, setIsFavorite] = useState<boolean>(false)
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		setIsFavorite(favorites.includes(articleId))
	}, [favorites, articleId])

	const toggleFavorite = useCallback(async () => {
		setIsLoading(true)
		setError(null)
		try {
			const action = isFavorite ? 'remove' : 'add'
			const response = await fetch('/api/favorite', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ articleId, action })
			})

			if (!response.ok) {
				throw new Error(`Failed to ${action} favorite`)
			}

			const result = await response.json()

			if (result.success) {
				if (isFavorite) {
					removeFavorite(articleId)
				} else {
					addFavorite(articleId)
				}
			} else {
				throw new Error(result.message || `Failed to ${action} favorite`)
			}
		} catch (error) {
			console.error('Error toggling favorite:', error)
			setError(error instanceof Error ? error.message : 'An unknown error occurred')
		} finally {
			setIsLoading(false)
		}
	}, [articleId, isFavorite, addFavorite, removeFavorite])

	return { isFavorite, toggleFavorite, isLoading, error }
}
