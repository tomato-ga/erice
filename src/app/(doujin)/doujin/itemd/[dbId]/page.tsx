import { DoujinItemType, DoujinKobetuItem } from '@/_types_doujin/doujintypes'
import { CommentSection } from '@/app/components/dmmcomponents/Comment/CommentSection'

import RelatedItemsScroll from '@/app/components/dmmcomponents/Related/RelatedItemsScroll'
import { UmamiTracking } from '@/app/components/dmmcomponents/UmamiTracking'
import { fetchRelatedItems } from '@/app/components/dmmcomponents/fetch/itemFetchers'
import { ExternalLink } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

// 型定義をそのまま使用
type Props = {
	params: { dbId: string }
}

// ItemType を拡張して 'review' を含める
type ExtendedItemType = DoujinItemType | 'review'

// メタデータ生成の強化
export async function generateMetadata({ params }: Props): Promise<Metadata> {
	try {
		const item = await fetchItemData(params.dbId)
		const title = `${item.title} | エロコメスト`
		const description = `${item.title}の商品詳細ページです。`
		const url = `https://yourwebsite.com/doujin/${params.dbId}` // 実際のURLに置き換えてください

		return {
			title,
			description,
			openGraph: {
				title,
				description,
				type: 'article',
				url,
				images: [{ url: item.package_images }],
			},
			twitter: {
				card: 'summary_large_image',
				title,
				description,
				images: [item.package_images],
			},
		}
	} catch (error) {
		console.error('Error generating metadata:', error)
		return {
			title: 'エロコメスト - 商品詳細',
			description: '商品詳細ページです。',
		}
	}
}

