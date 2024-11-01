// src/app/components/dmmcomponents/Campaign/CampaignFeaturedItemGrid.tsx

import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table' // shadcnのテーブルコンポーネントをインポート
import { DMMCampaignItem, DMMItemSchema } from '@/types/dmm-campaignpage-types'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import ItemDetailsTable from './ItemDetailTable'

interface CampaignFeaturedItemGridProps {
	items: DMMCampaignItem[]
	campaignName: string
}

const CampaignFeaturedItemGrid: React.FC<CampaignFeaturedItemGridProps> = ({
	items,
	campaignName,
}) => {
	// バリデーションに失敗したアイテム数をカウント
	let failedValidationCount = 0

	return (
		<div className='container mx-auto px-4 py-6'>
			<div className='grid grid-cols-1 gap-6'>
				{items.map(item => {
					const parsedItem = DMMItemSchema.safeParse(item)
					if (!parsedItem.success) {
						failedValidationCount += 1
						console.error(
							`アイテムID: ${item.content_id} のバリデーションに失敗しました:`,
							parsedItem.error.errors,
						)
						return null // バリデーションに失敗したアイテムは表示しない
					}
					const validItem = parsedItem.data

					return (
						<div
							key={validItem.content_id}
							className='bg-white shadow-md overflow-hidden flex flex-col'>
							{validItem.imageURL?.large && (
								<Link href={`/item/${validItem.db_id}`}>
									<img
										src={validItem.imageURL.large}
										alt={validItem.title}
										width={400}
										height={600}
										className='w-full h-auto object-cover'
										loading='lazy'
									/>
								</Link>
							)}
							<div className='p-4 flex-1 flex flex-col'>
								<ItemDetailsTable item={validItem} campaignName={campaignName} />
							</div>
						</div>
					)
				})}
			</div>
			{failedValidationCount > 0 && (
				<p className='text-center text-sm text-gray-500 mt-4'>
					バリデーションに失敗したアイテム数: {failedValidationCount} 件
				</p>
			)}
		</div>
	)
}

export default CampaignFeaturedItemGrid
