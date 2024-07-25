'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

async function getKeywords(): Promise<string[]> {
	const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/poptags`)
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`)
	}
	const data = await response.json()
	if (!Array.isArray(data)) {
		throw new Error('Data is not an array')
	}
	return data
}

const TagCloud = () => {
	const [keywords, setKeywords] = useState<string[]>([])
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchKeywords = async () => {
			try {
				const data = await getKeywords()
				setKeywords(data)
			} catch (err) {
				console.error('Error fetching keywords:', err)
				setError('キーワードの取得に失敗しました。')
			} finally {
			}
		}

		fetchKeywords()
	}, [])

	if (error) {
		return <div className="text-red-500 text-sm">{error}</div>
	}

	return (
		<div className="mb-4 bg-white p-4 rounded-lg shadow">
			<h2 className="text-lg font-semibold mb-2">人気のキーワード</h2>
			<div className="flex flex-wrap gap-2">
				{keywords.map((keyword, index) => (
					<Link
						href={`/tag/${encodeURIComponent(keyword)}`}
						key={index}
						className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded transition duration-300"
					>
						{keyword}
					</Link>
				))}
			</div>
		</div>
	)
}

export default TagCloud
