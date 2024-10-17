import React from 'react'
import { Star, StarHalf } from 'lucide-react'

interface ReviewInfoProps {
	review_count: number | null
	review_average: number | null
}

const ReviewInfo: React.FC<ReviewInfoProps> = ({ review_count, review_average }) => {
	if (typeof review_count !== 'number' || typeof review_average !== 'number') {
		return null
	}

	const renderStars = (average: number) => {
		const stars = []
		const fullStars = Math.floor(average)
		const hasHalfStar = average % 1 >= 0.5

		for (let i = 0; i < 5; i++) {
			if (i < fullStars) {
				stars.push(<Star key={i} className="text-yellow-400 fill-current" />)
			} else if (i === fullStars && hasHalfStar) {
				stars.push(<StarHalf key={i} className="text-yellow-400 fill-current" />)
			} else {
				stars.push(<Star key={i} className="text-gray-300" />)
			}
		}

		return stars
	}

	return (
		<div className="flex items-center mt-2">
			<div className="flex mr-2" aria-label={`評価: ${review_average}星`}>
				{renderStars(review_average)}
			</div>
			<span className="text-sm text-gray-600">
				{review_average.toFixed(1)} ({review_count.toLocaleString()} レビュー)
			</span>
		</div>
	)
}

export default ReviewInfo
