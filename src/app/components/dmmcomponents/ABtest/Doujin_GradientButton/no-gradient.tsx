// src/app/components/dmmcomponents/ABtest/GradientButton/ButtonNoGradient.tsx
'use client'

import { trackClick, trackImpression } from '@/lib/abTestTracking'

import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'
import { UmamiTracking } from '../../UmamiTracking'
import { DoujinKobetuItem } from '@/_types_doujin/doujintypes'

interface ButtonNoGradientProps {
	item: DoujinKobetuItem
}

export const DoujinButtonNoGradient = ({ item }: ButtonNoGradientProps) => {
	useEffect(() => {
		// インプレッションをトラッキング
		trackImpression('ButtonGradientTest-Doujin', 'no-gradient-button')
	}, [])

	const handleButtonClick = () => {
		// クリックをトラッキング
		trackClick('ButtonGradientTest-Doujin', 'no-gradient-button')
	}

	return (
		<div className="flex justify-center items-center">
			<div className="relative inline-block  items-center">
				{/* グラデーションオーバーレイ */}
				{/* <div className="absolute inset-2 rounded-full opacity-80 blur-lg group-hover:opacity-100 transition-opacity duration-500 ease-in-out bg-custom-gradient-exbutton bg-custom-gradient-exbutton--doujin z-0" /> */}
				{/* ボタン */}
				<UmamiTracking
					trackingData={{
						dataType: 'doujin-item',
						from: 'kobetu-exlink-top',
						item: { title: item.title, content_id: item.content_id }
					}}
				>
					<Link
						href={item.affiliate_url}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center justify-center text-xl font-semibold text-white bg-gradient-to-r from-pink-500 to-rose-600 dark:from-pink-600 dark:to-rose-700 rounded-full shadow-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 dark:focus:ring-pink-400 px-8 py-4"
						onClick={handleButtonClick}
					>
						<span className="mr-2">作品をフルで見る</span>
						<ExternalLink className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
					</Link>
				</UmamiTracking>
			</div>
		</div>
	)
}
