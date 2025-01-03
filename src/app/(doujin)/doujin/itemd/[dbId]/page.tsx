// /Volumes/SSD_1TB/erice2/erice/src/app/(doujin)/doujin/itemd/[dbId]/page.tsx

import { DoujinKobetuItem } from '@/_types_doujin/doujintypes'

import { UmamiTracking } from '@/app/components/dmmcomponents/UmamiTracking'
// import { formatPrice } from '@/utils/typeGuards'
import { ExternalLink } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table' // shadcnのテーブルコンポーネントをインポート
import '@/app/_css/styles.css'

// import SeriesTimelinePage from '@/app/components/doujincomponents/kobetu/SeriesTimeline'
// import MakerTimelinePage from '@/app/components/fbookscomponents/kobetu/MakerTimeline'

import {
	generateDoujinBreadcrumbList,
	generateDoujinKobetuItemStructuredData,
} from '@/app/components/json-ld/doujinjsonld'

import { formatDate } from '@/utils/dmmUtils'

import ButtonTestDoujinComponent from '@/app/components/dmmcomponents/ABtest/Doujin_GradientButton/ButtonTestCompo'
import FanzaADBannerKobetu from '@/app/components/doujincomponents/fanzaADBannerKobetu'

import React from 'react'

import { Stats } from '@/_types_dmm/statstype'
import Iho from '@/app/components/iho/iho'
import dynamic from 'next/dynamic'

// 型定義をそのまま使用
type Props = {
	params: { dbId: string }
}

const DynamicSmapleImageGallery = dynamic(
	() => import('@/app/components/doujincomponents/kobetu/DoujinSampleImage'),
	{
		ssr: false,
	},
)

const DynamicCommentSection = dynamic(
	() => import('@/app/components/dmmcomponents/Comment/CommentSection'),
	{
		ssr: false,
	},
)

const DynamicBreadcrumb = dynamic(
	() => import('@/app/components/doujincomponents/kobetu/DoujinBreadcrumb'),
	{
		ssr: false,
	},
)

const DynamicSeriesTimeline = dynamic(
	() => import('@/app/components/doujincomponents/kobetu/SeriesTimeline'),
)

const DynamicMakerTimeline = dynamic(
	() => import('@/app/components/fbookscomponents/kobetu/MakerTimeline'),
)

