'use client'

import { useEffect } from 'react'
import { scroller } from 'react-scroll'

/**
 * ハッシュリンクの変更を監視し、対応する要素にスクロールします。
 *
 * @returns null
 */
const HashScrollHandler: React.FC = () => {
	useEffect(() => {
		const scrollToHash = () => {
			const hash = window.location.hash.substring(1)
			if (hash) {
				scroller.scrollTo(hash, {
					duration: 500,
					delay: 0,
					smooth: 'easeInOutQuart',
					offset: -70, // ナビゲーションバーの高さを考慮
				})
			}
		}

		scrollToHash()
		window.addEventListener('hashchange', scrollToHash)
		window.addEventListener('popstate', scrollToHash)

		return () => {
			window.removeEventListener('hashchange', scrollToHash)
			window.removeEventListener('popstate', scrollToHash)
		}
	}, [])

	return null
}

export default HashScrollHandler
