// /Volumes/SSD_1TB/erice2/erice/src/app/(pages)/item/[contentId]/page.tsx

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

async function fetchData(itemType: ItemType): Promise<DMMItemProps[]> {
	// fetchData 関数をコンポーネント内に移動
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

	const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`)
	const data: DMMItemProps[] = await response.json()
	return data
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

	const saleItems = await fetchData(itemType)
	console.log('saleItems', saleItems)

	const Item = saleItems.find((itemmap) => {
		return itemmap.content_id === params.contentId
	})

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

					{/* <div className="flex items-center space-x-4">
						<img src={Item.imageURL || '/default-avatar.jpg'} alt={Item.title} className="w-12 h-12 rounded-full" />
						<div>
							<p className="text-gray-600 text-sm">
								{(() => {
									if (!Item.date) return 'Date not available'
									try {
										const date = new Date(Item.date)
										return date.toISOString().split('T')[0]
									} catch (error) {
										console.error('Invalid date:', Item.date)
										return 'Invalid date'
									}
								})()}
							</p>
							<p className="text-gray-600 text-sm">{Item.actress || 'Unknown'}</p>
						</div>
					</div> */}

					<h1 className="text-gray-600 font-semibold text-2xl sm:text-4xl">{Item.title}</h1>

					{/* ArticleKeywords コンポーネントは DMMSaleItem の構造に合わせて修正が必要かもしれません */}
					{/* <ArticleKeywords keywords={Item.genre} /> */}

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
