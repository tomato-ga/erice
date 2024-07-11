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
		<div className="flex flex-wrap gap-2 justify-center items-center -my-2">
			<p className="w-full text-center mb-2">人気のキーワード</p>
			{keywords.map((keyword: string, index: number) => (
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
