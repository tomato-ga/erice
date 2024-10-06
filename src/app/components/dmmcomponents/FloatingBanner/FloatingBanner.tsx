'use client'
import { trackClick, trackImpression, waitForUmami } from '@/lib/abTestTracking'
import { X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { fetchCampaignNames } from '../fetch/itemFetchers'

export default function SaleFloatingBanner() {
	const [isVisible, setIsVisible] = useState(true)
	const [campaignNameOne, setCampaignNameOne] = useState<string | null>(null)
	const [isVariantA, setIsVariantA] = useState(true) // true for red variant, false for gold variant
	const hasTrackedImpression = useRef(false)

	useEffect(() => {
		// 即時実行関数で非同期処理を実行
		;(async () => {
			try {
				// sessionStorage の確認
				const bannerClosed = sessionStorage.getItem('saleBannerClosed')
				if (bannerClosed === 'true') {
					setIsVisible(false)
					return
				}

				// キャンペーン名の取得
				const names = await fetchCampaignNames()
				console.log('取得したキャンペーン名:', names)

				if (names && names.length > 0) {
					const randomName = names[Math.floor(Math.random() * names.length)]
					setCampaignNameOne(randomName)
					console.log('選択されたキャンペーン名:', randomName)
				} else {
					console.error('キャンペーン名が取得できませんでした。')
				}

				// ABテストのバリアント選択
				const variant = Math.random() > 0.5
				setIsVariantA(variant)

				// Impression tracking
				if (!hasTrackedImpression.current && typeof window !== 'undefined') {
					await waitForUmami()
					try {
						await trackImpression('floating-1006-v1', variant ? 'red' : 'gold')
						hasTrackedImpression.current = true
					} catch (error) {
						console.error('Error tracking impression:', error)
					}
				}
			} catch (error) {
				console.error('エラーが発生しました:', error)
			}
		})()
	}, [])

	const closeBanner = () => {
		setIsVisible(false)
		try {
			sessionStorage.setItem('saleBannerClosed', 'true')
		} catch (error) {
			console.warn('sessionStorage の操作に失敗しました:', error)
		}
	}

	const handleButtonClick = () => {
		trackClick('floating-1006-v1', isVariantA ? 'red' : 'gold')
	}

	if (!isVisible) {
		return null
	}

	return (
		<div
			className={`fixed bottom-16 md:bottom-4 right-2 shadow-2xl z-50 p-3.5 rounded-lg transition-all duration-300 w-11/12 sm:w-[500px] border ${
				isVariantA
					? 'bg-gradient-to-r from-red-600 to-orange-500 border-red-300'
					: 'bg-gradient-to-r from-gray-900 to-yellow-600 border-yellow-300'
			}`}>
			<button
				onClick={closeBanner}
				className={`absolute top-1 right-1.5 focus:outline-none transition duration-300 ${
					isVariantA ? 'text-white hover:text-red-100' : 'text-yellow-300 hover:text-yellow-100'
				}`}
				aria-label='Close'
				type='button'>
				<X size={16} />
			</button>
			<div className='flex items-center space-x-4'>
				<div className='flex-grow'>
					<Link
						href={`/campaign/${encodeURIComponent(campaignNameOne || 'default-campaign')}`}
						onClick={handleButtonClick}>
						<h3
							className={`text-xl font-bold mb-1 ${isVariantA ? 'text-white' : 'text-yellow-300'}`}>
							セール中！
						</h3>
						<p className={isVariantA ? 'text-red-50' : 'text-yellow-100'}>
							{campaignNameOne || 'お得なキャンペーン実施中！'}
						</p>
					</Link>
				</div>
				<Link
					href={`/campaign/${encodeURIComponent(campaignNameOne || 'default-campaign')}`}
					className={`flex-shrink-0 font-bold py-2 px-3 rounded-md transform hover:-translate-y-1 transition duration-300 ${
						isVariantA
							? 'bg-yellow-400 text-red-600 hover:bg-yellow-300'
							: 'bg-yellow-400 text-red-600 hover:bg-yellow-300'
					}`}
					onClick={handleButtonClick}>
					チェック
				</Link>
			</div>
		</div>
	)
}
