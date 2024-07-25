// TagCloud.tsx
import React from 'react'
import Link from 'next/link'

async function getKeywords(): Promise<string[]> {
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

const TagCloud = async () => {
	let keywords: string[] = []
	let error: string | null = null

	try {
		keywords = await getKeywords()
	} catch (err) {
		console.error('Error fetching keywords:', err)
		error = 'キーワードの取得に失敗しました。'
	}

	if (error) {
		return <div className="text-red-500 text-sm">{error}</div>
	}

	if (keywords.length === 0) {
		return <div className="text-gray-500 text-sm">キーワードがありません。</div>
	}

	return (
		<div className="flex flex-wrap gap-2 justify-center items-center -my-1">
			<p className="w-full text-center mb-2 font-semibold">人気のキーワード</p>
			{keywords.map((keyword: string, index: number) => (
				<Link href={`/tag/${encodeURIComponent(keyword)}`} key={index} className="my-4">
					<span className="relative px-1 py-1 m-1 rounded-md shadow-sm sm:py-2 sm:text-base ring ring-transparent group md:px-4 hover:ring hover:ring-opacity-50 focus:ring-opacity-50 hover:ring-pink-600 text-gray-900 bg-gray-100 dark:bg-gray-400 dark:text-gray-200">
						{keyword}
					</span>
				</Link>
			))}
		</div>
	)
}

export default TagCloud