const ItemDetailsTable: React.FC<{ item: DoujinKobetuItem }> = ({ item }) => {
	const details = [
		{ label: 'タイトル', value: item.title, icon: '🎬' },
		{
			label: '発売日',
			value: item.release_date ? formatDate(item.release_date) : '情報なし',
			icon: '📅',
		},
		{ label: 'コンテンツID', value: item.content_id, icon: '🔢' },
		{ label: 'ボリューム', value: item.volume || '情報なし', icon: '📊' },
		{
			label: 'レビュー数',
			value: item.review_count?.toString() ?? '情報なし',
			icon: '📝',
		},
		{
			label: 'ジャンル',
			value: item.genres && item.genres.length > 0 ? item.genres : '情報なし',
			icon: '📚',
		},
		{
			label: 'メーカー',
			value: item.makers && item.makers.length > 0 ? item.makers : '情報なし',
			icon: '🏭',
		},
		{
			label: 'シリーズ',
			value: item.series && item.series.length > 0 ? item.series : '情報なし',
			icon: '📺',
		},
	]

	const getLinkClassName = (label: string) => {
		if (label === 'ジャンル') {
			return 'bg-blue-50 text-blue-700 px-3 py-1 rounded text-sm font-semibold hover:bg-blue-100 transition-colors'
		}
		if (label === 'メーカー' || label === 'シリーズ') {
			return 'text-blue-600 hover:underline'
		}
		return ''
	}

	const getLink = (label: string, item: { id: number; name: string }) => {
		switch (label) {
			case 'ジャンル':
				return `/doujin/genre/${encodeURIComponent(item.name)}`
			case 'メーカー':
				return `/doujin/maker/${encodeURIComponent(item.name)}`
			// case 'シリーズ':
			// 	return `/doujin/series/${encodeURIComponent(item.name)}`
			default:
				return '#'
		}
	}

	return (
		<Table className='w-full mt-3'>
			<TableBody>
				{details.map(({ label, value, icon }) => (
					<TableRow key={label} className='bg-white dark:bg-gray-800'>
						<TableCell className='whitespace-nowrap p-4 flex items-center'>
							<span className='text-2xl mr-4 opacity-80' aria-hidden='true'>
								{icon}
							</span>
							<span className='text-sm font-medium text-gray-600 dark:text-gray-400'>{label}</span>
						</TableCell>
						<TableCell className='p-4'>
							{(label === 'ジャンル' || label === 'メーカー' || label === 'シリーズ') &&
							Array.isArray(value) ? (
								<div className='flex flex-wrap gap-2'>
									{value.map((item, index) => (
										<Link
											key={index}
											href={getLink(label, item)}
											prefetch={false}
											className={getLinkClassName(label)}>
											{item.name}
										</Link>
									))}
								</div>
							) : label === 'タイトル' ? (
								<Link
									href={item.affiliate_url}
									className='text-blue-500 font-bold text-xl hover:underline'>
									<h2>{Array.isArray(value) ? value.map(v => v.name).join(', ') : value}</h2>
								</Link>
							) : (
								<p className='text-base text-gray-900 dark:text-gray-100 break-words'>
									{Array.isArray(value)
										? value.map(item => item.name).join(', ')
										: value || '情報なし'}
								</p>
							)}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}

// メタデータ生成の強化

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	try {
		const item = await fetchItemData(params.dbId)
		const title = `${item.title} - ${item.content_id}`

		let makerStatsData: Stats | null = null
		if (item.makers) {
			try {
				const statsResponse = await fetch(
					`${process.env.NEXT_PUBLIC_API_URL}/api/doujin-maker-stats?maker_id=${item.makers[0].id}`,
					{
						cache: 'force-cache',
					},
				)
				makerStatsData = await statsResponse.json()
			} catch (error) {
				console.error('Error fetching maker stats:', error)
			}
		}

		let seriesStatsData: Stats | null = null
		if (item.series) {
			try {
				const seriresstatsResponse = await fetch(
					`${process.env.NEXT_PUBLIC_API_URL}/api/doujin-series-stats?series_id=${item.series[0].id}`,
					{
						cache: 'force-cache',
					},
				)
				seriesStatsData = await seriresstatsResponse.json()
			} catch (error) {
				console.error('Error fetching series stats:', error)
			}
		}

		// robotsの設定を文字列で決定
		const robots = makerStatsData || seriesStatsData ? 'index, follow' : 'noindex, nofollow'

		const description = (() => {
			const parts = []
			parts.push(
				`${item.title} ${item.content_id}の詳細情報と、サンプル画像を見ることができるページです。`,
			)

			if (item.release_date) {
				parts.push(`この同人作品の発売日は${formatDate(item.release_date)}。`)
			}

			if (item.makers && item.makers.length > 0 && item.series && item.series.length > 0) {
				parts.push(
					`メーカーは「${item.makers[0].name}」さんから発売されています。シリーズは「${item.series[0].name}」です。`,
					`「${item.makers[0].name}」と「${item.series[0].name}」のレビュー統計データと出演作品を発売順タイムラインで紹介しています。`,
				)
			} else {
				if (item.makers && item.makers.length > 0) {
					parts.push(
						`メーカーは「${item.makers[0].name}」さんから発売されています。`,
						`「${item.makers[0].name}」さんのレビュー統計データと発売作品をタイムラインで紹介しています。`,
					)
				}
				if (item.series && item.series.length > 0) {
					parts.push(
						`シリーズは「${item.series[0].name}」です。`,
						`「${item.series[0].name}」シリーズのレビュー統計データと発売作品をタイムラインで紹介しています。`,
					)
				}
			}

			return parts.join(' ')
		})()
		const url = `https://erice.cloud/doujin/itemd/${params.dbId}` // 実際のURLに置き換えてください
		const imageUrl = item.package_images ?? 'https://erice.cloud/ogp.jpg' // Fallback image URL

		return {
			title,
			description,
			robots,
		}
	} catch (error) {
		console.error('Error generating metadata:', error)
		return {
			title: 'エロコメスト - 商品詳細',
			description: '商品詳細ページです。',
			robots: 'noindex, nofollow',
		}
	}
}

// アイテムデータの取得関数
async function fetchItemData(dbId: string): Promise<DoujinKobetuItem> {
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/doujin-item?db_id=${dbId}`)
	const data = await res.json()
	console.log('/doujin/itemd/[dbId] API response data:', data)

	if (!res.ok || !data || !data.success) {
		throw new Error(`Failed to fetch item data: ${res.status} ${res.statusText}`)
	}
	return data.rawData
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

		console.log('DoujinKobetuItemPage item:', item)

		const description = (() => {
			const parts = []
			parts.push(
				`${item.title} ${item.content_id}の詳細情報と、サンプル画像を見ることができるページです。`,
			)

			if (item.release_date) {
				parts.push(`この同人作品の発売日は${formatDate(item.release_date)}。`)
			}

			if (item.makers && item.makers.length > 0 && item.series && item.series.length > 0) {
				parts.push(
					`メーカーは「${item.makers[0].name}」さんから発売されています。シリーズは「${item.series[0].name}」です。`,
					`「${item.makers[0].name}」と「${item.series[0].name}」のレビュー統計データと出演作品を発売順タイムラインで紹介しています。`,
				)
			} else {
				if (item.makers && item.makers.length > 0) {
					parts.push(
						`メーカーは「${item.makers[0].name}」さんから発売されています。`,
						`「${item.makers[0].name}」さんのレビュー統計データと発売作品をタイムラインで紹介しています。`,
					)
				}
				if (item.series && item.series.length > 0) {
					parts.push(
						`シリーズは「${item.series[0].name}」です。`,
						`「${item.series[0].name}」シリーズのレビュー統計データと発売作品をタイムラインで紹介しています。`,
					)
				}
			}

			return parts.join(' ')
		})()

		// 商品情報とパンくずリストの構造化データを別々に生成
		const jsonLdData = await generateDoujinKobetuItemStructuredData(item, description)
		const jsonLdString = JSON.stringify(jsonLdData)

		// パンくずリストの構造化データを生成
		const breadcrumbData = generateDoujinBreadcrumbList(item)
		const breadcrumbJsonLdString = JSON.stringify(breadcrumbData)

		// DynamicBreadcrumb用のitemsを生成
		const breadcrumbItems = [
			{ name: 'ホーム', href: 'https://erice.cloud/' },
			{ name: '同人トップページ', href: 'https://erice.cloud/doujin/' },
			...(item.makers && item.makers.length > 0
				? [
						{
							name: item.makers[0].name,
							href: `https://erice.cloud/doujin/maker/${encodeURIComponent(item.makers[0].name)}`,
						},
					]
				: []),
			{ name: item.title, href: `https://erice.cloud/doujin/itemd/${item.db_id}` },
		]

		return (
			<>
				{/* 商品情報の構造化データ */}
				<script
					id={`structured-data-${item.content_id}`}
					type='application/ld+json'
					dangerouslySetInnerHTML={{
						__html: jsonLdString,
					}}
				/>
				{/* パンくずリストの構造化データ */}
				<script
					id={`structured-data-breadcrumb-${item.content_id}`}
					type='application/ld+json'
					dangerouslySetInnerHTML={{
						__html: breadcrumbJsonLdString,
					}}
				/>

				<div className='bg-gray-50 dark:bg-gray-900 min-h-screen'>
					<div className='container mx-auto px-4 sm:px-6 py-8 sm:py-12'>
						{/* パンくずリストをコンポーネントとして使用 */}
						<DynamicBreadcrumb items={breadcrumbItems} />

						<article className='bg-white dark:bg-gray-800  shadow-lg p-6 sm:p-8 space-y-8'>
							<h1 className='text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 text-center'>
								<Link href={item.affiliate_url} className='text-blue-500 font-bold hover:underline'>
									{item.title}
								</Link>
							</h1>
							<p className='text-gray-600 dark:text-gray-300 text-base mt-4'>{description}</p>{' '}
							<div className='relative aspect-w-16 aspect-h-9 overflow-hidden '>
								<UmamiTracking
									trackingData={{
										dataType: 'doujin-item',
										from: 'kobetu-img-top',
										item: { title: item.title, content_id: item.content_id },
									}}>
									<Link href={item.affiliate_url} target='_blank' rel='noopener noreferrer'>
										<img
											src={item.package_images?.large || ''}
											alt={`${item.title}のパッケージ画像`}
											decoding='async'
											loading='lazy'
											fetchPriority='high'
											className='w-full h-full object-contain transition-transform duration-300'
										/>
									</Link>
								</UmamiTracking>
							</div>
							<FanzaADBannerKobetu />
							{/* Description added here */}
							{/* Item Details Table */}
							<ItemDetailsTable item={item} />
							<ButtonTestDoujinComponent item={item} />
							{/* サンプル画像の表示 */}
							{item.sample_images && item.sample_images.length > 0 && (
								<Suspense fallback={<LoadingSpinner />}>
									<DynamicSmapleImageGallery
										title={item.title}
										contentId={item.content_id}
										sampleImageURLs={item.sample_images}
									/>
								</Suspense>
							)}
							{item.series && item.series.length > 0 && (
								<Suspense fallback={<LoadingSpinner />}>
									<DynamicSeriesTimeline
										searchParams={{
											series_id: item.series[0].id.toString(),
											series_name: item.series[0].name,
										}}
									/>
								</Suspense>
							)}
							{item.makers && item.makers.length > 0 && (
								<Suspense fallback={<LoadingSpinner />}>
									<DynamicMakerTimeline
										searchParams={{
											maker_id: item.makers[0].id.toString(),
											maker_name: item.makers[0].name,
										}}
									/>
								</Suspense>
							)}
							<Iho />
							<div className='w-full text-sm text-center my-4'>
								このページに広告を設置しています
							</div>
							{/* コメントセクションの追加 */}
							<Suspense fallback={<LoadingSpinner />}>
								<DynamicCommentSection contentId={item.content_id} />
							</Suspense>
							{/* 外部リンクボタン（下） */}
							<div className='flex justify-center items-center mt-8'>
								<UmamiTracking
									trackingData={{
										dataType: 'doujin-item',
										from: 'kobetu-exlink-bottom',
										item: { title: item.title, content_id: item.content_id },
									}}>
									<Link
										href={item.affiliate_url}
										target='_blank'
										rel='noopener noreferrer'
										className='inline-flex items-center justify-center text-xl font-semibold text-white bg-gradient-to-r from-pink-500 to-rose-600 dark:from-pink-600 dark:to-rose-700 rounded-sm shadow-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 dark:focus:ring-pink-400 px-8 py-4'>
										<span className='mr-2 break-words'>{item.title}をフルで見る</span>
										<ExternalLink className='w-6 h-6 animate-pulse flex-shrink-0' />
									</Link>
								</UmamiTracking>
							</div>
						</article>
					</div>
				</div>
			</>
		)
	} catch (error) {
		console.error('Error fetching item data:', error)
		return notFound()
	}
}

// キャッシュの再検証時間を24時間に変更
export const revalidate = 86400
