// src/app/components/dmmcomponents/ABtest/GradientButton/no-gradient.tsx
'use client'

import { trackClick, trackImpression, waitForUmami } from '@/lib/abTestTracking'

import { DoujinKobetuItem } from '@/_types_doujin/doujintypes'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { UmamiTracking } from '../../UmamiTracking'

interface ButtonNoGradientProps {
	item: DoujinKobetuItem
}

export const DoujinButtonNoGradient = ({ item }: ButtonNoGradientProps) => {
	// useRef to track if the impression has been tracked
	const hasTrackedImpression = useRef(false)

	useEffect(() => {
		// Use an Immediately Invoked Function Expression (IIFE) for async logic
		;(async () => {
			if (!hasTrackedImpression.current && typeof window !== 'undefined') {
				await waitForUmami()
				try {
					await trackImpression('DojTEST-1006-v1', 'no-g')
					hasTrackedImpression.current = true // Mark impression as tracked
				} catch (error) {
					console.error('Error tracking impression:', error)
				}
			}
		})()
	}, []) // Empty dependency array to run only once on mount

	const handleButtonClick = () => {
		// クリックをトラッキング
		try {
			trackClick('DojTEST-1006-v1', 'no-g')
		} catch (error) {
			console.error('Error tracking click:', error)
		}
	}

	return (
		<div className='flex justify-center items-center'>
			<div className='relative inline-block  items-center'>
				{/* グラデーションオーバーレイ */}
				{/* <div className="absolute inset-2 rounded-full opacity-80 blur-lg group-hover:opacity-100 transition-opacity duration-500 ease-in-out bg-custom-gradient-exbutton bg-custom-gradient-exbutton--doujin z-0" /> */}
				{/* ボタン */}

				<a
					href={item.affiliate_url}
					target='_blank'
					rel='noopener noreferrer'
					className='inline-flex items-center justify-center text-xl font-semibold text-white bg-gradient-to-r from-pink-500 to-rose-600 dark:from-pink-600 dark:to-rose-700 rounded-full shadow-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 dark:focus:ring-pink-400 px-8 py-4'
					onClick={handleButtonClick}>
					<span className='mr-2'>作品をフルで見る</span>
					<ExternalLink className='w-5 h-5 sm:w-6 sm:h-6 animate-pulse' />
				</a>
			</div>
		</div>
	)
}
