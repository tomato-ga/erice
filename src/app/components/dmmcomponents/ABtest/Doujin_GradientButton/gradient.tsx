// src/app/components/dmmcomponents/ABtest/GradientButton/ButtonWithGradient.tsx
'use client'

import { trackClick, trackImpression } from '@/lib/abTestTracking'

import { DoujinKobetuItem } from '@/_types_doujin/doujintypes'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'
import { UmamiTracking } from '../../UmamiTracking'

interface ButtonWithGradientProps {
	item: DoujinKobetuItem
}

export const DoujinButtonWithGradient = ({ item }: ButtonWithGradientProps) => {
	useEffect(() => {
		// window.umami の存在を確認
		console.log('env', process.env.UMAMI_WEBSITE_ID)

		if (typeof window !== 'undefined' && window.umami) {
			console.log('Umami is available in DoujinButtonWithGradient component')
		} else {
			console.error('Umami is NOT available in DoujinButtonWithGradient component')
		}

		trackImpression('ButtonGradientTest-Doujin', 'with-gradient-button')
	}, [])

	const handleButtonClick = () => {
		// クリックをトラッキング
		trackClick('ButtonGradientTest-Doujin', 'with-gradient-button')
	}

	return (
		<div className='flex justify-center items-center'>
			<div className='relative inline-block  items-center'>
				{/* グラデーションオーバーレイ */}
				<div className='absolute inset-2 rounded-full opacity-80 blur-lg group-hover:opacity-100 transition-opacity duration-500 ease-in-out bg-custom-gradient-exbutton bg-custom-gradient-exbutton--doujin z-0' />
				{/* ボタン */}
				<UmamiTracking
					trackingData={{
						dataType: 'doujin-item',
						from: 'kobetu-exlink-top',
						item: { title: item.title, content_id: item.content_id },
					}}>
					<Link
						href={item.affiliate_url}
						target='_blank'
						rel='noopener noreferrer'
						className='relative inline-flex items-center justify-center text-xl font-semibold text-white rounded-full shadow-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 px-6 sm:px-8 py-3 sm:py-4 hover:bg-gray-700 transform hover:-translate-y-0.5 bg-custom-gradient-exbutton bg-custom-gradient-exbutton--doujin'
						onClick={handleButtonClick}>
						<span className='mr-2'>作品をフルで見る</span>
						<ExternalLink className='w-5 h-5 sm:w-6 sm:h-6 animate-pulse' />
					</Link>
				</UmamiTracking>
			</div>
		</div>
	)
}
