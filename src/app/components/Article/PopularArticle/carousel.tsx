'use client'

import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react'
import { formatDate } from '@/app/utils/postUtils'
import Link from 'next/link'
import { handleUmamiClick } from '@/lib/umamiTracking'

export interface PopularArticle {
	id: number
	title: string
	link: string
	created_at: string
	image_url: string
	site_name: string
	total_clicks: number
}

interface CarouselProps {
	articles: PopularArticle[]
}

const DESKTOP_ITEMS_PER_PAGE = 3
const MOBILE_ITEMS_PER_PAGE = 1.2
const MOBILE_BREAKPOINT = 768

// debounce関数の実装
const debounce = <F extends (...args: any[]) => any>(func: F, wait: number) => {
	let timeout: ReturnType<typeof setTimeout> | null = null
	return (...args: Parameters<F>) => {
		if (timeout !== null) {
			clearTimeout(timeout)
		}
		timeout = setTimeout(() => func(...args), wait)
	}
}

const useCarousel = (articles: PopularArticle[]) => {
	const [showLeftArrow, setShowLeftArrow] = useState(false)
	const [showRightArrow, setShowRightArrow] = useState(true)
	const [isMobile, setIsMobile] = useState(false)
	const carouselRef = useRef<HTMLDivElement>(null)

	const handleScroll = useCallback(() => {
		if (carouselRef.current) {
			const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
			setShowLeftArrow(scrollLeft > 0)
			setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1)
		}
	}, [])

	const debouncedHandleScroll = useMemo(() => debounce(handleScroll, 50), [handleScroll])

	const scrollCarousel = useCallback(
		(direction: 'left' | 'right') => {
			if (carouselRef.current) {
				const itemsPerPage = isMobile ? MOBILE_ITEMS_PER_PAGE : DESKTOP_ITEMS_PER_PAGE
				const scrollAmount = carouselRef.current.clientWidth / itemsPerPage
				carouselRef.current.scrollBy({
					left: direction === 'left' ? -scrollAmount : scrollAmount,
					behavior: 'smooth'
				})
			}
		},
		[isMobile]
	)

	useEffect(() => {
		const handleResize = () => {
			const newIsMobile = window.innerWidth < MOBILE_BREAKPOINT
			setIsMobile(newIsMobile)
		}
		handleResize()
		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [])

	useEffect(() => {
		const currentRef = carouselRef.current
		if (currentRef) {
			currentRef.addEventListener('scroll', debouncedHandleScroll)
			return () => {
				currentRef.removeEventListener('scroll', debouncedHandleScroll)
			}
		}
	}, [debouncedHandleScroll])

	return {
		showLeftArrow,
		showRightArrow,
		carouselRef,
		scrollCarousel,
		isMobile
	}
}

const ArrowButton: React.FC<{
	direction: 'left' | 'right'
	onClick: () => void
	show: boolean
}> = ({ direction, onClick, show }) => {
	if (!show) return null

	const svgPath = direction === 'left' ? 'M15.75 19.5L8.25 12l7.5-7.5' : 'M8.25 4.5l7.5 7.5-7.5 7.5'

	return (
		<button
			onClick={onClick}
			className={`absolute top-1/2 transform -translate-y-1/2 ${
				direction === 'left' ? 'left-2' : 'right-2'
			} bg-white bg-opacity-50 rounded-full p-2 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
			aria-label={direction === 'left' ? '前の記事へ' : '次の記事へ'}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				strokeWidth={1.5}
				stroke="currentColor"
				className="w-6 h-6"
			>
				<path strokeLinecap="round" strokeLinejoin="round" d={svgPath} />
			</svg>
		</button>
	)
}

const ArticleCard: React.FC<{ article: PopularArticle; rank: number }> = React.memo(({ article, rank }) => {
	const rankColor = useMemo(() => getRankColor(rank), [rank])
	const rankBorderColor = useMemo(() => getRankBorderColor(rank), [rank])

	return (
		<Link
			href={`/post/${article.id}`}
			className="block focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
			aria-labelledby={`article-${article.id}-title`}
			onClick={() => handleUmamiClick('Kobetu-Popular', article)}
		>
			<div
				className={`relative border-2 ${rankBorderColor} rounded-lg overflow-hidden shadow-lg transition-shadow duration-300 hover:shadow-xl`}
			>
				<div className="relative pt-[56.25%]">
					<img
						src={article.image_url}
						alt=""
						className="absolute top-0 left-0 w-full h-full object-cover"
						loading="lazy"
					/>
					<span
						className={`absolute top-0 left-0 ${rankColor} px-3 py-1 text-sm font-bold ${rank <= 3 ? 'ribbon' : ''}`}
						aria-label={`ランキング ${rank}位`}
					>
						{rank}
					</span>
				</div>
				<div className="p-3">
					<h3 id={`article-${article.id}-title`} className="text-sm mb-2 line-clamp-2">
						{article.title}
					</h3>
					<div className="flex justify-between items-center text-xs text-gray-500">
						<time dateTime={article.created_at}>{formatDate(article.created_at)}</time>
					</div>
				</div>
			</div>
		</Link>
	)
})

ArticleCard.displayName = 'ArticleCard'

const Carousel: React.FC<CarouselProps> = ({ articles }) => {
	const { showLeftArrow, showRightArrow, carouselRef, scrollCarousel, isMobile } = useCarousel(articles)

	const handleKeyDown = (e: React.KeyboardEvent) => {
		switch (e.key) {
			case 'ArrowLeft':
				scrollCarousel('left')
				break
			case 'ArrowRight':
				scrollCarousel('right')
				break
		}
	}

	return (
		<div className="relative pb-6" onKeyDown={handleKeyDown}>
			<div
				ref={carouselRef}
				className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide cursor-grab active:cursor-grabbing"
				style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
				role="region"
				aria-label="人気記事カルーセル"
				tabIndex={0}
			>
				{articles.map((article, index) => (
					<div key={article.id} className={`flex-shrink-0 snap-start px-2 ${isMobile ? 'w-[83.33%]' : 'w-1/3'}`}>
						<ArticleCard article={article} rank={index + 1} />
					</div>
				))}
			</div>
			<ArrowButton direction="left" onClick={() => scrollCarousel('left')} show={showLeftArrow} />
			<ArrowButton direction="right" onClick={() => scrollCarousel('right')} show={showRightArrow} />
		</div>
	)
}

const getRankColor = (rank: number): string => {
	switch (rank) {
		case 1:
			return 'bg-rank-gold text-black'
		case 2:
			return 'bg-rank-silver text-black'
		case 3:
			return 'bg-rank-bronze text-black'
		default:
			return 'bg-gray-200 text-gray-700'
	}
}

const getRankBorderColor = (rank: number): string => {
	switch (rank) {
		case 1:
			return 'border-rank-gold'
		case 2:
			return 'border-rank-silver'
		case 3:
			return 'border-rank-bronze'
		default:
			return 'border-gray-200'
	}
}

export default Carousel
