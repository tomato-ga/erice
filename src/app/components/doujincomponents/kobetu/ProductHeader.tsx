import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { UmamiTracking } from '../../dmmcomponents/UmamiTracking'
import { UmamiTrackingFromType } from '@/types/umamiTypes'

interface PackageImages {
	large?: string
	list?: string
}

interface ProductHeaderProps {
	title: string
	package_images: PackageImages
	affiliate_url: string
	umamifrom: UmamiTrackingFromType
}

const ProductHeader: React.FC<ProductHeaderProps> = ({ title, package_images, affiliate_url, umamifrom }) => {
	const imageUrl = package_images.large || package_images.list

	return (
		<div className="bg-white rounded-lg overflow-hidden shadow-lg p-6">
			<h1 className="text-3xl font-bold mb-4">{title}</h1>
			<div className="flex flex-col md:flex-row">
				<div className="md:w-1/2">
					{imageUrl ? (
						<Image
							src={imageUrl}
							alt={title}
							width={500}
							height={500}
							layout="responsive"
							objectFit="contain"
							priority
						/>
					) : (
						<div className="bg-gray-200 w-full h-64 flex items-center justify-center">
							<span className="text-gray-500">No image available</span>
						</div>
					)}
				</div>
				<div className="md:w-1/2 md:pl-6 mt-4 md:mt-0 flex items-center">
					<UmamiTracking
						trackingData={{
							dataType: 'item',
							from: umamifrom,
							featureType: 'product-header',
							item: { title, affiliate_url }
						}}
					>
						<Link
							href={affiliate_url}
							className="inline-block bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
							target="_blank"
							rel="noopener noreferrer"
						>
							商品ページへ
						</Link>
					</UmamiTracking>
				</div>
			</div>
		</div>
	)
}

export default ProductHeader
