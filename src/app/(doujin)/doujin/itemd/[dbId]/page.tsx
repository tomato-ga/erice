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

// 型定義をそのまま使用
type Props = {
	params: { dbId: string }
}

// ItemDetailsTableコンポーネント
const ItemDetailsTable: React.FC<{ item: DoujinKobetuItem }> = ({ item }) => {
	return (
		<Table className='w-full mt-4 text-lg'>
			<TableBody>
				<TableRow>
					<TableCell className='font-semibold whitespace-nowrap'>タイトル</TableCell>
					<TableCell>
						<Link
							href={`/doujin/itemd/${item.affiliate_url}`}
							className='text-blue-500 font-bold text-xl hover:underline'>
							<h2>{item.title}</h2>
						</Link>
					</TableCell>
				</TableRow>
				{item.release_date && (
					<TableRow>
						<TableCell className='font-semibold whitespace-nowrap'>発売日</TableCell>
						<TableCell>
							<div className='text-xl'>{new Date(item.release_date).toLocaleDateString()}</div>
						</TableCell>
					</TableRow>
				)}
				{/* {item.prices && (
					<TableRow>
						<TableCell className='font-semibold whitespace-nowrap'>価格</TableCell>
						<TableCell>
							<div className='text-xl'>
								{typeof item.prices === 'string' ? `${item.prices}円` : 'N/A'}
							</div>
						</TableCell>
					</TableRow>
				)} */}
				{item.genres && item.genres.length > 0 && (
					<TableRow>
						<TableCell className='font-semibold whitespace-nowrap'>ジャンル</TableCell>
						<TableCell>
							<div className='flex flex-wrap space-x-2'>
								{item.genres.map((genre, index) => (
									<Link
										key={index}
										href={`/doujin/genre/${encodeURIComponent(genre.name)}`}
										className='bg-blue-50 text-blue-700 p-3 m-1 rounded text-sm font-semibold transition-all duration-300 hover:bg-blue-100 hover:shadow-md border border-blue-200'>
										{genre.name}
									</Link>
								))}
							</div>
						</TableCell>
					</TableRow>
				)}
				{item.makers && item.makers.length > 0 && (
					<TableRow>
						<TableCell className='font-semibold whitespace-nowrap'>メーカー</TableCell>
						<TableCell>
							<div className='flex flex-wrap space-x-2'>
								{item.makers.map((maker, index) => (
									<span
										key={index}
										className='bg-green-50 text-green-700 p-3 m-1 rounded text-sm font-semibold transition-all duration-300 hover:bg-green-100 hover:shadow-md border border-green-200'>
										{maker.name}
									</span>
								))}
							</div>
						</TableCell>
					</TableRow>
				)}
				{item.series && item.series.length > 0 && (
					<TableRow>
						<TableCell className='font-semibold whitespace-nowrap'>シリーズ</TableCell>
						<TableCell>
							<div className='flex flex-wrap space-x-2'>
								{item.series.map((series, index) => (
									<span
										key={index}
										className='bg-purple-50 text-purple-700 p-3 m-1 rounded text-sm font-semibold transition-all duration-300 hover:bg-purple-100 hover:shadow-md border border-purple-200'>
										{series.name}
									</span>
								))}
							</div>
						</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
	)
}

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
							<Link
								href={`/doujin/itemd/${item.affiliate_url}`}
								className='text-blue-500 font-bold hover:underline'>
								{item.title}
							</Link>
						</h1>

						{/* Item Details Table */}
						<ItemDetailsTable item={item} />

						{/* 外部リンクボタン */}
						<div className='flex justify-center items-center'>
							<div className='relative inline-block  items-center'>
								{/* グラデーションオーバーレイ */}
								<div className='absolute inset-2 rounded-full opacity-80 blur-lg group-hover:opacity-100 transition-opacity duration-500 ease-in-out bg-custom-gradient-exbutton bg-custom-gradient-exbutton--doujin z-0' />
								{/* ボタン */}
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
										className='relative inline-flex items-center justify-center text-xl font-semibold text-white rounded-full shadow-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 px-6 sm:px-8 py-3 sm:py-4 hover:bg-gray-700 transform hover:-translate-y-0.5 bg-custom-gradient-exbutton bg-custom-gradient-exbutton--doujin'>
										<span className='mr-2'>作品をフルで見る</span>
										<ExternalLink className='w-5 h-5 sm:w-6 sm:h-6 animate-pulse' />
									</Link>
								</UmamiTracking>
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

						<div className='w-full text-sm text-center my-4'>このページに広告を設置しています</div>

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
		)
	} catch (error) {
		console.error('Error fetching item data:', error)
		return notFound()
	}
}

// キャッシュの再検証時間を24時間に変更
export const revalidate = 86400
