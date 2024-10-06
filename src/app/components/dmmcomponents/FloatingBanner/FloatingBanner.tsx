'use client'
import { X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { fetchCampaignNames } from '../fetch/itemFetchers'

export default function SaleFloatingBanner() {
	const [isVisible, setIsVisible] = useState(true)
	const [campaignNameOne, setCampaignNameOne] = useState<string | null>(null)

	useEffect(() => {
		// 即時実行関数で非同期処理を実行
		;(async () => {
			try {
				// sessionStorage の確認
				const bannerClosed = sessionStorage.getItem('saleBannerClosed')
				if (bannerClosed === 'true') {
					setIsVisible(false)
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

	if (!isVisible) {
		return null
	}

	return (
		<div className='fixed bottom-16 md:bottom-4 right-2 bg-gradient-to-r from-red-600 to-orange-500 shadow-2xl z-50 p-3.5 rounded-lg transition-all duration-300 w-11/12 sm:w-[500px] border border-red-300'>
			<button
				onClick={closeBanner}
				className='absolute top-1 right-1.5 text-white hover:text-red-100 focus:outline-none transition duration-300'
				aria-label='Close'
				type='button'>
				<X size={16} />
			</button>
			<div className='flex items-center space-x-4'>
				<div className='flex-grow'>
					<Link href={`/campaign/${encodeURIComponent(campaignNameOne || 'default-campaign')}`}>
						<h3 className='text-xl font-bold text-white mb-1'>セール中！</h3>
						<p className='text-red-50'>{campaignNameOne || 'お得なキャンペーン実施中！'}</p>
					</Link>
				</div>
				<Link
					href={`/campaign/${encodeURIComponent(campaignNameOne || 'default-campaign')}`}
					className='flex-shrink-0 bg-yellow-400 text-red-600 font-bold py-2 px-3 rounded-md hover:bg-yellow-300 transform hover:-translate-y-1 transition duration-300'>
					チェック
				</Link>
			</div>
		</div>
	)
}
