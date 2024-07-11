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
					throw new Error('Failed to fetch popular keywords')
				}
				const data = await response.json()
				setKeywords(data)
			} catch (error) {
				setError('An error occurred while fetching keywords')
			}
		}

		fetchKeywords()
	}, [])

	if (error) {
		return <div className="text-red-500 text-sm">{error}</div>
	}

	return (
		<div className="flex flex-wrap gap-2 justify-center items-center -my-2">
			<p>人気のキーワード</p>
			{keywords.map((keyword, index) => (
				<Link href={`/tag/${encodeURIComponent(keyword)}`} key={index} className="my-1">
					<span
						className="
            px-3 py-1
            text-sm text-gray-700 
            bg-pink-200 
            rounded-md
            transition-all duration-200 ease-in-out
            hover:bg-gray-200 hover:text-gray-800
          "
					>
						{keyword}
					</span>
				</Link>
			))}
		</div>
	)
}
