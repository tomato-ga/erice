import { cache } from 'react'
import Link from 'next/link'

interface TagCloudProps {
	keywords?: string[]
}

const fetchKeywords = cache(async () => {
	try {
		// Use an absolute URL or a base URL + relative path
		const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/poptags', { next: { revalidate: 3600 } })
		if (!response.ok) {
			throw new Error('Failed to fetch popular keywords')
		}
		return response.json()
	} catch (error) {
		console.error('Error fetching keywords:', error)
		return [] // Return an empty array in case of error
	}
})

export default async function TagCloud({ keywords: initialKeywords = [] }: TagCloudProps) {
	const keywords = (await fetchKeywords()) || initialKeywords

	if (keywords.length === 0) {
		return <div className="text-gray-500 text-sm">No keywords available at the moment.</div>
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

// px-3 py-1
// text-sm text-gray-700
// border-b-2 border-pink-200
// transition-all duration-200 ease-in-out
// hover:bg-gray-100 hover:text-gray-800
