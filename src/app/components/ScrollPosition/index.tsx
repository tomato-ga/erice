'use client'

import { useEffect } from 'react'

export default function ScrollPosition() {
	useEffect(() => {
		// ページが初めて読み込まれるときにスクロール位置を復元
		const savedScrollPosition = sessionStorage.getItem('scrollPosition')
		if (savedScrollPosition) {
			// string を number に変換
			const scrollPosition = parseInt(savedScrollPosition, 10)
			if (!isNaN(scrollPosition)) {
				window.scrollTo(0, scrollPosition)
			}
			sessionStorage.removeItem('scrollPosition') // スクロール位置を使った後は削除
		}

		// ページを離れるときにスクロール位置を保存
		const handleBeforeUnload = () => {
			sessionStorage.setItem('scrollPosition', window.scrollY.toString())
		}

		window.addEventListener('beforeunload', handleBeforeUnload)

		// クリーンアップ
		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload)
		}
	}, [])

	return null
}
