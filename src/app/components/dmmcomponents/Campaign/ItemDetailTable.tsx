// src/app/components/dmmcomponents/Campaign/ItemDetailsTable.tsx

import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table' // shadcnのテーブルコンポーネントをインポート
import { DMMCampaignItem } from '@/types/dmm-campaignpage-types'
import { formatDate } from '@/utils/dmmUtils'
import Link from 'next/link'
import React from 'react'

interface ItemDetailsTableProps {
	item: DMMCampaignItem
	campaignName: string
}

const ItemDetailsTable: React.FC<ItemDetailsTableProps> = ({ item, campaignName }) => {
	return (
		<Table className='w-full mt-3'>
			<TableBody>
				<TableRow>
					<TableCell className='whitespace-nowrap'>タイトル</TableCell>
					<TableCell>
						<Link
							href={`/item/${item.db_id}`}
							className='text-blue-500 font-semibold hover:underline'>
							<h2>{item.title}</h2>
						</Link>
					</TableCell>
				</TableRow>
				{item.iteminfo?.actress && item.iteminfo.actress.length > 0 && (
					<TableRow>
						<TableCell className='whitespace-nowrap'>女優名</TableCell>
						<TableCell>
							{item.iteminfo.actress.map((actress, index) => (
								<React.Fragment key={actress.id}>
									<Link
										href={`/actressprofile/${encodeURIComponent(actress.name)}`}
										className='text-blue-500 font-semibold hover:underline'>
										{actress.name}
									</Link>
									{index < (item.iteminfo?.actress?.length || 0) - 1 && (
										<span className='px-2'>/</span>
									)}
								</React.Fragment>
							))}
						</TableCell>
					</TableRow>
				)}
				<TableRow>
					<TableCell className='whitespace-nowrap'>発売日</TableCell>
					<TableCell>
						<div>{item.date ? formatDate(item.date) : 'N/A'}</div>
					</TableCell>
				</TableRow>
				<TableRow>
					<TableCell className='whitespace-nowrap'>ジャンル</TableCell>
					<TableCell>
						<div className='flex flex-wrap gap-2'>
							{item.iteminfo?.genre?.map(genre => (
								<Link
									key={genre.id}
									href={`/genre/${encodeURIComponent(genre.name)}`}
									className='bg-pink-100 hover:bg-pink-600 text-pink-500 border-pink-500 mr-2 px-2.5 py-0.5 rounded dark:text-pink-200 dark:border-pink-400 dark:hover:bg-pink-600 dark:hover:text-white'>
									{genre.name}
								</Link>
							)) || 'N/A'}
						</div>
					</TableCell>
				</TableRow>
				{/* 必要に応じて他の詳細情報を追加 */}
			</TableBody>
		</Table>
	)
}

export default ItemDetailsTable
