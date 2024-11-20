// /app/(pages)/item/[dbId]/page.tsx

import ProductDetails from '@/app/components/dmmcomponents/DMMKobetuItemTable'
import ItemDetails from '@/app/components/dmmcomponents/ItemDetails'
import RelatedItemsScroll from '@/app/components/dmmcomponents/Related/RelatedItemsScroll'
import { UmamiTracking } from '@/app/components/dmmcomponents/UmamiTracking'
import {
	fetchCampaignNames,
	fetchItemDetailByContentId,
	fetchItemMainByContentId,
	fetchItemMainByContentIdToActressInfo,
	fetchRelatedItems,
} from '@/app/components/dmmcomponents/fetch/itemFetchers'

import { ExtendedDMMItem, ItemType } from '@/types/dmmtypes'
import { formatDate } from '@/utils/dmmUtils'
import { ExternalLink } from 'lucide-react'
import { Metadata } from 'next'

import Link from 'next/link'
import { Suspense } from 'react'
import '@/app/_css/styles.css'
import ButtonTestComponent from '@/app/components/dmmcomponents/ABtest/GradientButton/ButtonTestCompo'
import StructuredDataScript from './StructuredData'

import FanzaADBannerFanzaKobetu from '@/app/components/dmmcomponents/fanzaADBannerKobetu'
22
import dynamic from 'next/dynamic'

const DynamicVideoPlayer = dynamic(() => import('@/app/components/dmmcomponents/DMMVideoPlayer'), {
	ssr: false,
})

const DynamicCommentSection = dynamic(
	() => import('@/app/components/dmmcomponents/Comment/CommentSection'),
	{
		ssr: false,
	},
)

const DynamicItemDetails = dynamic(() => import('@/app/components/dmmcomponents/ItemDetails'), {
	ssr: true,
})

const DynamicSampleImageGallery = dynamic(
	() => import('@/app/components/dmmcomponents/DMMSampleImage'),
	{
		ssr: false, // Disables SSR for this component to load it only on the client side
	},
)

const DynamicBreadcrumb = dynamic(() => import('@/app/components/dmmcomponents/DMMBreadcrumb'), {
	ssr: false,
})

const DynamicRelatedItemsScroll = dynamic(
	() => import('@/app/components/dmmcomponents/Related/RelatedItemsScroll'),
)

import { CampaignLinksProps } from '@/app/components/dmmcomponents/DMMCampaignNames'
import { getItemData, preload } from '@/app/components/dmmcomponents/fetch/item-fetch-pre'
import Iho from '@/app/components/iho/iho'

// Dynamic import for CampaignLinks with explicit type
const DynamicCampaignLinks = dynamic<CampaignLinksProps>(
	() => import('@/app/components/dmmcomponents/DMMCampaignNames'),
	{
		ssr: false, // クライアントサイドでのみレンダリング
	},
)

const DynamicButtonTest = dynamic(
	() => import('@/app/components/dmmcomponents/ABtest/GradientButton/ButtonTestCompo'),
	{
		ssr: false,
	},
)

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
	const { dbId } = params

	preload(dbId)
	const { itemMain, itemDetail } = await getItemData(dbId)
	// const { itemMain, itemDetail } = await getPageData(dbId) // getPageDataで取得済みのデータを使用

	let title = 'エロコメスト'
	let description = '詳細ページ'

	if (itemMain && itemDetail) {
		const newDescription = (() => {
			const parts = []
			if (itemDetail.date) parts.push(`${formatDate(itemDetail.date)}配信開始の、`)
			if (itemDetail.actress) parts.push(`${itemDetail.actress}が出演するエロ動画作品`)
			parts.push(
				`「${itemMain.title} - (${itemMain.content_id})」のキャプチャ画面とダウンロード情報、無料サンプル動画。`,
			)
			if (itemDetail.actress)
				parts.push(
					`${itemDetail.actress}さんのレビュー統計データと出演作品を発売順で紹介しています。`,
				)
			return parts.join('')
		})()
		title = `${itemMain.title} - ${itemMain.content_id}`
		description = newDescription
	}

	return { title, description }
}

