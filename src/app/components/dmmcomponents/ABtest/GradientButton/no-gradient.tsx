// src/app/components/dmmcomponents/ABtest/GradientButton/ButtonNoGradient.tsx
'use client'

import { trackClick, trackImpression, waitForUmami } from '@/lib/abTestTracking'
import { DMMActressInfo } from '@/types/APItypes'
import { DMMItemMainResponse } from '@/types/dmmitemzodschema'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useRef } from 'react'
import { UmamiTracking } from '../../UmamiTracking'

interface ButtonNoGradientProps {
	ItemMain: DMMItemMainResponse
	actressInfo: DMMActressInfo | null
}

export const ButtonNoGradient = React.memo(({ ItemMain, actressInfo }: ButtonNoGradientProps) => {
	const hasTrackedImpression = useRef(false)

	useEffect(() => {
		// Use an Immediately Invoked Function Expression (IIFE) for async logic
		;(async () => {
			if (!hasTrackedImpression.current && typeof window !== 'undefined') {
				await waitForUmami()
				try {
					await trackImpression('dmmTEST-1006-v1', 'no-g')
					hasTrackedImpression.current = true // Mark impression as tracked
				} catch (error) {
					console.error('Error tracking impression:', error)
				}
			}
		})()
	}, []) // Empty dependency array to run only once on mount

	const handleButtonClick = () => {
		// クリックをトラッキング
		// console.log('クリックをトラッキングスタート')
		trackClick('dmmTEST-1006-v1', 'no-g')
	}

	return (
		<div className='flex justify-center'>
			<Link
				href={ItemMain.affiliateURL || '#'}
				target='_blank'
				rel='noopener noreferrer'
				className='inline-flex items-center justify-center text-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 rounded-full shadow-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 px-6 sm:px-8 py-3 sm:py-4'
				onClick={handleButtonClick}>
				<span className='mr-2'>高画質動画を見る</span>
				<ExternalLink className='w-5 h-5 sm:w-6 sm:h-6 animate-pulse' />
			</Link>
		</div>
	)
})

ButtonNoGradient.displayName = 'ButtonNoGradient'
