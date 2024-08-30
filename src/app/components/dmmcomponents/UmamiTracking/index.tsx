'use client'

import React from 'react'
import { handleericeUmamiClick } from '../../../../lib/ericeUmamiTracking'
import { ExtendedDMMItemProps, UmamiTrackingProps, UmamiClickData } from '../../../../types/umamiTypes'

/*  TODO 個別ページからのUmamiTrackingの呼び出しの場合にどんなプロパティが必要か確認する 
/Volumes/SSD_1TB/erice2/erice/src/app/(pages)/item/[dbId]/page.tsx

- params.dbIdは渡せる
- itemMainも渡せる
個別ページからのトラッキングで必要なデータ整理
なにをトラッキングしたいのか？
- 女優名前
- 女優ID

↑このデータが個別ページにない
*/

export function UmamiTracking({
	type,
	item,
	from,
	children,
	onClick
}: UmamiTrackingProps & { onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void }) {
	const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		const clickData: UmamiClickData = { type, from, item }
		handleericeUmamiClick(clickData)
		if (onClick) {
			onClick(event)
		}
		console.log('UmamiTracking', type, from, item)
	}

	return <div onClick={handleClick}>{children}</div>
}
