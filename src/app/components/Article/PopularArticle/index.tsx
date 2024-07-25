'use client'

import React from 'react'
import Carousel from './carousel'
import { PopularArticle as PopularArticleType } from '../../../../../types/types'

interface PopularArticleProps {
	articles: PopularArticleType[]
}

const PopularArticle: React.FC<PopularArticleProps> = ({ articles }) => {
	return (
		<section className="container mx-auto px-1 py-8" aria-labelledby="popular-articles-heading">
			<h3
				id="popular-articles-heading"
				className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text"
			>
				今日の人気動画
			</h3>
			<Carousel articles={articles} />
		</section>
	)
}

export default PopularArticle
