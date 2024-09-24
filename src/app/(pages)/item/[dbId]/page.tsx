// /Volumes/SSD_1TB/erice2/erice/src/app/(pages)/item/[dbId]/page.tsx

import { PostList } from '@/app/components/antennacomponents/PostList'
import { CommentSection } from '@/app/components/dmmcomponents/Comment/CommentSection'
import ProductDetails from '@/app/components/dmmcomponents/DMMKobetuItemTable'
import ItemDetails from '@/app/components/dmmcomponents/ItemDetails'
import RelatedItemsScroll from '@/app/components/dmmcomponents/Related/RelatedItemsScroll'
import { UmamiTracking } from '@/app/components/dmmcomponents/UmamiTracking'
import {
	fetchItemDetailByContentId,
	fetchItemMainByContentId,
	fetchItemMainByContentIdToActressInfo,
	fetchRelatedItems,
} from '@/app/components/dmmcomponents/fetch/itemFetchers'
import { DMMItemMainResponse } from '@/types/dmmitemzodschema'
import { ExtendedDMMItem, ItemType } from '@/types/dmmtypes'
import { formatDate } from '@/utils/dmmUtils'
import { ExternalLink } from 'lucide-react'
import { Metadata } from 'next'

import Link from 'next/link'
import { Suspense } from 'react'
import '@/app/_css/styles.css'
import SaleFloatingBanner from '@/app/components/dmmcomponents/FloatingBanner/FloatingBanner'

interface Props {
	params: { dbId: number }
}

function LoadingSpinner() {
	return (
		<div className='flex justify-center items-center h-64' aria-label='読み込み中'>
			<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900' />
		</div>
	)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	console.log('params:', params)

	const dbId = params.dbId
	let title = 'エロコメスト'
	let description = '詳細ページ'

	try {
		const itemMain = await fetchItemMainByContentId(dbId)
		const itemDetail = await fetchItemDetailByContentId(dbId)

		if (itemMain && itemDetail) {
			title = `${itemMain.content_id} ${itemMain.title} | エロコメスト`
			description = `${itemMain.title} ${itemMain.content_id}のページです。${
				itemDetail.actress && itemDetail.date
					? `女優は${itemDetail.actress}で、発売日は${formatDate(itemDetail.date)}です。`
					: '詳細情報は準備中です'
			}`
		}
	} catch (error) {
		console.error('メタデータの取得中にエラーが発生しました:', error)
	}

	return {
		title,
		description,
		// TODO opengraph修正する
		openGraph: {
			title,
			description,
			type: 'website',
			url: `https://erocomesuto.com/item/${dbId}`,
			images: [
				{
					url: 'https://erocomesuto.com/ogp.jpg',
					width: 1200,
					height: 630,
					alt: 'エロコメスト OGP画像',
				},
			],
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			images: ['https://erocomesuto.com/ogp.jpg'],
		},
	}
}

const VideoPlayer = ({ src }: { src: string | null | undefined }) => {
	// srcが存在しない場合はnullを返す
	if (!src) return null

	const sizePriority = ['size_720_480', 'size_644_414', 'size_560_360', 'size_476_306']

	// URLからサイズ情報を抽出する関数
	const extractSize = (url: string): { width: number; height: number } | null => {
		for (const size of sizePriority) {
			const match = url.match(new RegExp(`/${size}/`))
			if (match) {
				const [width, height] = size.split('_').slice(1).map(Number)
				return { width, height }
			}
		}
		return null
	}

	const size = extractSize(src)
	const width = size?.width || 720 // デフォルト値
	const height = size?.height || 480 // デフォルト値

	return (
		<div className='video-player-container flex justify-center items-center my-8'>
			<div className='max-w-full'>
				<iframe
					src={src}
					width={width}
					height={height}
					allow='autoplay'
					title='動画プレイヤー'
					className='border-0 overflow-hidden max-w-full'
				/>
			</div>
		</div>
	)
}

