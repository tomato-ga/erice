'use client'

// hooks/useKeywords.ts
import { useState, useEffect } from 'react'

export async function getKeywords(): Promise<string[]> {
	const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/poptags`, { next: { revalidate: 3600 } })
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`)
	}
	const data = await response.json()
	if (!Array.isArray(data)) {
		throw new Error('Data is not an array')
	}
	return data
}

export function useKeywords() {
	const [keywords, setKeywords] = useState<string[]>([])
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		let isMounted = true
		getKeywords()
			.then((data) => {
				if (isMounted) setKeywords(data)
			})
			.catch((err) => {
				console.error('Error fetching keywords:', err)
				if (isMounted) setError('キーワードの取得に失敗しました。')
			})
		return () => {
			isMounted = false
		}
	}, [])

	return { keywords, error }
}
