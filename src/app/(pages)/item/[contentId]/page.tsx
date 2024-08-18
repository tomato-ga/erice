// src/app/(pages)/item/[contentId]/page.tsx

import { Suspense } from 'react'
import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ItemType } from '@/types/dmmtypes'
import { DMMItem, DMMItemMainResponse } from '@/types/dmmitemzodschema'
import { ArrowRight, ExternalLink } from 'lucide-react'
import ProductDetails from '@/app/components/dmmcomponents/DMMKobetuItemTable'
import RelatedItemsScroll from '@/app/components/dmmcomponents/Related/RelatedItemsScroll'
import {
	fetchDataKV,
	fetchItemMainByContentId,
	fetchItemDetailByContentId,
	fetchRelatedItems
} from '@/app/components/dmmcomponents/fetch/itemFetchers'
import { CommentSection } from '@/app/components/dmmcomponents/Comment/CommentSection'
import ActressRelatedItems from '@/app/components/dmmcomponents/DMMActressItemRelated'
import ItemDetails from '@/app/components/dmmcomponents/ItemDetails'

interface Props {
	params: { contentId: string }
}

function LoadingSpinner() {
	return (
		<div className="flex justify-center items-center h-64" aria-label="読み込み中">
			<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
		</div>
	)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const contentId = params.contentId
	let title = 'エロコメスト'
	let description = '詳細ページ'

	try {
		const itemMain = await fetchItemMainByContentId(contentId)
		const itemDetail = await fetchItemDetailByContentId(contentId)

		if (itemMain && itemDetail) {
			title = `${itemMain.title} | エロコメスト`
			description = `${itemMain.title}のページです。${itemDetail.actress ? `出演: ${itemDetail.actress}` : ''}`
		}
	} catch (error) {
		console.error('メタデータの取得中にエラーが発生しました:', error)
	}

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			type: 'website',
			url: `https://erocomesuto.com/item/${contentId}`,
			images: [
				{
					url: 'https://erocomesuto.com/ogp.jpg',
					width: 1200,
					height: 630,
					alt: 'エロコメスト OGP画像'
				}
			]
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			images: ['https://erocomesuto.com/ogp.jpg']
		}
	}
}

export default async function DMMKobetuItemPage({
	params,
	searchParams
}: Props & { searchParams: { itemType?: ItemType } }) {
	console.log('Received params:', params)
	console.log('itemType:', searchParams.itemType)

	let ItemMain: DMMItemMainResponse | null = null
	try {
		if (searchParams.itemType) {
			ItemMain = await fetchDataKV(searchParams.itemType, params.contentId)
		} else {
			ItemMain = await fetchItemMainByContentId(params.contentId)
		}
	} catch (error) {
		console.error('Error fetching item:', error)
	}

	console.log('Found ItemMain:', ItemMain)

	if (!ItemMain) {
		return (
			<div className="container mx-auto px-2 py-6">
				<h1 className="text-2xl font-bold text-red-600">
					{searchParams.itemType ? searchParams.itemType : '指定された'}のアイテムが見つかりませんでした
				</h1>
				<p>アイテムが存在しないか、取得中にエラーが発生しました。</p>
			</div>
		)
	}

	const relatedItemTypes: ItemType[] = ['todaynew', 'debut', 'feature', 'sale']
	const relatedItemsData = await Promise.all(
		relatedItemTypes.map(async (type) => ({
			type,
			items: await fetchRelatedItems(type)
		}))
	)

	return (
		<div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
			<div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8">
				<article className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 space-y-6 sm:space-y-8">
					<div className="relative overflow-hidden rounded-lg aspect-w-16 aspect-h-9">
						<Link href={ItemMain.affiliateURL || '#'} target="_blank" rel="noopener noreferrer">
							<img
								src={ItemMain.imageURL}
								alt={`${ItemMain.title}のパッケージ画像`}
								className="w-full h-full object-cover transition-transform duration-300"
							/>
						</Link>
					</div>

					<h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 text-center">
						{ItemMain.title}
					</h1>

					<div className="flex justify-center">
						<Link
							href={ItemMain.affiliateURL || '#'}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center justify-center text-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 rounded-full shadow-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 px-6 sm:px-8 py-3 sm:py-4"
						>
							<span className="mr-2">高画質動画を見る</span>
							<ExternalLink className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
						</Link>
					</div>

					<div className="w-full text-sm text-center my-4">このページに広告を設置しています</div>

					<Suspense fallback={<LoadingSpinner />}>
						<ItemDetails ItemMain={ItemMain} contentId={params.contentId} />
					</Suspense>

					{ItemMain.sampleImageURL && (
						<>
							<h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">サンプル画像</h2>
							<div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
								{ItemMain.sampleImageURL.map((imageUrl, index) => (
									<div key={index} className="aspect-w-16 aspect-h-9 relative rounded-lg overflow-hidden">
										<img
											src={imageUrl}
											alt={`${ItemMain.title}のサンプル画像${index + 1}`}
											className="w-full h-full object-cover transition-transform duration-300 "
										/>
									</div>
								))}
							</div>
							<div className="flex justify-center mt-6 sm:mt-8">
								<Link
									href={ItemMain.affiliateURL || '#'}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center justify-center text-lg sm:text-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 rounded-sm shadow-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 px-6 sm:px-8 py-3 sm:py-4 min-h-[3.5rem] sm:min-h-[4rem] max-w-[90%] text-center"
								>
									<span className="mr-2 break-words">{ItemMain.title}の高画質動画を見る</span>
									<ExternalLink className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse flex-shrink-0" />
								</Link>
							</div>
						</>
					)}
					{relatedItemsData.map(({ type, items }) => (
						<RelatedItemsScroll
							key={type}
							items={items}
							itemType={type}
							title={
								type === 'todaynew'
									? '今日配信の新作'
									: type === 'debut'
									? 'デビュー作品'
									: type === 'feature'
									? '注目作品'
									: '限定セール'
							}
						/>
					))}
				</article>
			</div>
		</div>
	)
}

// 24時間キャッシュ
export const revalidate = 86400