export default async function DMMKobetuItemPage({
	params,
	searchParams,
}: Props & { searchParams: { itemType?: ItemType } }) {
	// console.log('Received params:', params)
	// console.log('itemType:', searchParams.itemType)

	let ItemMain: DMMItemMainResponse | null = null
	try {
		ItemMain = await fetchItemMainByContentId(params.dbId)
	} catch (error) {
		console.error('Error fetching item:', error)
	}
	// console.log('Found ItemMain:', ItemMain)

	const actressInfo = await fetchItemMainByContentIdToActressInfo(params.dbId)
	console.log('Found actressInfo:', actressInfo)

	if (!ItemMain) {
		return (
			<div className='container mx-auto px-2 py-6'>
				<h1 className='text-2xl font-bold text-red-600'>
					{searchParams.itemType ? searchParams.itemType : '指定された'}
					のアイテムが見つかりませんでした
				</h1>
				<p>アイテムが存在しないか、取得中にエラーが発生しました。</p>
			</div>
		)
	}

	const relatedItemTypes: ItemType[] = ['todaynew', 'debut', 'feature', 'sale']
	const relatedItemsData = await Promise.all(
		relatedItemTypes.map(async type => ({
			type,
			items: (await fetchRelatedItems(type)) as ExtendedDMMItem[],
		})),
	)

	return (
		<div className='bg-gray-50 dark:bg-gray-900 min-h-screen'>
			<div className='container mx-auto px-2 sm:px-4 py-6 sm:py-8'>
				<article className='bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 space-y-6 sm:space-y-8'>
					<PostList limit={12} />

					<div className='relative overflow-hidden aspect-w-16 aspect-h-9'>
						<UmamiTracking
							trackingData={{
								dataType: 'combined',
								from: 'kobetu-img-top',
								item: ItemMain,
								actressInfo: actressInfo,
							}}>
							<Link href={ItemMain.affiliateURL || '#'} target='_blank' rel='noopener noreferrer'>
								<img
									src={ItemMain.imageURL}
									alt={`${ItemMain.title}のパッケージ画像`}
									className='w-full h-full object-contain transition-transform duration-300'
								/>
							</Link>
						</UmamiTracking>
					</div>

					<h1 className='text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 text-center'>
						{ItemMain.title}
					</h1>

					{/* <div className='flex justify-center'>
						<div className='relative inline-block group'>
							<div className='absolute inset-2 rounded-full opacity-20 group-hover:opacity-100 transition-opacity duration-500 ease-in-out bg-custom-gradient-exbutton bg-custom-gradient-exbutton--dmm z-0' />
							<UmamiTracking
								trackingData={{
									dataType: 'combined',
									from: 'kobetu-exlink-top',
									item: ItemMain,
									actressInfo: actressInfo,
								}}>
								<Link
									href={ItemMain.affiliateURL}
									target='_blank'
									rel='noopener noreferrer'
									className='relative z-10 inline-flex items-center justify-center text-xl font-semibold text-white rounded-full shadow-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 px-6 sm:px-8 py-3 sm:py-4 transform hover:-translate-y-0.5 bg-custom-gradient-exbutton bg-custom-gradient-exbutton--dmm'>
									<span className='mr-2'>高画質動画を見る</span>
									<ExternalLink className='w-5 h-5 sm:w-6 sm:h-6 animate-pulse' />
								</Link>
							</UmamiTracking>
						</div>
					</div> */}

					{/* <div className='flex justify-center'>
						<div className='relative inline-block group'>
							<div className='absolute inset-2 rounded-full opacity-70 blur-xl group-hover:opacity-100 transition-opacity duration-500 ease-in-out bg-custom-gradient-exbutton bg-custom-gradient-exbutton--dmm z-10' />
							<div>
								<Link
									href='https://example.com/affiliate-link'
									target='_blank'
									rel='noopener noreferrer'
									className='relative z-20 inline-flex items-center justify-center text-xl font-semibold text-white rounded-full shadow-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 px-6 sm:px-8 py-3 sm:py-4 transform hover:-translate-y-0.5 bg-custom-gradient-exbutton bg-custom-gradient-exbutton--dmm'>
									<span className='mr-2'>高画質動画を見る</span>
									<ExternalLink className='w-5 h-5 sm:w-6 sm:h-6 animate-pulse' />
								</Link>
							</div>
						</div>
					</div> */}

					<div className='flex justify-center'>
						<div className='relative inline-block group'>
							{/* グラデーションオーバーレイ */}
							<div className='absolute inset-2 rounded-full opacity-70 blur-xl group-hover:opacity-100 transition-opacity duration-500 ease-in-out bg-custom-gradient-exbutton bg-custom-gradient-exbutton--dmm z-0 pointer-events-none' />

							{/* ボタン */}
							<UmamiTracking
								trackingData={{
									dataType: 'combined',
									from: 'kobetu-exlink-top',
									item: ItemMain,
									actressInfo: actressInfo,
								}}>
								<Link
									href={ItemMain.affiliateURL}
									target='_blank'
									rel='noopener noreferrer'
									className='relative z-10 inline-flex items-center justify-center text-xl font-semibold text-white rounded-full shadow-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 px-6 sm:px-8 py-3 sm:py-4 hover:bg-gray-700 transform hover:-translate-y-0.5 bg-custom-gradient-exbutton bg-custom-gradient-exbutton--dmm' /* 修飾クラスを追加 */
								>
									<span className='mr-2'>高画質動画を見る</span>
									<ExternalLink className='w-5 h-5 sm:w-6 sm:h-6 animate-pulse' />
								</Link>
							</UmamiTracking>
						</div>
					</div>

					<Suspense fallback={<LoadingSpinner />}>
						<CommentSection contentId={ItemMain.content_id} />
					</Suspense>

					<div className='w-full text-sm text-center my-4'>このページに広告を設置しています</div>

					<Suspense fallback={<LoadingSpinner />}>
						<ProductDetails
							title={ItemMain.title}
							contentId={ItemMain.content_id}
							dbId={params.dbId}
						/>
					</Suspense>

					{ItemMain.sampleImageURL && ItemMain.sampleImageURL.length > 0 && (
						<div className='mt-8'>
							<h2 className='text-center font-bold mb-6'>
								<span className='text-2xl bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text'>
									サンプル画像
								</span>
							</h2>
							<div className='grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4'>
								{ItemMain.sampleImageURL.map((imageUrl, index) => (
									<div
										key={index}
										className='aspect-w-16 aspect-h-9 relative overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300'>
										<img
											src={imageUrl}
											alt={`${ItemMain.title} ${ItemMain.content_id}のサンプル画像${index + 1}`}
											className='w-full h-full object-contain transition-transform duration-300'
										/>
									</div>
								))}
							</div>
						</div>
					)}

					{ItemMain.sampleMovieURL && ItemMain.sampleMovieURL.length > 0 && (
						<div className='mt-8'>
							<h2 className='text-center font-bold mb-6'>
								<span className='text-2xl bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text'>
									サンプル動画
								</span>
							</h2>
							<div className='flex justify-center'>
								<VideoPlayer src={ItemMain.sampleMovieURL[0]} />
							</div>
						</div>
					)}

					<div className='flex justify-center'>
						{/* 親要素に `group` クラスを追加 */}
						<div className='relative inline-block group'>
							<div className='absolute inset-3 rounded-full bg-custom-gradient-exbutton bg-custom-gradient-exbutton--dmm z-0 pointer-events-none transform group-hover:scale-100  duration-500 ease-in-out blur-lg' />

							<UmamiTracking
								trackingData={{
									dataType: 'combined',
									from: 'kobetu-exlink-bottom',
									item: ItemMain,
									actressInfo: actressInfo,
								}}>
								<Link
									href={ItemMain.affiliateURL}
									target='_blank'
									rel='noopener noreferrer'
									className='relative z-10 inline-flex items-center justify-center text-xl font-semibold text-white rounded-sm shadow-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 px-6 sm:px-8 py-3 sm:py-4 transform bg-custom-gradient-exbutton bg-custom-gradient-exbutton--dmm will-change-background-position'>
									<span className='mr-2'>{ItemMain.title}の高画質動画を見る</span>
									<ExternalLink className='w-5 h-5 sm:w-6 sm:h-6 animate-pulse' />
								</Link>
							</UmamiTracking>
						</div>
					</div>

					<Suspense fallback={<LoadingSpinner />}>
						<ItemDetails contentId={ItemMain.content_id} dbId={params.dbId} />
					</Suspense>

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
				{/* <SaleFloatingBanner saleLink={ItemMain.affiliateURL} saleText={ItemMain.title} /> */}
			</div>
		</div>
	)
}

// 24時間キャッシュ
export const revalidate = 86400
