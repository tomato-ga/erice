// /pages/item/[contentId]/page.tsx

import { Suspense } from 'react'
import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import ArticleLBasic from '@/app/components/Article/ArticleLinks'
import KeywordRelatedArticles from '@/app/components/Article/ArticleLoaded/KeywordRelated'
import Link from 'next/link'
import { ItemType } from '@/app/components/dmmcomponents/DMMItemContainer'
import { DMMItemProps } from '../../../../../types/dmmtypes'

const PopularArticle = dynamic(() => import('@/app/components/Article/PopularArticle'))

interface Props {
	params: { contentId: string }
}

async function fetchData(itemType: ItemType, contentId: string): Promise<DMMItemProps | null> {
	let endpoint = ''
	switch (itemType) {
		case 'todaynew':
			endpoint = '/api/dmm-todaynew-getkv'
			break
		case 'debut':
			endpoint = '/api/dmm-debut-getkv'
			break
		case 'feature':
			endpoint = '/api/dmm-feature-getkv'
			break
		case 'sale':
			endpoint = '/api/dmm-sale-getkv'
			break
		default:
			throw new Error(`Invalid itemType: ${itemType}`)
	}

	// Promise.anyを使ってKVとD1からのデータ取得を行い、最初に解決されたPromiseの結果を返す
	try {
		const item = await Promise.any([
			(async () => {
				const kvResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`)
				const kvData: DMMItemProps[] = await kvResponse.json()
				const itemFromKV = kvData.find((item) => item.content_id === contentId)
				if (itemFromKV) {
					return itemFromKV
				}
				throw new Error('Item not found in KV') // KVにデータがない場合、エラーをthrowする
			})(),
			(async () => {
				const d1Response = await fetch(
					`${process.env.NEXT_PUBLIC_API_URL}/api/dmm-get-one-item?content_id=${contentId}`
				)
				const d1Data: DMMItemProps = await d1Response.json()
				return d1Data
			})()
		])
		return item
	} catch (error) {
		// エラーハンドリング：全てのPromiseがrejectされた場合
		console.error('Error fetching data:', error)
		return null
	}
}

export default async function DMMKobetuItemPage({
	params,
	searchParams
}: Props & { searchParams: { itemType?: ItemType } }) {
	console.log('Received params:', params)
	const itemType = searchParams.itemType || 'todaynew' // デフォルト値を設定

	if (!itemType) {
		throw new Error('itemType is required')
	}

	// fetchData関数でKVとD1のデータを取得し、適切な方を返す
	const Item = await fetchData(itemType, params.contentId)

	console.log('Found Item:', Item)

	if (!params.contentId || !Item) {
		return (
			<div className="container mx-auto px-2 py-6">
				<h1 className="text-2xl font-bold text-red-600">{itemType}のアイテムが見つかりませんでした</h1>{' '}
				{/* itemType に応じたエラーメッセージ */}
				<p>アイテムが存在しないか、取得中にエラーが発生しました。</p>
			</div>
		)
	}

	// Item が undefined でないことが確認できたので、安全に JSX を記述できます
	return (
		<div className="bg-white min-h-screen">
			<div className="container mx-auto px-2 py-6">
				<article className="flex flex-col space-y-4">
					<div className="relative">
						<Link href={Item.affiliateURL || '#'} target="_blank" rel="noopener">
							<img
								src={Item.imageURL?.toString() || '/default.jpg'}
								alt={Item.title}
								className="w-full h-auto rounded-lg"
							/>
						</Link>
					</div>

					{/* ... (省略) ... */}

					<h1 className="text-gray-600 font-semibold text-2xl sm:text-4xl">{Item.title}</h1>

					{/* ... (省略) ... */}

					<Link href={Item.affiliateURL || '#'} target="_blank" rel="noopener">
						<div className="text-lg p-5 text-slate-700 text-center font-semibold rounded-md bg-red-50">
							{Item.title}のページを見る
						</div>
					</Link>

					{/* sampleImageURL の表示 */}
					{Item.sampleImageURL && (
						<div className="grid grid-cols-2 gap-4">
							{Item.sampleImageURL.map((imageUrl, index) => (
								<img
									key={index}
									src={imageUrl}
									alt={`Sample Image ${index + 1}`}
									className="w-full h-auto rounded-lg"
								/>
							))}
						</div>
					)}
				</article>
			</div>
		</div>
	)
}
