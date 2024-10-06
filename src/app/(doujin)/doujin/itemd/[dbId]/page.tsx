// /Volumes/SSD_1TB/erice2/erice/src/app/(doujin)/doujin/itemd/[dbId]/page.tsx

import { DoujinItemType, DoujinKobetuItem } from '@/_types_doujin/doujintypes'
import { CommentSection } from '@/app/components/dmmcomponents/Comment/CommentSection'

import { UmamiTracking } from '@/app/components/dmmcomponents/UmamiTracking'
import { formatPrice } from '@/utils/typeGuards'
import { ExternalLink } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table' // shadcnのテーブルコンポーネントをインポート

import '@/app/_css/styles.css'
import MakerTimelinePage from '@/app/components/doujincomponents/kobetu/MakerTimeline'
import SeriesTimelinePage from '@/app/components/doujincomponents/kobetu/SeriesTimeline'
import { generateDoujinKobetuItemStructuredData } from '@/app/components/json-ld/jsonld'
import { generateDoujinBreadcrumbList } from '@/app/components/json-ld/jsonld'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { formatDate } from '@/utils/dmmUtils'
import { HomeIcon } from 'lucide-react'

// BreadcrumbListの型をインポート
import { ListItem, BreadcrumbList as SchemaBreadcrumbList } from 'schema-dts'

// 型定義をそのまま使用
type Props = {
	params: { dbId: string }
}

