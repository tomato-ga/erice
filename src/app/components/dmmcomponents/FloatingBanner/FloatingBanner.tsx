'use client'

import { X } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import './styles.css'

interface SaleFloatingBannerProps {
	saleLink: string
	saleText: string
	minWidth?: string
	maxWidth?: string
}

export default function SaleFloatingBanner({
	saleLink,
	saleText,
	minWidth = '300px',
	maxWidth = '90%',
}: SaleFloatingBannerProps) {
	const [isVisible, setIsVisible] = useState(false)

	const updateBannerWidth = useCallback(() => {
		const isMobile = window.innerWidth <= 600
		if (isMobile) {
			const calculatedWidth = Math.min(window.innerWidth * 0.9, Number.parseInt(maxWidth))
			document.documentElement.style.setProperty('--banner-width', `${calculatedWidth}px`)
		} else {
			document.documentElement.style.setProperty('--banner-width', minWidth)
		}
	}, [minWidth, maxWidth])

	useEffect(() => {
		const bannerClosed = localStorage.getItem('saleBannerClosed')
		if (!bannerClosed) {
			setIsVisible(true)
		}

		updateBannerWidth()
		window.addEventListener('resize', updateBannerWidth)

		return () => {
			window.removeEventListener('resize', updateBannerWidth)
		}
	}, [updateBannerWidth])

	const closeBanner = () => {
		setIsVisible(false)
		localStorage.setItem('saleBannerClosed', 'true')
	}

	if (!isVisible) return null

	return (
		<div className='sale-floating-banner'>
			<button onClick={closeBanner} className='sale-floating-banner__close-button' type='button'>
				<X size={20} />
			</button>
			<div className='sale-floating-banner__content'>
				<p className='sale-floating-banner__title text-base'>セール情報</p>
				<Link href={saleLink} className='sale-floating-banner__link'>
					{saleText}
				</Link>
			</div>
		</div>
	)
}
