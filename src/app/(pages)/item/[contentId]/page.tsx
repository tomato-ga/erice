// /Volumes/SSD_1TB/erice2/erice/src/app/(pages)/item/[contendId]/page.tsx

import { Suspense } from 'react'
import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import ArticleLBasic from '@/app/components/Article/ArticleLinks'
import KeywordRelatedArticles from '@/app/components/Article/ArticleLoaded/KeywordRelated'
import { DMMSaleItem } from '../../../../../types/dmmtypes'
import Link from 'next/link'

const PopularArticle = dynamic(() => import('@/app/components/Article/PopularArticle'))

interface Props {
	params: { contentId: string }
}

// export async function generateMetadata({ params }: Props): Promise<Metadata> {
// 	const article = await getKobetuArticle(params.postId)

// 	if (!article) {
// 		return {
// 			title: '記事が見つかりません',
// 			description: '指定された記事は存在しないか、取得できませんでした。'
// 		}
// 	}

// 	return {
// 		title: article.title,
// 		description: article.title,
// 		openGraph: {
// 			title: article.title,
// 			description: article.title,
// 			images: [
// 				{
// 					url: article.image_url,
// 					width: 1200,
// 					height: 630,
// 					alt: article.title
// 				}
// 			]
// 		},
// 		twitter: {
// 			card: 'summary_large_image',
// 			title: article.title,
// 			description: article.title,
// 			images: [article.image_url]
// 		}
// 	}
// }

export default async function DMMKobetuItemPage({ params }: Props) {
	console.log('Received params:', params)

	const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dmm-sale-getkv`)
	const saleItems: DMMSaleItem[] = await response.json()

	console.log('params.contentId:', params.contentId)
	console.log('saleItems length:', saleItems.length)
	console.log('First few saleItems:', saleItems.slice(0, 3))

	const Item = saleItems.find((itemmap) => {
		// console.log('Comparing:', itemmap.content_id, params.contentId)
		return itemmap.content_id === params.contentId
	})

	// TODO KVのItemがなかったらD1から取得する
	// TODO 女優情報だけ欲しい

	console.log('Found Item:', Item)

	if (!params.contentId || !Item) {
		return (
			<div className="container mx-auto px-2 py-6">
				<h1 className="text-2xl font-bold text-red-600">記事が見つかりませんでした</h1>
				<p>記事が存在しないか、取得中にエラーが発生しました。</p>
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
				</article>
			</div>
		</div>
	)
}
