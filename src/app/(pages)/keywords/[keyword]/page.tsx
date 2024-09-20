import { fetchTOP100KeywordData } from '@/app/components/dmmcomponents/fetch/itemFetchers'
import Link from 'next/link'
// src/app/keywords/[keyword]/page.tsx
import React from 'react'
import { GetKVTop100Response } from '../../../../types/dmmtypes'

/**
 * キーワード専用ページコンポーネント
 * @param params - URLパラメータ
 * @returns JSX.Element
 */
const KeywordPage = async ({ params }: { params: { keyword: string } }): Promise<JSX.Element> => {
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

	const { items } = data
	// デバッグログ: 取得したアイテム数
	console.debug(`キーワード「${keyword}」に対して、${items.length}件のアイテムが取得されました。`)

	return (
		<div className='container mx-auto px-6 py-12'>
			<h1 className='text-4xl font-extrabold mb-8 text-slate-800'>
				キーワード: {decodeURIComponent(keyword)}
			</h1>
			<p>作成日時: {new Date(data.createdAt).toLocaleString()}</p>
			{items.length > 0 ? (
				<ul className='mt-6'>
					{items.map(item => (
						<li key={item.content_id} className='mb-6'>
							<h2 className='text-2xl font-semibold'>{item.title}</h2>

							<Link href={`/item/${item.db_id}`} className='text-blue-500 underline'>
								アイテムを見る
							</Link>
						</li>
					))}
				</ul>
			) : (
				<p>このキーワードに該当するアイテムはありません。</p>
			)}
		</div>
	)
}

export default KeywordPage
