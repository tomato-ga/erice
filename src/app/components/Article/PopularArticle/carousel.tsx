'use client'

import React, { useState, useEffect, useRef } from 'react'
import { PopularArticle } from '../../../../../types/types'

interface CarouselProps {
	articles: PopularArticle[]
}

const Carousel: React.FC<CarouselProps> = ({ articles }) => {
	const [isVisible, setIsVisible] = useState(false)
	const [isDragging, setIsDragging] = useState(false)
	const [startX, setStartX] = useState(0)
	const [scrollLeft, setScrollLeft] = useState(0)
	const containerRef = useRef<HTMLDivElement>(null)
	const carouselRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const options = {
			root: null,
			rootMargin: '0px',
			threshold: 0.1
		}

		const currentContainer = containerRef.current

		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					setIsVisible(true)
					observer.unobserve(entry.target)
				}
			})
		}, options)

		if (currentContainer) {
			observer.observe(currentContainer)
		}

		return () => {
			if (currentContainer) {
				observer.unobserve(currentContainer)
			}
		}
	}, [])

	const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
		setIsDragging(true)
		setStartX(e.pageX - (carouselRef.current?.offsetLeft || 0))
		setScrollLeft(carouselRef.current?.scrollLeft || 0)
	}

	const handleMouseLeave = () => {
		setIsDragging(false)
	}

	const handleMouseUp = () => {
		setIsDragging(false)
	}

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		if (!isDragging) return
		e.preventDefault()
		const x = e.pageX - (carouselRef.current?.offsetLeft || 0)
		const walk = (x - startX) * 2 // スクロール速度を調整
		if (carouselRef.current) {
			carouselRef.current.scrollLeft = scrollLeft - walk
		}
	}

	return (
		<div ref={containerRef} className={`transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
			{isVisible && (
				<div className="relative">
					<div
						ref={carouselRef}
						className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide cursor-grab active:cursor-grabbing"
						style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
						onMouseDown={handleMouseDown}
						onMouseLeave={handleMouseLeave}
						onMouseUp={handleMouseUp}
						onMouseMove={handleMouseMove}
					>
						{articles.map((article, index) => (
							<div key={article.id} className="w-3/4 sm:w-1/2 md:w-1/3 lg:w-1/4 flex-shrink-0 snap-start px-2">
								<ArticleCard article={article} rank={index + 1} />
							</div>
						))}
					</div>
					<div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-50" />
				</div>
			)}
		</div>
	)
}

const getRankColor = (rank: number): string => {
	switch (rank) {
		case 1:
			return 'bg-gold-500 text-black'
		case 2:
			return 'bg-silver-400 text-black'
		case 3:
			return 'bg-bronze-300 text-black'
		default:
			return 'bg-gray-200 text-gray-700'
	}
}

const getRankBorderColor = (rank: number): string => {
	switch (rank) {
		case 1:
			return 'border-gold-500'
		case 2:
			return 'border-silver-400'
		case 3:
			return 'border-bronze-300'
		default:
			return 'border-gray-200'
	}
}

const ArticleCard: React.FC<{ article: PopularArticle; rank: number }> = React.memo(({ article, rank }) => (
	<a href={article.link} className="block group" aria-labelledby={`article-${article.id}-title`}>
		<div
			className={`relative border-2 ${getRankBorderColor(
				rank
			)} rounded-lg overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105`}
		>
			<div className="relative pt-[56.25%]">
				<img src={article.image_url} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
				<div
					className={`absolute top-0 left-0 ${getRankColor(rank)} px-3 py-1 text-sm font-bold ${
						rank <= 3 ? 'ribbon' : ''
					}`}
					aria-label={`ランキング ${rank}位`}
				>
					{rank}
				</div>
			</div>
			<div className="p-3">
				<h3 id={`article-${article.id}-title`} className="font-semibold text-sm mb-2 line-clamp-2">
					{article.title}
				</h3>
				<p className="text-xs text-gray-600 mb-2">{article.site_name}</p>
				<div className="flex justify-between items-center text-xs text-gray-500">
					<time dateTime={article.created_at}>{new Date(article.created_at).toLocaleDateString()}</time>
					<span>{article.total_clicks.toLocaleString()} クリック</span>
				</div>
			</div>
		</div>
	</a>
))

ArticleCard.displayName = 'ArticleCard'

export default Carousel
