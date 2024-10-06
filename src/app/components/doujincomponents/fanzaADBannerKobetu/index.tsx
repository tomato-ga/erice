'use client'

import React, { useEffect, useRef } from 'react'

const FanzaADBannerDoujinKobetu: React.FC = () => {
	const containerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		// 既にスクリプトが存在するか確認
		const existingScript = document.querySelector('script.widget-banner-script')
		if (!existingScript && containerRef.current) {
			// <ins>タグを手動で追加
			const insElement = document.createElement('ins')
			insElement.className = 'widget-banner'
			insElement.style.display = 'block'
			insElement.style.width = '100%' // 幅をレスポンシブ対応に
			insElement.style.height = 'auto' // 高さもコンテンツに応じて自動調整
			insElement.setAttribute('data-affiliate-id', 'kamipanmen-001')
			insElement.setAttribute('data-banner-id', '1331_640_200')
			insElement.setAttribute('data-full-width-responsive', 'true') // レスポンシブ対応

			// スクリプトを挿入
			const newScript = document.createElement('script')
			newScript.className = 'widget-banner-script'
			newScript.src =
				'https://widget-view.dmm.co.jp/js/banner_placement.js?affiliate_id=kamipanmen-001&banner_id=1331_640_200'
			newScript.async = true

			newScript.onload = () => {
				if (window.finzaRenderBanners) {
					window.finzaRenderBanners()
				} else if (window.finza?.renderBanners) {
					window.finza.renderBanners()
				}
			}

			newScript.onerror = () => {
				console.error('Fanzaのバナー用スクリプトの読み込みに失敗しました。')
			}

			// containerにinsタグとスクリプトを追加
			containerRef.current.appendChild(insElement)
			containerRef.current.appendChild(newScript)
		}
	}, []) // 初回マウント時のみ実行

	return (
		<div className='flex justify-center items-center w-full'>
			<div ref={containerRef} className='w-full' />
		</div>
	)
}

export default React.memo(FanzaADBannerDoujinKobetu)
