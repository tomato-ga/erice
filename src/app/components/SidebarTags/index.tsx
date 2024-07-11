'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

interface TagCloudProps {
	keywords?: string[]
}

export default function TagCloud({ keywords: initialKeywords = [] }: TagCloudProps) {
	const [keywords, setKeywords] = useState<string[]>(initialKeywords)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchKeywords = async () => {
			try {
				const response = await fetch('/api/poptags')
				if (!response.ok) {
					const errorData = await response.text()
					throw new Error(errorData || 'Failed to fetch popular keywords')
				}
				const data = await response.json()
				setKeywords(data)
			} catch (error: unknown) {
				if (error instanceof Error) {
					setError(error.message)
				} else {
					setError('An unknown error occurred')
				}
			}
		}

		fetchKeywords()
	}, [])

	const getRandomSize = () => {
		const sizes = ['text-sm', 'text-base', 'text-lg']
		return sizes[Math.floor(Math.random() * sizes.length)]
	}

	if (error) {
		return <div className="text-red-600">Error: {error}</div>
	}

	return (
		<div className="flex flex-wrap justify-center gap-2">
			{keywords.map((keyword, index) => (
				<Link href={`/tag/${encodeURIComponent(keyword)}`} key={index}>
					<span
						className={`
            ${getRandomSize()}
            text-gray-700 hover:text-black
            transition-colors duration-200
            cursor-pointer
          `}
					>
						{keyword}
					</span>
				</Link>
			))}
		</div>
	)
}