export default async function DMMKobetuItemPage({
	params,
	searchParams,
}: Props & { searchParams: { itemType?: ItemType } }) {
	// getPageDataでデータを取得
	// const { itemMain, itemDetail, actressInfo } = await getPageData(params.dbId)
	const { itemMain, itemDetail, actressInfo, campaignNames } = await getItemData(params.dbId)
	if (!itemMain) {
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

	if (!itemDetail) {
		return <div>ItemDetailが見つかりません</div>
	}

	// Breadcrumb用のデータを作成
	const breadcrumbItems = [
		{ name: 'ホーム', href: 'https://erice.cloud/' },
		...(itemDetail.actress
			? [
					{
						name: itemDetail.actress.split(',')[0], // カンマで分割して最初の要素のみを使用
						href: `https://erice.cloud/actressprofile/${encodeURIComponent(itemDetail.actress.split(',')[0])}`,
					},
				]
			: []),
		{ name: itemMain.title, href: `https://erice.cloud/item/${params.dbId}` },
	]

	const description = (() => {
		const parts = []
		parts.push(
			`${itemMain.title} ${itemMain.content_id}の詳細情報と、サンプル画像・動画やレビュー統計データを見ることができるページです。`,
		)

		if (itemDetail.actress) {
			parts.push(`女優は${itemDetail.actress}さんです。`)
		}

		if (itemDetail.date) {
			parts.push(`このエロ動画の発売日は${formatDate(itemDetail.date)}。`)
		}

		if (itemDetail.director && itemDetail.director.length > 0) {
			parts.push(`監督は${itemDetail.director}さんです。`)
		}

		if (itemDetail.maker) {
			parts.push(`メーカーは${itemDetail.maker}から発売されています。`)
		}

		return parts.join(' ')
	})()

	// const campaignNames = await fetchCampaignNames()

	return (
		<>
			<div className='bg-gray-50 dark:bg-gray-900 min-h-screen'>
				<div className='container mx-auto px-2 sm:px-4 py-6 sm:py-8'>
					{/* Breadcrumb */}

					<DynamicBreadcrumb items={breadcrumbItems} />

					<article className='bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 space-y-6 sm:space-y-8'>
						<h1 className='text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 text-center'>
							{itemMain.title}
						</h1>
						<p className='text-gray-600 dark:text-gray-300 text-base mt-4'>{description}</p>

						<div className='relative overflow-hidden aspect-w-16 aspect-h-9'>
							<Suspense fallback={<LoadingSpinner />}>
								<UmamiTracking
									trackingData={{
										dataType: 'combined',
										from: 'kobetu-img-top',
										item: itemMain,
										actressInfo: actressInfo,
									}}>
									<Link href={itemMain.affiliateURL} target='_blank' rel='noopener noreferrer'>
										<img
											src={itemMain.imageURL}
											alt={`${itemMain.title}のパッケージ画像`}
											className='w-full h-full object-contain transition-transform duration-300'
											decoding='async'
											loading='lazy'
											fetchPriority='high'
										/>
									</Link>
								</UmamiTracking>
							</Suspense>
						</div>

						<Suspense fallback={<LoadingSpinner />}>
							<ProductDetails
								title={itemMain.title}
								content_id={itemMain.content_id}
								itemDetail={itemDetail}
							/>
						</Suspense>

						<Suspense fallback={<LoadingSpinner />}>
							<DynamicButtonTest ItemMain={itemMain} actressInfo={actressInfo} />
						</Suspense>

						<Suspense fallback={<LoadingSpinner />}>
							<FanzaADBannerFanzaKobetu />
						</Suspense>

						{/* DynamicCampaignLinksコンポーネントの呼び出し */}
						{campaignNames && campaignNames.length > 0 && (
							<DynamicCampaignLinks campaignNames={campaignNames} />
						)}

						<div className='w-full text-sm text-center my-4'>このページに広告を設置しています</div>

						{itemMain.sampleImageURL && itemMain.sampleImageURL.length > 0 && (
							<Suspense fallback={<LoadingSpinner />}>
								<DynamicSampleImageGallery
									title={itemMain.title}
									contentId={itemMain.content_id}
									sampleImageURLs={itemMain.sampleImageURL}
								/>
							</Suspense>
						)}

						{itemMain.sampleMovieURL && itemMain.sampleMovieURL.length > 0 && (
							<div className='mt-8'>
								<h2 className='text-center font-bold mb-6'>
									<span className='text-2xl bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text'>
										無料のサンプル動画
									</span>
								</h2>
								<div className='flex justify-center'>
									<Suspense fallback={<LoadingSpinner />}>
										<DynamicVideoPlayer src={itemMain.sampleMovieURL[0]} />
									</Suspense>
								</div>
							</div>
						)}

						<Suspense fallback={<LoadingSpinner />}>
							<DynamicCommentSection contentId={itemMain.content_id} />
						</Suspense>

						<div className='flex justify-center'>
							<div className='relative inline-block group'>
								<div className='absolute inset-3 rounded-full bg-custom-gradient-exbutton bg-custom-gradient-exbutton--dmm z-0 pointer-events-none transform group-hover:scale-100  duration-500 ease-in-out blur-lg' />

								<Suspense fallback={<LoadingSpinner />}>
									<UmamiTracking
										trackingData={{
											dataType: 'combined',
											from: 'kobetu-exlink-bottom',
											item: itemMain,
											actressInfo: actressInfo,
										}}>
										<Link
											href={itemMain.affiliateURL}
											target='_blank'
											rel='noopener noreferrer'
											className='relative z-10 inline-flex items-center justify-center text-xl font-semibold text-white rounded-sm shadow-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 px-6 sm:px-8 py-3 sm:py-4 transform bg-custom-gradient-exbutton bg-custom-gradient-exbutton--dmm will-change-background-position'>
											<span className='mr-2'>{itemMain.title}の高画質動画を見る</span>
											<ExternalLink className='w-5 h-5 sm:w-6 sm:h-6 animate-pulse' />
										</Link>
									</UmamiTracking>
								</Suspense>
							</div>
						</div>

						<Suspense fallback={<LoadingSpinner />}>
							<DynamicItemDetails contentId={itemMain.content_id} dbId={params.dbId} />
						</Suspense>

						<StructuredDataScript
							itemMain={itemMain}
							itemDetail={itemDetail}
							description={description}
							dbId={params.dbId}
						/>

						<Iho />

						<Suspense fallback={<LoadingSpinner />}>
							{relatedItemsData.map(({ type, items }) => (
								<DynamicRelatedItemsScroll
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
						</Suspense>
					</article>
				</div>
			</div>
		</>
	)
}

// 1ヶ月キャッシュ
export const revalidate = 2592000
