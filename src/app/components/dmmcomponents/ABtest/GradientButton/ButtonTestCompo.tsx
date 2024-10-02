// src/app/components/dmmcomponents/ABtest/GradientButton/ButtonTestComponent.tsx
'use client'

import { trackClick, trackImpression } from '@/lib/abTestTracking'
import { DMMActressInfo } from '@/types/APItypes'
import { DMMItemMainResponse } from '@/types/dmmitemzodschema'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface ButtonTestComponentProps {
	ItemMain: DMMItemMainResponse
	actressInfo: DMMActressInfo | null
}

export default function ButtonTestComponent({ ItemMain, actressInfo }: ButtonTestComponentProps) {
	const [variant, setVariant] = useState<'with-gradient-button' | 'no-gradient-button' | null>(null)

	useEffect(() => {
		// 既にバリアントがローカルストレージに保存されているか確認
		const storedVariant = localStorage.getItem('buttonVariant') as
			| 'with-gradient-button'
			| 'no-gradient-button'
			| null
		if (storedVariant) {
			setVariant(storedVariant)
		} else {
			// ランダム化
			const random = Math.random()
			const selectedVariant = random > 0.5 ? 'with-gradient-button' : 'no-gradient-button'
			localStorage.setItem('buttonVariant', selectedVariant)
			setVariant(selectedVariant)
		}
	}, [])

	if (variant === null) {
		return null // またはローディングスピナー
	}

	// ボタンコンポーネントを切り替え
	return variant === 'no-gradient-button' ? (
		<ButtonNoGradient ItemMain={ItemMain} actressInfo={actressInfo} />
	) : (
		<ButtonWithGradient ItemMain={ItemMain} actressInfo={actressInfo} />
	)
}

interface ButtonProps {
	ItemMain: DMMItemMainResponse
	actressInfo: DMMActressInfo | null
}

const ButtonWithGradient = ({ ItemMain, actressInfo }: ButtonProps) => {
	useEffect(() => {
		// インプレッションをトラッキング
		trackImpression('ButtonGradientTest', 'with-gradient-button')
	}, [])

	const handleButtonClick = () => {
		// クリックをトラッキング
		trackClick('ButtonGradientTest', 'with-gradient-button')
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
}

const ButtonNoGradient = ({ ItemMain, actressInfo }: ButtonProps) => {
	useEffect(() => {
		// インプレッションをトラッキング
		trackImpression('ButtonGradientTest', 'no-gradient-button')
	}, [])

	const handleButtonClick = () => {
		// クリックをトラッキング
		trackClick('ButtonGradientTest', 'no-gradient-button')
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
}
