// SampleImageGallery.tsx
import React from 'react'

interface SampleImageGalleryProps {
	title: string
	contentId: string
	sampleImageURLs: (string | null | undefined)[]
}

const DoujinSampleImageGallery: React.FC<SampleImageGalleryProps> = ({
	title,
	contentId,
	sampleImageURLs,
}) => {
	const validUrls = sampleImageURLs.filter((url): url is string => url != null)
	if (!validUrls || validUrls.length === 0) return null

	return (
		<div className='mt-8'>
			<h2 className='text-center font-bold mb-6'>
				<span className='text-2xl bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text'>
					見所シーンキャプチャ画像
				</span>
			</h2>
			<div className='grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4'>
				{validUrls.map((imageUrl, index) => (
					<div
						key={index}
						className='aspect-w-16 aspect-h-9 relative overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300'>
						<img
							src={imageUrl}
							alt={`${title} ${contentId}のサンプル画像${index + 1}`}
							className='w-full h-full object-contain transition-transform duration-300'
							decoding='async'
							loading='lazy'
							fetchPriority='low'
						/>
					</div>
				))}
			</div>
		</div>
	)
}

export default DoujinSampleImageGallery
