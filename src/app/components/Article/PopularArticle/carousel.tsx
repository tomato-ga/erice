'use client'

import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react'
import { formatDate } from '@/app/utils/postUtils'
import Link from 'next/link'
import Image from 'next/image'

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

// カスタムフック: カルーセルのロジックを管理
const useCarousel = (itemCount: number) => {
	const [activeIndex, setActiveIndex] = useState(0)
	const [showLeftArrow, setShowLeftArrow] = useState(false)
	const [showRightArrow, setShowRightArrow] = useState(itemCount > 1)
	const carouselRef = useRef<HTMLDivElement>(null)

	const updateArrows = useCallback(() => {
		if (carouselRef.current) {
			const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
			setShowLeftArrow(scrollLeft > 0)
			setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1)
		}
	}, [])

	const scrollToIndex = useCallback((index: number) => {
		if (carouselRef.current) {
			const scrollAmount = carouselRef.current.clientWidth * index
			carouselRef.current.scrollTo({
				left: scrollAmount,
				behavior: 'smooth'
			})
		}
	}, [])

	const handleScroll = useCallback(() => {
		if (carouselRef.current) {
			const { scrollLeft, clientWidth } = carouselRef.current
			const newIndex = Math.round(scrollLeft / clientWidth)
			setActiveIndex(newIndex)
			updateArrows()
		}
	}, [updateArrows])

	const scrollCarousel = useCallback((direction: 'left' | 'right') => {
		if (carouselRef.current) {
			const scrollAmount = carouselRef.current.clientWidth
			carouselRef.current.scrollBy({
				left: direction === 'left' ? -scrollAmount : scrollAmount,
				behavior: 'smooth'
			})
		}
	}, [])

	useEffect(() => {
		const currentRef = carouselRef.current
		if (currentRef) {
			const resizeObserver = new ResizeObserver(() => {
				handleScroll()
			})
			resizeObserver.observe(currentRef)

			return () => {
				resizeObserver.disconnect()
			}
		}
	}, [handleScroll])

	return {
		activeIndex,
		showLeftArrow,
		showRightArrow,
		carouselRef,
		scrollToIndex,
		handleScroll,
		scrollCarousel
	}
}

// 矢印ボタンコンポーネント
const ArrowButton = React.memo(
	({ direction, onClick, show }: { direction: 'left' | 'right'; onClick: () => void; show: boolean }) => {
		if (!show) return null

		const svgPath = direction === 'left' ? 'M15.75 19.5L8.25 12l7.5-7.5' : 'M8.25 4.5l7.5 7.5-7.5 7.5'
		const label = direction === 'left' ? '前の記事へ' : '次の記事へ'

		return (
			<button
				onClick={onClick}
				className={`absolute top-1/2 transform -translate-y-1/2 ${
					direction === 'left' ? 'left-2' : 'right-2'
				} bg-white bg-opacity-50 rounded-full p-2 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
				aria-label={label}
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
)

ArrowButton.displayName = 'ArrowButton'

// ドットインジケーターコンポーネント
const DotIndicator = React.memo(
	({ index, active, onClick }: { index: number; active: boolean; onClick: () => void }) => (
		<button
			onClick={onClick}
			className={`w-2 h-2 rounded-full transition-all duration-300 ${
				active ? 'bg-blue-500 w-4' : 'bg-gray-300'
			} focus:outline-none focus:ring-2 focus:ring-blue-500`}
			aria-label={`${index + 1}番目の記事へジャンプ`}
			aria-current={active ? 'true' : 'false'}
		/>
	)
)

DotIndicator.displayName = 'DotIndicator'

// 記事カードコンポーネント
const ArticleCard = React.memo(({ article, rank }: { article: PopularArticle; rank: number }) => {
	const rankColor = useMemo(() => getRankColor(rank), [rank])
	const rankBorderColor = useMemo(() => getRankBorderColor(rank), [rank])

	return (
		<Link
			href={`/post/${article.id}`}
			className="block focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
			aria-labelledby={`article-${article.id}-title`}
		>
			<div
				className={`relative border-2 ${rankBorderColor} rounded-lg overflow-hidden shadow-lg transition-shadow duration-300 hover:shadow-xl`}
			>
				<div className="relative pt-[56.25%]">
					<Image src={article.image_url} alt="" layout="fill" objectFit="cover" loading="lazy" />
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
	const { activeIndex, showLeftArrow, showRightArrow, carouselRef, scrollToIndex, handleScroll, scrollCarousel } =
		useCarousel(articles.length)

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			switch (e.key) {
				case 'ArrowLeft':
					scrollCarousel('left')
					break
				case 'ArrowRight':
					scrollCarousel('right')
					break
			}
		},
		[scrollCarousel]
	)

	const handleTouchStart = useRef<number | null>(null)
	const handleTouchMove = useRef<number | null>(null)

	const onTouchStart = useCallback((e: React.TouchEvent) => {
		handleTouchStart.current = e.touches[0].clientX
	}, [])

	const onTouchMove = useCallback((e: React.TouchEvent) => {
		handleTouchMove.current = e.touches[0].clientX
	}, [])

	const onTouchEnd = useCallback(() => {
		if (handleTouchStart.current === null || handleTouchMove.current === null) return
		const diff = handleTouchStart.current - handleTouchMove.current
		if (Math.abs(diff) > 50) {
			scrollCarousel(diff > 0 ? 'right' : 'left')
		}
		handleTouchStart.current = null
		handleTouchMove.current = null
	}, [scrollCarousel])

	return (
		<div
			className="relative pb-6"
			onKeyDown={handleKeyDown}
			onTouchStart={onTouchStart}
			onTouchMove={onTouchMove}
			onTouchEnd={onTouchEnd}
		>
			<div
				ref={carouselRef}
				className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide cursor-grab active:cursor-grabbing"
				style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
				onScroll={handleScroll}
				role="region"
				aria-label="人気記事カルーセル"
				tabIndex={0}
			>
				{articles.map((article, index) => (
					<div key={article.id} className="w-full flex-shrink-0 snap-start px-2">
						<ArticleCard article={article} rank={index + 1} />
					</div>
				))}
			</div>
			<ArrowButton direction="left" onClick={() => scrollCarousel('left')} show={showLeftArrow} />
			<ArrowButton direction="right" onClick={() => scrollCarousel('right')} show={showRightArrow} />
			{articles.length > 1 && (
				<div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
					{articles.map((_, index) => (
						<DotIndicator
							key={index}
							index={index}
							active={index === activeIndex}
							onClick={() => scrollToIndex(index)}
						/>
					))}
				</div>
			)}
			<div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-50" />
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

export default React.memo(Carousel)
