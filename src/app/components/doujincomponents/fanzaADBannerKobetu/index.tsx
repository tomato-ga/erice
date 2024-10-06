'use client'

import React, { useEffect, useRef, useState } from 'react'

interface Banner {
	bannerId: string
	affiliateId: string
	width: string
	height: string
}

// TODO 同じバナーが二つ表示される
const FanzaADBannerKobetu: React.FC = () => {
	const containerRef = useRef<HTMLDivElement>(null)
	const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null)

	// ハードコードされたバナー情報
	const banners: Banner[] = [
		{
			bannerId: '1332_640_200',
			affiliateId: 'kamipanmen-001',
			width: '640px',
			height: '200px',
		},
		{
			bannerId: '1331_640_200',
			affiliateId: 'kamipanmen-001',
			width: '640px',
			height: '200px',
		},
		{
			bannerId: '1082_640_200',
			affiliateId: 'kamipanmen-001',
			width: '640px',
			height: '200px',
		},
		{
			bannerId: '1277_300_250',
			affiliateId: 'kamipanmen-001',
			width: '300px',
			height: '250px',
		},
		{
			bannerId: '1328_640_200',
			affiliateId: 'kamipanmen-001',
			width: '640px',
			height: '200px',
		},
	]

	// バナーをランダムに選択して、状態にセット
	useEffect(() => {
		const getRandomBanner = (): Banner => {
			const randomIndex = Math.floor(Math.random() * banners.length)
			return banners[randomIndex]
		}

		// 初回マウント時にランダムバナーをセット
		if (!selectedBanner) {
			setSelectedBanner(getRandomBanner())
		}

		if (containerRef.current && selectedBanner) {
			// 既存のスクリプトタグを削除
			const existingScript = containerRef.current.querySelector('script.widget-banner-script')
			if (existingScript) {
				existingScript.remove()
			}

			// 新しいスクリプトタグを挿入
			const newScript = document.createElement('script')
			newScript.className = 'widget-banner-script'
			newScript.src = `https://widget-view.dmm.co.jp/js/banner_placement.js?affiliate_id=${selectedBanner.affiliateId}&banner_id=${selectedBanner.bannerId}`
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

			containerRef.current.appendChild(newScript)
		}
	}, [selectedBanner]) // selectedBanner が変わったときだけ再実行

	if (!selectedBanner) return null // selectedBannerがセットされるまでレンダリングしない

	const htmlContent = `
    <ins class="widget-banner" style="display:block;width:${selectedBanner.width};height:${selectedBanner.height}" 
         data-affiliate-id="${selectedBanner.affiliateId}" 
         data-banner-id="${selectedBanner.bannerId}" 
         data-full-width-responsive="false">
    </ins>`

	return (
		<div className='flex justify-center items-center'>
			<div ref={containerRef} dangerouslySetInnerHTML={{ __html: htmlContent }} />
		</div>
	)
}

export default React.memo(FanzaADBannerKobetu)
