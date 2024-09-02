'use client'

import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination'
import React, { useMemo } from 'react'

interface PaginationComponentProps {
	currentPage: number
	totalPages: number
	category?: string
	categoryType: 'actress' | 'genre' | 'style' | 'type'
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({
	currentPage,
	totalPages,
	category,
	categoryType,
}) => {
	const pageNumbers = useMemo(() => {
		const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4))
		return Array.from({ length: Math.min(5, totalPages) }, (_, i) => start + i)
	}, [currentPage, totalPages])

	const getHref = (page: number) => {
		if (categoryType === 'actress') {
			if (page === 1) {
				return `/actress/${encodeURIComponent(category as string)}`
			}
			return `/actress/${encodeURIComponent(category as string)}/page/${page}`
		}
		if (categoryType === 'genre') {
			if (page === 1) {
				return `/genre/${encodeURIComponent(category as string)}`
			}
			return `/genre/${encodeURIComponent(category as string)}/page/${page}`
		}
		// どちらでもない場合はルートパスへ
		if (page === 1) {
			return '/'
		}
		return `/page/${page}`
	}

	if (totalPages <= 1) {
		return null // ページが1つしかない場合はページネーションを表示しない
	}

	return (
		<nav aria-label='Pagination' className='my-8'>
			<Pagination>
				<PaginationContent>
					{currentPage > 1 && (
						<PaginationItem>
							<PaginationPrevious href={getHref(currentPage - 1)} aria-label='Go to previous page' />
						</PaginationItem>
					)}
					{pageNumbers.map(pageNumber => (
						<PaginationItem key={pageNumber}>
							<PaginationLink
								href={getHref(pageNumber)}
								isActive={pageNumber === currentPage}
								aria-label={`Go to page ${pageNumber}`}>
								{pageNumber}
							</PaginationLink>
						</PaginationItem>
					))}
					{currentPage < totalPages && (
						<PaginationItem>
							<PaginationNext href={getHref(currentPage + 1)} aria-label='Go to next page' />
						</PaginationItem>
					)}
				</PaginationContent>
			</Pagination>
		</nav>
	)
}

export default PaginationComponent
