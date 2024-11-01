'use client'

import Image from 'next/image'
import React, { useState, useCallback } from 'react'

interface SampleImage {
	large?: string
	small?: string
}

interface SampleImagesProps {
	sample_images?: SampleImage[]
}

const SampleImages: React.FC<SampleImagesProps> = ({ sample_images }) => {
	const [selectedImage, setSelectedImage] = useState<string | null>(null)

	const handleImageClick = useCallback((imageUrl: string) => {
		setSelectedImage(imageUrl)
	}, [])

	const handleCloseModal = useCallback(() => {
		setSelectedImage(null)
	}, [])

	if (!sample_images || sample_images.length === 0) return null

	return (
		<div className='mt-6'>
			<h3 className='font-semibold text-lg mb-4'>サンプル画像</h3>
			<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
				{sample_images.map((img, index) => {
					const imageUrl = img.small || img.large
					if (!imageUrl) return null

					return (
						<div
							key={index}
							className='cursor-pointer'
							onClick={() => handleImageClick(img.large || img.small || '')}>
							<img
								src={imageUrl}
								alt={`サンプル画像 ${index + 1}`}
								width={200}
								height={200}
								className='w-full h-auto object-cover'
							/>
						</div>
					)
				})}
			</div>
			{selectedImage && (
				<div
					className='fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50'
					onClick={handleCloseModal}>
					<div className='max-w-4xl max-h-full p-4'>
						<img
							src={selectedImage}
							alt='拡大画像'
							width={800}
							height={600}
							className='w-full h-auto object-cover'
						/>
					</div>
				</div>
			)}
		</div>
	)
}

export default SampleImages
