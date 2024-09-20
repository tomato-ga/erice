// src/app/(pages)/keywords/[keyword]/page.tsx

import { fetchTOP100KeywordData } from '@/app/components/dmmcomponents/fetch/itemFetchers'
import {
	DMMItem,
	DMMKeywordItemProps,
	DMMKeywordItemSchema,
	GetKVTop100Response,
	GetKVTop100ResponseSchema,
} from '@/types/dmm-keywordpage'
import Link from 'next/link'
import React from 'react'
import { z } from 'zod'

/**
 * KeywordFeaturedItemCardコンポーネント
 * 各アイテムをカード形式で表示します。
 * @param item - アイテムのデータ
 * @returns JSX.Element
 */
const KeywordFeaturedItemCard: React.FC<{ item: DMMKeywordItemProps }> = ({ item }) => (
	<div className='bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out flex flex-col h-full'>
		<Link href={`/item/${item.db_id}`} className='flex flex-col flex-grow'>
			<div className='relative overflow-hidden bg-gray-100 p-4'>
				<img
					src={item.imageURL || ''}
					alt={item.title}
					loading='lazy' // 画像の遅延読み込みを追加
					className='w-full h-auto min-h-[200px] object-contain'
				/>
			</div>
			<div className='p-4 flex flex-col flex-grow'>
				<h2 className='text-lg font-semibold mb-2 line-clamp-2 h-14' title={item.title}>
					{item.title}
				</h2>
				{/* 価格情報を表示しないため、この部分を削除 */}
				{/* {item.price && (
          <div className='mb-2'>
            <span className='text-red-600 font-bold'>{item.price.replace(/~/, '円〜')}</span>
          </div>
        )} */}
				{item.iteminfo?.genre && (
					<div className='mb-2'>
						<span className='text-sm font-medium text-gray-700'>ジャンル:</span>
						<ul className='flex flex-wrap mt-1'>
							{item.iteminfo.genre.map(genre => (
								<li key={genre.id} className='mr-2 mb-2'>
									<span className='inline-block bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded'>
										{genre.name}
									</span>
								</li>
							))}
						</ul>
					</div>
				)}
				{item.actress && (
					<p className='text-sm text-gray-600 mb-2 line-clamp-1' title={item.actress}>
						出演: {item.actress}
					</p>
				)}
				{item.date && (
					<p className='text-sm text-gray-600'>
						発売日: {new Date(item.date).toLocaleDateString()}
					</p>
				)}
			</div>
		</Link>
	</div>
)

/**
 * キーワード専用ページコンポーネント
 * オリジナルのTailwindデザインを使用したカードコンポーネントを使用
 * @param params - URLパラメータ
 * @returns JSX.Element
 */
const KeywordPage = async ({
	params,
}: {
	params: { keyword: string }
}): Promise<JSX.Element> => {
	const { keyword } = params

	// デバッグログ: ページレンダリング開始
	console.debug(`キーワードページをレンダリングしています: ${keyword}`)

	const data = await fetchTOP100KeywordData(keyword)

	if (!data) {
		// デバッグログ: データ取得失敗
		console.warn(`キーワード「${keyword}」のデータが見つかりませんでした。`)
		return (
			<div className='container mx-auto px-6 py-12'>
				<h1 className='text-4xl font-extrabold mb-8 text-slate-800'>キーワード: {keyword}</h1>
				<p>データの取得に失敗しました。</p>
			</div>
		)
	}

	const { items, createdAt } = data
	// デバッグログ: 取得したアイテム数
	console.debug(`キーワード「${keyword}」に対して、${items.length}件のアイテムが取得されました。`)

	// Zodによるバリデーション
	const parsedData = GetKVTop100ResponseSchema.safeParse(data)
	if (!parsedData.success) {
		console.error('データのバリデーションに失敗しました:', parsedData.error)
		return (
			<div className='container mx-auto px-6 py-12'>
				<h1 className='text-4xl font-extrabold mb-8 text-slate-800'>キーワード: {keyword}</h1>
				<p>データの取得に失敗しました。</p>
			</div>
		)
	}

	const validData = parsedData.data

	// アイテムをDMMKeywordItemProps型に変換
	const featuredItems: DMMKeywordItemProps[] = validData.items
		.map((item: DMMItem) => ({
			...item,
			imageURL: item.imageURL?.large ?? '', // 画像URLを文字列として取得
			actress: item.iteminfo?.actress?.[0]?.name ?? null, // actress をnullとして取得
		}))
		.filter((item): item is DMMKeywordItemProps => DMMKeywordItemSchema.safeParse(item).success)
        
	return (
		<div className='container mx-auto px-6 py-12'>
			<h1 className='text-4xl font-extrabold mb-4 text-slate-800'>
				キーワード: {decodeURIComponent(keyword)}
			</h1>
			{validData.createdAt && (
				<p className='text-sm text-gray-600 mb-8'>
					作成日時: {new Date(validData.createdAt).toLocaleString()}
				</p>
			)}
			{featuredItems.length > 0 ? (
				<div className='grid grid-cols-1 gap-6'>
					{featuredItems.map((item: DMMKeywordItemProps) => (
						<KeywordFeaturedItemCard key={item.content_id} item={item} />
					))}
				</div>
			) : (
				<p>このキーワードに該当するアイテムはありません。</p>
			)}
			<Link href='/' className='mt-8 inline-block text-blue-500 underline'>
				ホームに戻る
			</Link>
		</div>
	)
}

export default KeywordPage