// アイテムデータの取得関数
async function fetchItemData(dbId: string): Promise<DoujinKobetuItem> {
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/doujin-item?db_id=${dbId}`, {
		next: { revalidate: 3600 },
	})

	if (!res.ok) {
		throw new Error(`Failed to fetch item data: ${res.status} ${res.statusText}`)
	}

	return res.json()
}

// ローディングスピナーのコンポーネント
function LoadingSpinner() {
	return (
		<div className='flex justify-center items-center h-64' aria-label='読み込み中'>
			<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900' />
		</div>
	)
}

// メインのコンポーネント
export default async function DoujinKobetuItemPage({ params }: Props) {
	try {
		const item = await fetchItemData(params.dbId)
		console.log('item:', item)

		// 関連アイテムのデータを取得
		// const relatedItemTypes: ExtendedItemType[] = ['newrank', 'newrelease', 'review', 'sale']
		// const relatedItemsData = await Promise.all(
		// 	relatedItemTypes.map(async type => ({
		// 		type,
		// 		items: await fetchRelatedItems(type as DoujinItemType),
		// 	})),
		// )

		return (
			<div className='bg-gray-50 dark:bg-gray-900 min-h-screen'>
				<div className='container mx-auto px-4 sm:px-6 py-8 sm:py-12'>
					<article className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 space-y-8'>
						<div className='relative aspect-w-16 aspect-h-9 overflow-hidden rounded-lg'>
							<UmamiTracking
								trackingData={{
									dataType: 'doujin-item',
									from: 'kobetu-img-top',
									item: { title: item.title, content_id: item.content_id },
								}}>
								<Link href={item.affiliate_url} target='_blank' rel='noopener noreferrer'>
									<img
										src={item.package_images}
										alt={`${item.title}のパッケージ画像`}
										className='w-full h-full object-contain transition-transform duration-300'
									/>
								</Link>
							</UmamiTracking>
						</div>

						<h1 className='text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 text-center'>
							{item.title}
						</h1>

						<div className='flex justify-center'>
							<UmamiTracking
								trackingData={{
									dataType: 'doujin-item',
									from: 'kobetu-exlink-top',
									item: { title: item.title, content_id: item.content_id },
								}}>
								<Link
									href={item.affiliate_url}
									target='_blank'
									rel='noopener noreferrer'
									className='inline-flex items-center justify-center text-xl font-semibold text-white bg-gradient-to-r from-pink-500 to-rose-600 dark:from-pink-600 dark:to-rose-700 rounded-full shadow-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 dark:focus:ring-pink-400 px-8 py-4'>
									<span className='mr-2'>商品ページへ</span>
									<ExternalLink className='w-6 h-6 animate-pulse' />
								</Link>
							</UmamiTracking>
						</div>

						<div className='space-y-6'>
							<div className='text-center'>
								<span className='text-red-600 font-bold text-3xl'>
									{typeof item.prices === 'string' ? `${item.prices}円` : 'N/A'}
								</span>
							</div>

							{/* ここではレビューセクションはコメントアウトされています */}

							<div className='space-y-8'>
								{item.genres && item.genres.length > 0 && (
									<div>
										<h2 className='font-semibold text-xl mb-4 text-gray-800 dark:text-gray-200'>
											ジャンル
										</h2>
										<div className='flex flex-wrap gap-3'>
											{item.genres.map((genre, index) => (
												<span
													key={index}
													className='bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-blue-100 hover:shadow-md border border-blue-200'>
													<Link
														href={`/doujin/genre/${encodeURIComponent(genre)}`}
														className='text-base text-blue-600 dark:text-gray-100 break-words mr-2 hover:border-b-2 hover:border-blue-500'
														prefetch={true}>
														{genre}
													</Link>
												</span>
											))}
										</div>
									</div>
								)}

								{item.makers && item.makers.length > 0 && (
									<div>
										<h2 className='font-semibold text-xl mb-4 text-gray-800 dark:text-gray-200'>
											メーカー
										</h2>
										<div className='flex flex-wrap gap-3'>
											{item.makers.map((maker, index) => (
												<span
													key={index}
													className='bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-green-100 hover:shadow-md border border-green-200'>
													{maker}
												</span>
											))}
										</div>
									</div>
								)}

								{item.series && item.series.length > 0 && (
									<div>
										<h2 className='font-semibold text-xl mb-4 text-gray-800 dark:text-gray-200'>
											シリーズ
										</h2>
										<div className='flex flex-wrap gap-3'>
											{item.series.map((series, index) => (
												<span
													key={index}
													className='bg-purple-50 text-purple-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-purple-100 hover:shadow-md border border-purple-200'>
													{series}
												</span>
											))}
										</div>
									</div>
								)}
							</div>
						</div>

						{/* サンプル画像の表示 */}
						{item.sample_images && item.sample_images.length > 0 && (
							<div className='mt-8'>
								<h2 className='text-center font-bold mb-6'>
									<span className='text-2xl bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text'>
										サンプル画像
									</span>
								</h2>
								<div className='grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4'>
									{item.sample_images.map((imageObj, index) => (
										<div
											key={index}
											className='aspect-w-16 aspect-h-9 relative overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300'>
											<img
												src={imageObj ? imageObj : ''}
												alt={`${item.title} のサンプル画像 ${index + 1}`}
												className='w-full h-full object-contain transition-transform duration-300'
											/>
										</div>
									))}
								</div>
							</div>
						)}

						{/* コメントセクションの追加 */}
						<Suspense fallback={<LoadingSpinner />}>
							<CommentSection contentId={item.content_id} />
						</Suspense>

						{/* 関連アイテムの表示 */}
						{/* {relatedItemsData.map(({ type, items }) => (
							<RelatedItemsScroll
								key={type}
								items={items}
								itemType={type}
								title={
									type === 'newrank'
										? '新着ランキング'
										: type === 'newrelease'
											? '新着作品'
											: type === 'review'
												? 'レビュー作品'
												: '限定セール'
								}
							/>
						))} */}

						<div className='mt-8'>
							<UmamiTracking
								trackingData={{
									dataType: 'doujin-item',
									from: 'kobetu-exlink-bottom',
									item: { title: item.title, content_id: item.content_id },
								}}>
								<div className='flex justify-center'>
									<Link
										href={item.affiliate_url}
										target='_blank'
										rel='noopener noreferrer'
										className='inline-flex items-center justify-center text-xl font-semibold text-white bg-gradient-to-r from-pink-500 to-rose-600 dark:from-pink-600 dark:to-rose-700 rounded-sm shadow-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 dark:focus:ring-pink-400 px-8 py-4'>
										<span className='mr-2 break-words'>{item.title}の商品ページへ</span>
										<ExternalLink className='w-6 h-6 animate-pulse flex-shrink-0' />
									</Link>
								</div>
							</UmamiTracking>
						</div>
					</article>
				</div>
			</div>
		)
	} catch (error) {
		console.error('Error fetching item data:', error)
		return notFound()
	}
}

// キャッシュの再検証時間を24時間に変更
export const revalidate = 86400
