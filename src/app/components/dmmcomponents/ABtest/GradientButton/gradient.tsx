// src/app/components/dmmcomponents/ABtest/GradientButton/ButtonWithGradient.tsx
'use client'

import { trackClick, trackImpression, waitForUmami } from '@/lib/abTestTracking'
import { DMMActressInfo } from '@/types/APItypes'
import { DMMItemMainResponse } from '@/types/dmmitemzodschema'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useRef } from 'react'
import { UmamiTracking } from '../../UmamiTracking'

interface ButtonWithGradientProps {
	ItemMain: DMMItemMainResponse
	actressInfo: DMMActressInfo | null
}

export const ButtonWithGradient = React.memo(
	({ ItemMain, actressInfo }: ButtonWithGradientProps) => {
		const hasTrackedImpression = useRef(false)

		useEffect(() => {
			// Use an Immediately Invoked Function Expression (IIFE) for async logic
			;(async () => {
				if (!hasTrackedImpression.current && typeof window !== 'undefined') {
					await waitForUmami()
					try {
						await trackImpression('dmmTEST-1006-v1', 'with-g')
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
			trackClick('dmmTEST-1006-v1', 'with-g')
		}

		return (
			<div className='flex justify-center'>
				<div className='relative inline-block group'>
					<div className='absolute inset-2 rounded-full opacity-70 blur-xl group-hover:opacity-100 transition-opacity duration-500 ease-in-out bg-custom-gradient-exbutton bg-custom-gradient-exbutton--dmm z-0 pointer-events-none' />
					<Link
						href={ItemMain.affiliateURL}
						target='_blank'
						rel='noopener noreferrer'
						className='relative z-10 inline-flex items-center justify-center text-xl font-semibold text-white rounded-full shadow-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 px-6 sm:px-8 py-3 sm:py-4 hover:bg-gray-700 transform hover:-translate-y-0.5 bg-custom-gradient-exbutton bg-custom-gradient-exbutton--dmm'
						onClick={handleButtonClick}>
						<span className='mr-2'>高画質動画を見る</span>
						<ExternalLink className='w-5 h-5 sm:w-6 sm:h-6 animate-pulse' />
					</Link>
				</div>
			</div>
		)
	},
)

ButtonWithGradient.displayName = 'ButtonWithGradient'
