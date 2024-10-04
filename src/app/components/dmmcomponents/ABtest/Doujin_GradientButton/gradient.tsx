// src/app/components/dmmcomponents/ABtest/GradientButton/ButtonWithGradient.tsx
'use client'

import { trackClick, trackImpression, waitForUmami } from '@/lib/abTestTracking'

import { DoujinKobetuItem } from '@/_types_doujin/doujintypes'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { UmamiTracking } from '../../UmamiTracking'

interface ButtonWithGradientProps {
	item: DoujinKobetuItem
}

export const DoujinButtonWithGradient = ({ item }: ButtonWithGradientProps) => {
	// useRef to track if the impression has been tracked
	const hasTrackedImpression = useRef(false)

	useEffect(() => {
		// Use an Immediately Invoked Function Expression (IIFE) for async logic
		;(async () => {
			if (!hasTrackedImpression.current && typeof window !== 'undefined') {
				await waitForUmami()
				try {
					await trackImpression('DojTEST-1004-v2', 'with-g')
					hasTrackedImpression.current = true // Mark impression as tracked
				} catch (error) {
					console.error('Error tracking impression:', error)
				}
			}
		})()
	}, []) // Empty dependency array to run only once on mount

	const handleButtonClick = async () => {
		// クリックをトラッキング
		try {
			await trackClick('DojTEST-1004', 'with-g')
		} catch (error) {
			console.error('Error tracking click:', error)
		}
	}

	return (
		<div className='flex justify-center items-center'>
			<div className='relative inline-block  items-center'>
				{/* グラデーションオーバーレイ */}
				<div className='absolute inset-2 rounded-full opacity-80 blur-lg group-hover:opacity-100 transition-opacity duration-500 ease-in-out bg-custom-gradient-exbutton bg-custom-gradient-exbutton--doujin z-0' />
				{/* ボタン */}

				<a
					href={item.affiliate_url}
					target='_blank'
					rel='noopener noreferrer'
					className='relative inline-flex items-center justify-center text-xl font-semibold text-white rounded-full shadow-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 px-6 sm:px-8 py-3 sm:py-4 hover:bg-gray-700 transform hover:-translate-y-0.5 bg-custom-gradient-exbutton bg-custom-gradient-exbutton--doujin'
					onClick={handleButtonClick}>
					<span className='mr-2'>作品をフルで見る</span>
					<ExternalLink className='w-5 h-5 sm:w-6 sm:h-6 animate-pulse' />
				</a>
			</div>
		</div>
	)
}
