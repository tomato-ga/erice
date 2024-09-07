import { UmamiTrackingFromType } from '@/types/umamiTypes'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { UmamiTracking } from '../../dmmcomponents/UmamiTracking'

interface ProductHeaderProps {
	title: string
	package_images: string
	affiliate_url: string
	umamifrom: string
}

const ProductHeader: React.FC<ProductHeaderProps> = ({
	title,
	package_images,
	affiliate_url,
	umamifrom,
}) => {
	return (
		<div className='bg-white rounded-lg overflow-hidden shadow-lg p-6'>
			<h1 className='text-3xl font-bold mb-4'>{title}</h1>
			<div className='flex flex-col md:flex-row'>
				<div className='md:w-1/2'>
					{package_images ? (
						<img src={package_images} alt={title} width={500} height={500} />
					) : (
						<div className='bg-gray-200 w-full h-64 flex items-center justify-center'>
							<span className='text-gray-500'>No image available</span>
						</div>
					)}
				</div>
				<div className='md:w-1/2 md:pl-6 mt-4 md:mt-0 flex items-center'>
					<UmamiTracking
						trackingData={{
							dataType: 'item',
							from: umamifrom,
							item: { title },
						}}>
						<Link
							href={affiliate_url}
							className='inline-block bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300'
							target='_blank'
							rel='noopener noreferrer'>
							商品ページへ
						</Link>
					</UmamiTracking>
				</div>
			</div>
		</div>
	)
}

export default ProductHeader
