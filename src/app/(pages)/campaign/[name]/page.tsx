// src/app/campaign/[name]/page.tsx

import { fetchCampaignData } from '@/app/components/dmmcomponents/fetch/itemFetchers'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table' // shadcnのテーブルコンポーネントをインポート
import {
	DMMCampaignItem,
	DMMItemSchema,
	GetKVCampaignItemsResponseSchema,
} from '@/types/dmm-campaignpage-types'
import { formatDate, formatDateCampaign } from '@/utils/dmmUtils'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

/**
 * ItemDetailsTableコンポーネント
 * アイテムの詳細情報をテーブル形式で表示します。
 *
 * @param {Object} props - コンポーネントのプロパティ
 * @param {DMMCampaignItem} props.item - 詳細を表示するアイテム
 * @param {string} props.campaignName - キャンペーン名
 * @returns {JSX.Element} JSX要素
 */
const ItemDetailsTable: React.FC<{ item: DMMCampaignItem; campaignName: string }> = ({
	item,
	campaignName,
}) => {
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
							{item.iteminfo.actress.map(actress => (
								<Link
									key={actress.id}
									href={`/actressprofile/${encodeURIComponent(actress.name)}`}
									className='text-blue-500 font-semibold hover:underline'>
									{actress.name}
								</Link>
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

/**
 * CampaignFeaturedItemGridコンポーネント
 * 各アイテムをカード形式でグリッドに表示します。
 *
 * @param {Object} props - コンポーネントのプロパティ
 * @param {DMMCampaignItem[]} props.items - 表示するアイテムの配列
 * @param {string} props.campaignName - キャンペーン名
 * @returns {JSX.Element} JSX要素
 */
const CampaignFeaturedItemGrid: React.FC<{ items: DMMCampaignItem[]; campaignName: string }> = ({
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
								<Image
									src={validItem.imageURL.large}
									alt={validItem.title}
									width={400}
									height={600}
									className='w-full h-auto object-cover'
									loading='lazy'
								/>
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

/**
 * generateMetadata関数
 * ページのメタデータを動的に生成します。
 *
 * @param {Object} params - URLパラメータ
 * @param {string} params.name - キャンペーン名
 * @returns {Promise<Metadata>} メタデータオブジェクト
 */
export const generateMetadata = async ({
	params,
}: {
	params: { name: string }
}): Promise<Metadata> => {
	const { name } = params
	const decodedName = decodeURIComponent(name)

	// データの取得
	const campaignDataResponse = await fetchCampaignData(name)
	if (!campaignDataResponse) {
		console.error('Campaign data not found for:', decodedName) // エラーメッセージを表示
		notFound()
	}
	const { campaignData } = campaignDataResponse
	const title = `【${formatDateCampaign(campaignData.createdAt)}最新】 FANZAキャンペーン:${decodedName}`

	if (!campaignDataResponse) {
		return {
			title: title,
			description: `${decodedName} キャンペーンに関する情報が見つかりませんでした。`,
		}
	}

	// Zodによるバリデーション
	const parsedData = GetKVCampaignItemsResponseSchema.safeParse(campaignData)
	if (!parsedData.success) {
		return {
			title: `${decodedName} キャンペーン - お得な情報満載`,
			description: `${decodedName} キャンペーンに関するデータのバリデーションに失敗しました。`,
		}
	}

	const allItemReviewCount = campaignData.items.reduce(
		(acc, cur) => acc + (cur.review?.count || 0),
		0,
	)

	const actressCountMap = campaignData.items.reduce(
		(acc, item) => {
			if (item.iteminfo?.actress) {
				for (const actress of item.iteminfo.actress) {
					acc[actress.name] = (acc[actress.name] || 0) + 1
				}
			}
			return acc
		},
		{} as Record<string, number>,
	)

	const sortedActessArray = Object.entries(actressCountMap)
		.sort(([, a], [, b]) => b - a)
		.map(([name, count]) => ({ name, count }))

	const description = `${decodedName}のおすすめアイテムを厳選してご紹介します。最新のエロ動画セール情報をチェックして、お得な商品を手に入れましょう。厳選した${campaignData.items.length}件の「${decodedName}」アイテムで、総数${allItemReviewCount}件ものレビューが証明した動画たち。${
		sortedActessArray.length > 0 && sortedActessArray[0].name
			? `人気女優${sortedActessArray[0].name}の魅力的な姿も、今なら驚きの価格で楽しめます。`
			: ''
	}`

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			type: 'website',
			url: `https://yourdomain.com/campaign/${encodeURIComponent(name)}`,
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
		},
	}
}

/**
 * CampaignDetailPageコンポーネント
 * キャンペーンの詳細ページを表示します。
 *
 * @param {Object} props - コンポーネントのプロパティ
 * @param {Object} props.params - URLパラメータ
 * @param {string} props.params.name - キャンペーン名
 * @returns {Promise<JSX.Element>} JSX要素
 */
const CampaignDetailPage = async ({ params }: { params: { name: string } }) => {
	const { name } = params
	const decodedName = decodeURIComponent(name)
	const campaignDataResponse = await fetchCampaignData(name)

	if (!campaignDataResponse) {
		console.error('Campaign data not found for:', decodedName) // エラーメッセージを表示
		notFound()
	}

	const { campaignData } = campaignDataResponse

	const actressCountMap = campaignData.items.reduce(
		(acc, item) => {
			if (item.iteminfo?.actress) {
				for (const actress of item.iteminfo.actress) {
					acc[actress.name] = (acc[actress.name] || 0) + 1
				}
			}
			return acc
		},
		{} as Record<string, number>,
	)

	const sortedActessArray = Object.entries(actressCountMap)
		.sort(([, a], [, b]) => b - a)
		.map(([name, count]) => ({ name, count }))

	const allItemReviewCount = campaignData.items.reduce(
		(acc, cur) => acc + (cur.review?.count || 0),
		0,
	)

	return (
		<div className='container mx-auto px-1 py-4'>
			<div className='px-3'>
				<h1 className='text-4xl font-extrabold mb-4 text-slate-800'>
					【{formatDateCampaign(campaignData.createdAt)}最新】 FANZAキャンペーン:{decodedName}
				</h1>
				<p className='pb-2 font-semibold'>
					{decodedName}
					のおすすめアイテムを厳選してご紹介します。最新のエロ動画セール情報をチェックして、お得な商品を手に入れましょう。
				</p>
				{/* <p className='pb-2 font-semibold'>
					今すぐサンプル視聴可能！ダウンロードやストリーミングで、いつでもどこでも快感をお届けします。
					<br />
					お得な価格で手に入れた{decodedName}作品で、
					想像以上の興奮と刺激的な体験があなたを待っています。
				</p> */}
				<p className='pb-2 font-semibold'>
					厳選した{campaignData.items.length}件の「{decodedName}」アイテムで、 総数
					{allItemReviewCount}件ものレビューが証明した動画たち。
					{sortedActessArray.length > 0 && sortedActessArray[0].name && (
						<>人気女優{sortedActessArray[0].name}の魅力的な姿も、今なら驚きの価格で楽しめます。</>
					)}
				</p>
				<p className='text-sm text-gray-600 mb-8'>
					最終更新日時: {campaignData.createdAt ? formatDateCampaign(campaignData.createdAt) : ''}
					{/* Use formatDate utility to format the createdAt string */}
				</p>
			</div>
			{campaignData.items.length > 0 ? (
				<CampaignFeaturedItemGrid items={campaignData.items} campaignName={decodedName} />
			) : (
				<p className='text-center'>このキャンペーンに該当するアイテムはありません。</p>
			)}
			<Link href='/' className='mt-8 inline-block text-blue-500 underline'>
				ホームに戻る
			</Link>
		</div>
	)
}

export const revalidate = 0

export default CampaignDetailPage
