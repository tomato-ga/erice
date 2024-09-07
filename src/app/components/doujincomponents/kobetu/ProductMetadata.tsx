import React from 'react'
import Link from 'next/link'

interface MetadataItem {
	id: number
	name: string
}

interface ProductMetadataProps {
	genres?: MetadataItem[]
	makers?: MetadataItem[]
	series?: MetadataItem[]
}

const MetadataSection: React.FC<{ title: string; items?: MetadataItem[] }> = ({ title, items }) => {
	if (!items || items.length === 0) return null

	return (
		<div className="mb-4">
			<h3 className="font-semibold text-lg mb-2">{title}</h3>
			<ul className="flex flex-wrap gap-2">
				{items.map((item) => (
					<li key={item.id}>
						<Link
							href={`/search?${encodeURIComponent(title.toLowerCase())}=${encodeURIComponent(item.id.toString())}`}
							className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-full text-sm transition duration-300"
						>
							{item.name}
						</Link>
					</li>
				))}
			</ul>
		</div>
	)
}

const ProductMetadata: React.FC<ProductMetadataProps> = ({ genres, makers, series }) => {
	return (
		<div className="mt-6">
			<MetadataSection title="ジャンル" items={genres} />
			<MetadataSection title="メーカー" items={makers} />
			<MetadataSection title="シリーズ" items={series} />
		</div>
	)
}

export default ProductMetadata
