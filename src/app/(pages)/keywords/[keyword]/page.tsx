// src/app/(pages)/keywords/[keyword]/page.tsx

import { fetchTOP100KeywordData } from '@/app/components/dmmcomponents/fetch/itemFetchers'
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table' // shadcnのテーブルコンポーネントをインポート
import {
	DMMKeywordItemProps,
	DMMKeywordItemSchema,
	GetKVTop100ResponseSchema,
} from '@/types/dmm-keywordpage-types'
import { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'
import { z } from 'zod'

/**
 * ItemDetailsTableコンポーネント
 * アイテムの詳細情報をテーブル形式で表示します。
 *
 * @param {Object} props - コンポーネントのプロパティ
 * @param {DMMKeywordItemProps} props.item - 詳細を表示するアイテム
 * @param {string} props.keyword - 検索キーワード
 * @returns {JSX.Element} JSX要素
 */
const ItemDetailsTable: React.FC<{ item: DMMKeywordItemProps; keyword: string }> = ({
	item,
	keyword,
}) => {
	return (
		<Table className='w-full mt-4 text-lg'>
			{/* フォントサイズを大きく設定 */}
			<TableBody>
				<TableRow>
					<TableCell className='font-semibold whitespace-nowrap'>タイトル</TableCell>
					<TableCell>
						<Link
							href={`/item/${item.db_id}`}
							className='text-blue-500 font-bold text-xl hover:underline'>
							{item.title}
						</Link>
					</TableCell>
				</TableRow>
				{item.actress && item.actress.trim() !== '' && (
					<TableRow>
						<TableCell className='font-semibold whitespace-nowrap'>女優名</TableCell>
						<TableCell>
							<Link
								href={`/actressprofile/${item.actress}`}
								className='text-blue-500 font-bold text-xl hover:underline'>
								{item.actress}
							</Link>
						</TableCell>
					</TableRow>
				)}
				<TableRow>
					<TableCell className='font-semibold whitespace-nowrap'>発売日</TableCell>
					<TableCell>
						<div className='text-xl'>
							{item.date ? new Date(item.date).toLocaleDateString() : ''}
						</div>
					</TableCell>
				</TableRow>
				<TableRow>
					<TableCell className='font-semibold whitespace-nowrap'>ジャンル</TableCell>
					<TableCell>
						<div className='flex flex-wrap space-x-2'>
							{item.iteminfo?.genre?.map(genre => (
								<Link
									key={genre.id}
									href={`/genre/${encodeURIComponent(genre.name)}`}
									className='bg-transparent hover:bg-pink-600 text-pink-500 font-semibold hover:text-white p-3 m-1 border border-pink-500 hover:border-transparent rounded dark:text-pink-200 dark:border-pink-400 dark:hover:bg-pink-600 dark:hover:text-white'>
									{genre.name}
								</Link>
							)) || 'N/A'}
						</div>
					</TableCell>
				</TableRow>
			</TableBody>
		</Table>
	)
}

/**
 * KeywordFeaturedItemGridコンポーネント
 * 各アイテムをカード形式でグリッドに表示します。
 *
 * @param {Object} props - コンポーネントのプロパティ
 * @param {DMMKeywordItemProps[]} props.items - 表示するアイテムの配列
 * @param {string} props.keyword - 検索キーワード
 * @returns {JSX.Element} JSX要素
 */
const KeywordFeaturedItemGrid: React.FC<{ items: DMMKeywordItemProps[]; keyword: string }> = ({
	items,
	keyword,
}) => {
	// バリデーションに失敗したアイテム数をカウント
	let failedValidationCount = 0

	return (
		<div className='container mx-auto px-4 py-6'>
			<div className='grid grid-cols-1 gap-6'>
				{items.map(item => {
					const parsedItem = DMMKeywordItemSchema.safeParse(item)
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
							<img
								src={validItem.imageURL}
								alt={validItem.title}
								loading='lazy'
								className='w-full h-auto object-contain'
							/>
							<div className='p-4 flex-1 flex flex-col'>
								<ItemDetailsTable item={validItem} keyword={keyword} />
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
 * @param {string} params.keyword - 検索キーワード
 * @returns {Promise<Metadata>} メタデータオブジェクト
 */
export const generateMetadata = async ({
	params,
}: {
	params: { keyword: string }
}): Promise<Metadata> => {
	const { keyword } = params

	// データの取得
	const data = await fetchTOP100KeywordData(keyword)

	if (!data) {
		return {
			title: `${decodeURIComponent(keyword)} - 人気エロ動画`,
			description: `キーワード「${decodeURIComponent(keyword)}」に該当するエロ動画のデータが見つかりませんでした。`,
		}
	}

	const { items, createdAt } = data

	// Zodによるバリデーション
	const parsedData = GetKVTop100ResponseSchema.safeParse(data)
	if (!parsedData.success) {
		return {
			title: `${decodeURIComponent(keyword)} - 人気エロ動画`,
			description: `キーワード「${decodeURIComponent(keyword)}」に関するデータのバリデーションに失敗しました。`,
		}
	}

	const validData = parsedData.data

	const allItemReviewCount = validData.items.reduce((acc, cur) => acc + (cur.review?.count || 0), 0)

	const actressCountMap: Record<string, number> = {}

	for (const item of validData.items) {
		if (item.iteminfo?.actress) {
			for (const actress of item.iteminfo.actress) {
				if (actress.name) {
					actressCountMap[actress.name] = (actressCountMap[actress.name] || 0) + 1
				}
			}
		}
	}

	const sortedActessArray = Object.entries(actressCountMap)
		.sort((a, b) => b[1] - a[1])
		.map(([name, count]) => ({ name, count }))

	const featuredItems: DMMKeywordItemProps[] = validData.items
		.map(item => ({
			...item,
			imageURL: item.imageURL?.large || '', // imageURLをlargeフィールドの文字列に変換
			actress: item.iteminfo?.actress?.[0]?.name ?? null, // actress をnullとして取得
		}))
		.filter((item): item is DMMKeywordItemProps => {
			const parseResult = DMMKeywordItemSchema.safeParse(item)
			if (!parseResult.success) {
				console.error(
					`アイテムID: ${item.content_id} のバリデーションエラー:`,
					parseResult.error.errors,
				)
			}
			return parseResult.success
		})

	// メタデータの生成
	const title = `【${new Date(validData.createdAt).getFullYear()}年最新】 ${decodeURIComponent(
		keyword,
	)} の人気エロ動画を厳選して${items.length}件集めました`

	const description = `FANZAで人気の「${decodeURIComponent(
		keyword,
	)}」作品を${items.length}件集めました。豊富な「${decodeURIComponent(
		keyword,
	)}」の作品の中から、観たい作品を見つけるのに役立ててください。レビュー合計数は${allItemReviewCount}件です。最も多く登場する女優は${sortedActessArray[0]?.name || 'N/A'}です。`

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			type: 'website',
			url: `https://yourdomain.com/keywords/${encodeURIComponent(keyword)}`,
			// 必要に応じて他のOpen Graphプロパティを追加
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			// 必要に応じて他のTwitterプロパティを追加
		},
	}
}

/**
 * KeywordPageコンポーネント
 * shadcnのテーブルコンポーネントを使用してアイテムを表示します。
 *
 * @param {Object} props - コンポーネントのプロパティ
 * @param {Object} props.params - URLパラメータ
 * @param {string} props.params.keyword - 検索キーワード
 * @returns {Promise<JSX.Element>} JSX要素
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

	const allItemReviewCount = validData.items.reduce((acc, cur) => acc + (cur.review?.count || 0), 0)
	// const allItemReviewAverageSums = validData.items.reduce(
	// 	(acc, cur) => acc + (cur.review?.average || 0),
	// 	0,
	// )
	// const allItemReviewAverage = allItemReviewAverageSums / validData.items.length

	const actressCountMap: Record<string, number> = {}

	for (const item of validData.items) {
		if (item.iteminfo?.actress) {
			for (const actress of item.iteminfo.actress) {
				if (actress.name) {
					actressCountMap[actress.name] = (actressCountMap[actress.name] || 0) + 1
				}
			}
		}
	}

	const sortedActessArray = Object.entries(actressCountMap)
		.sort((a, b) => b[1] - a[1])
		.map(([name, count]) => ({ name, count }))

	// アイテムをDMMKeywordItemProps型に変換
	const featuredItems: DMMKeywordItemProps[] = validData.items
		.map(item => ({
			...item,
			imageURL: item.imageURL?.large || '', // imageURLをlargeフィールドの文字列に変換
			actress: item.iteminfo?.actress?.[0]?.name ?? null, // actress をnullとして取得
		}))
		.filter((item): item is DMMKeywordItemProps => {
			const parseResult = DMMKeywordItemSchema.safeParse(item)
			if (!parseResult.success) {
				console.error(
					`アイテムID: ${item.content_id} のバリデーションエラー:`,
					parseResult.error.errors,
				)
			}
			return parseResult.success
		})

	// デバッグログ: バリデーションを通過したアイテム数
	console.debug(`バリデーションを通過したアイテム数: ${featuredItems.length} 件`)

	return (
		<div className='container mx-auto px-6 py-12'>
			<h1 className='text-4xl font-extrabold mb-4 text-slate-800'>
				【{new Date(validData.createdAt).getFullYear()}年最新】 {decodeURIComponent(keyword)}{' '}
				の人気エロ動画を厳選して{items.length}件集めました
			</h1>
			<p className='pb-2 font-semibold'>
				FANZAで人気の「{decodeURIComponent(keyword)}」作品を{items.length}件集めました。
				<br />
				<br />
				今すぐサンプル視聴・ダウンロード・ストリーミングが可能で、好きなときにどこでも視聴できます。
				<br />
				豊富な{decodeURIComponent(keyword)}
				の作品の中から、観たい作品を見つけるのに役立ててください。
			</p>
			<p className='pb-2 font-semibold'>
				ここで紹介している「{decodeURIComponent(keyword)}」作品に投稿されたレビュー合計数は{' '}
				{allItemReviewCount}件です。「{decodeURIComponent(keyword)}」作品で最も多く登場する女優は{' '}
				{sortedActessArray[0].name}です。
			</p>
			{validData.createdAt && (
				<p className='text-sm text-gray-600 mb-8'>
					最終更新日時:{' '}
					{new Date(validData.createdAt).toLocaleString(undefined, {
						year: 'numeric',
						month: 'numeric',
						day: 'numeric',
						hour: '2-digit',
						minute: '2-digit',
						hour12: false,
					})}
				</p>
			)}
			{featuredItems.length > 0 ? (
				<KeywordFeaturedItemGrid items={featuredItems} keyword={keyword} />
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