import ButtonTestDoujinComponent from '@/app/components/dmmcomponents/ABtest/Doujin_GradientButton/ButtonTestCompo'
import FanzaADBannerKobetu from '@/app/components/doujincomponents/fanzaADBannerKobetu'
// ItemDetailsTableコンポーネント
import React from 'react'

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
			case 'シリーズ':
				return `/doujin/series/${encodeURIComponent(item.name)}`
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
		const title = `${item.title} | エロコメスト`
		const description = (() => {
			const parts = []
			parts.push(
				`${item.title} ${item.content_id}の詳細情報と、サンプル画像を見ることができるページです。`,
			)

			if (item.release_date) {
				parts.push(`発売日は${formatDate(item.release_date)}です。`)
			}

			if (item.makers && item.makers.length > 0) {
				parts.push(`${item.makers[0].name}から発売されています。`)
			}

			if (item.series && item.series.length > 0) {
				parts.push(`シリーズは「${item.series[0].name}」です。`)
			}

			if (item.genres && item.genres.length > 0) {
				const genreNames = item.genres.map(genre => genre.name).join('、')
				parts.push(`ジャンルは${genreNames}です。`)
			}

			return parts.join(' ')
		})()
		const url = `https://erice.cloud/doujin/itemd/${params.dbId}` // 実際のURLに置き換えてください
		const imageUrl = item.package_images ?? 'https://erice.cloud/ogp.jpg' // Fallback image URL

		return {
			title,
			description,
			openGraph: {
				title,
				description,
				type: 'article',
				url,
				images: [{ url: imageUrl }], // Use imageUrl here
			},
			twitter: {
				card: 'summary_large_image',
				title,
				description,
				images: [imageUrl], // Use imageUrl here
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

// BreadcrumbSeparatorコンポーネントを新たに定義
const BreadcrumbSeparator = () => <span className='mx-2'>/</span>

// メインのコンポーネント
export default async function DoujinKobetuItemPage({ params }: Props) {
	try {
		const item = await fetchItemData(params.dbId)

		const description = (() => {
			const parts = []
			parts.push(
				`${item.title} ${item.content_id}の詳細情報と、サンプル画像を見ることができるページです。`,
			)

			if (item.release_date) {
				parts.push(`この同人作品の発売日は${formatDate(item.release_date)}。`)
			}

			if (item.makers && item.makers.length > 0) {
				parts.push(`メーカーは${item.makers[0].name}から発売されています。`)
			}

			if (item.series && item.series.length > 0) {
				parts.push(`シリーズは${item.series[0].name}です。`)
			}

			return parts.join(' ')
		})()

		const jsonLdData = generateDoujinKobetuItemStructuredData(item, description)
		const jsonLdString = JSON.stringify(jsonLdData)

		// パンくずリストデータの生成
		const breadcrumbData = generateDoujinBreadcrumbList(item)

		// breadcrumbDataの型を明示的に指定し、itemListElementの型も指定
		const typedBreadcrumbData: SchemaBreadcrumbList & { itemListElement: ListItem[] } = {
			...breadcrumbData,
			itemListElement: breadcrumbData.itemListElement as ListItem[],
		}

		return (
			<>
				<script
					id={`structured-data-${item.content_id}`}
					type='application/ld+json'
					dangerouslySetInnerHTML={{
						__html: jsonLdString,
					}}
				/>
				<div className='bg-gray-50 dark:bg-gray-900 min-h-screen'>
					<div className='container mx-auto px-4 sm:px-6 py-8 sm:py-12'>
						{/* パンくずリストの表示 */}
						<Breadcrumb className='mb-4'>
							<BreadcrumbList>
								{typedBreadcrumbData.itemListElement.map((breadcrumbItem, index) => (
									<BreadcrumbItem key={index}>
										{index === 0 ? (
											<BreadcrumbLink href={breadcrumbItem.item as string}>
												<HomeIcon className='h-4 w-4' />
												<span className='sr-only'>{breadcrumbItem.name as string}</span>
											</BreadcrumbLink>
										) : index === typedBreadcrumbData.itemListElement.length - 1 ? (
											<BreadcrumbPage>{breadcrumbItem.name as string}</BreadcrumbPage>
										) : (
											<BreadcrumbLink href={breadcrumbItem.item as string}>
												{breadcrumbItem.name as string}
											</BreadcrumbLink>
										)}
										{index < typedBreadcrumbData.itemListElement.length - 1 && (
											<BreadcrumbSeparator />
										)}
									</BreadcrumbItem>
								))}
							</BreadcrumbList>
						</Breadcrumb>

						<article className='bg-white dark:bg-gray-800  shadow-lg p-6 sm:p-8 space-y-8'>
							<div className='relative aspect-w-16 aspect-h-9 overflow-hidden '>
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
								<Link href={item.affiliate_url} className='text-blue-500 font-bold hover:underline'>
									{item.title}
								</Link>
							</h1>
							<p className='text-gray-600 dark:text-gray-300 text-base mt-4'>{description}</p>{' '}
							<FanzaADBannerKobetu />
							{/* Description added here */}
							{/* Item Details Table */}
							<ItemDetailsTable item={item} />
							<ButtonTestDoujinComponent item={item} />
							{/* 外部リンクボタン */}
							{/* <div className='flex justify-center items-center'> */}
							{/* <div className='relative inline-block  items-center'> */}
							{/* グラデーションオーバーレイ */}
							{/* <div className='absolute inset-2 rounded-full opacity-80 blur-lg group-hover:opacity-100 transition-opacity duration-500 ease-in-out bg-custom-gradient-exbutton bg-custom-gradient-exbutton--doujin z-0' /> */}
							{/* ボタン */}
							{/* <UmamiTracking
										trackingData={{
											dataType: 'doujin-item',
											from: 'kobetu-exlink-top',
											item: { title: item.title, content_id: item.content_id },
										}}>
										<Link
											href={item.affiliate_url}
											target='_blank'
											rel='noopener noreferrer'
											className='relative inline-flex items-center justify-center text-xl font-semibold text-white rounded-full shadow-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 px-6 sm:px-8 py-3 sm:py-4 hover:bg-gray-700 transform hover:-translate-y-0.5 bg-custom-gradient-exbutton bg-custom-gradient-exbutton--doujin'>
											<span className='mr-2'>作品をフルで見る</span>
											<ExternalLink className='w-5 h-5 sm:w-6 sm:h-6 animate-pulse' />
										</Link>
									</UmamiTracking> */}
							{/* </div> */}
							{/* </div> */}
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
							{item.makers && item.makers.length > 0 && (
								<MakerTimelinePage
									searchParams={{
										maker_id: item.makers[0].id.toString(),
										maker_name: item.makers[0].name,
									}}
								/>
							)}
							{item.series && item.series.length > 0 && (
								<SeriesTimelinePage
									searchParams={{
										series_id: item.series[0].id.toString(),
										series_name: item.series[0].name,
									}}
								/>
							)}
							<div className='w-full text-sm text-center my-4'>
								このページに広告を設置しています
							</div>
							{/* コメントセクションの追加 */}
							<Suspense fallback={<LoadingSpinner />}>
								<CommentSection contentId={item.content_id} />
							</Suspense>
							{/* 外部リンクボタン（下部） */}
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
