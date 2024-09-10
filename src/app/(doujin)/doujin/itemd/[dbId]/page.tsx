import { DoujinKobetuItem } from '@/_types_doujin/doujintypes'
import { UmamiTracking } from '@/app/components/dmmcomponents/UmamiTracking'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

async function fetchItemData(dbId: string): Promise<DoujinKobetuItem> {
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/doujin-item?db_id=${dbId}`, {
		next: { revalidate: 3600 }
	})

	if (!res.ok) {
		throw new Error(`Failed to fetch item data: ${res.status} ${res.statusText}`)
	}

	return res.json()
}

type Props = {
	params: { dbId: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	try {
		const item = await fetchItemData(params.dbId)
		return {
			title: `${item.title} | エロコメスト`,
			description: `${item.title}の商品詳細ページです。`,
			openGraph: {
				title: `${item.title} | エロコメスト`,
				description: `${item.title}の商品詳細ページです。`,
				images: [{ url: item.package_images }]
			}
		}
	} catch (error) {
		console.error('Error generating metadata:', error)
		return {
			title: 'エロコメスト - 商品詳細',
			description: '商品詳細ページです。'
		}
	}
}

export default async function DoujinKobetuItemPage({ params }: Props) {
	try {
		const item = await fetchItemData(params.dbId)

		return (
			<div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
				<div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
					<article className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 space-y-8">
						<div className="relative aspect-w-16 aspect-h-9 overflow-hidden rounded-lg">
							<UmamiTracking
								trackingData={{
									dataType: 'item',
									from: 'kobetu-img-top',
									item: { title: item.title, content_id: item.content_id }
								}}
							>
								<Link href={item.affiliate_url} target="_blank" rel="noopener noreferrer">
									<img
										src={item.package_images}
										alt={`${item.title}のパッケージ画像`}
										className="w-full h-full object-contain transition-transform duration-300"
									/>
								</Link>
							</UmamiTracking>
						</div>

						<h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 text-center">
							{item.title}
						</h1>

						<div className="flex justify-center">
							<UmamiTracking
								trackingData={{
									dataType: 'item',
									from: 'kobetu-exlink-top',
									item: { title: item.title, content_id: item.content_id }
								}}
							>
								<Link
									href={item.affiliate_url}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center justify-center text-xl font-semibold text-white bg-gradient-to-r from-pink-500 to-rose-600 dark:from-pink-600 dark:to-rose-700 rounded-full shadow-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 dark:focus:ring-pink-400 px-8 py-4"
								>
									<span className="mr-2">商品ページへ</span>
									<ExternalLink className="w-6 h-6 animate-pulse" />
								</Link>
							</UmamiTracking>
						</div>

						<div className="space-y-6">
							<div className="text-center">
								<span className="text-red-600 font-bold text-3xl">
									{typeof item.prices === 'string' ? `${item.prices}円` : 'N/A'}
								</span>
							</div>

							{/** {item.review_count != null && item.review_average != null && (
								<div className="flex items-center justify-center">
									<span className="text-gray-600">
										評価: {item.review_average?.toFixed(1) ?? 'N/A'} ({item.review_count?.toLocaleString() ?? '0'}{' '}
										レビュー)
									</span>
								</div>
							)} **/}

							<div className="space-y-8">
								{item.genres && item.genres.length > 0 && (
									<div>
										<h2 className="font-semibold text-xl mb-4 text-gray-800 dark:text-gray-200">ジャンル</h2>
										<div className="flex flex-wrap gap-3">
											{item.genres.map((genre, index) => (
												<span
													key={index}
													className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-blue-100 hover:shadow-md border border-blue-200"
												>
													<Link
														href={`/doujin/genre/${encodeURIComponent(genre)}`}
														className="text-base text-blue-600 dark:text-gray-100 break-words mr-2 hover:border-b-2 hover:border-blue-500"
														prefetch={true}
													>
														{genre}
													</Link>
												</span>
											))}
										</div>
									</div>
								)}

								{item.makers && item.makers.length > 0 && (
									<div>
										<h2 className="font-semibold text-xl mb-4 text-gray-800 dark:text-gray-200">メーカー</h2>
										<div className="flex flex-wrap gap-3">
											{item.makers.map((maker, index) => (
												<span
													key={index}
													className="bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-green-100 hover:shadow-md border border-green-200"
												>
													{maker}
												</span>
											))}
										</div>
									</div>
								)}

								{item.series && item.series.length > 0 && (
									<div>
										<h2 className="font-semibold text-xl mb-4 text-gray-800 dark:text-gray-200">シリーズ</h2>
										<div className="flex flex-wrap gap-3">
											{item.series.map((series, index) => (
												<span
													key={index}
													className="bg-purple-50 text-purple-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-purple-100 hover:shadow-md border border-purple-200"
												>
													{series}
												</span>
											))}
										</div>
									</div>
								)}
							</div>
						</div>

						<div className="mt-8">
							<UmamiTracking
								trackingData={{
									dataType: 'item',
									from: 'kobetu-exlink-bottom',
									item: { title: item.title, content_id: item.content_id }
								}}
							>
								<div className="flex justify-center">
									<Link
										href={item.affiliate_url}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center justify-center text-xl font-semibold text-white bg-gradient-to-r from-pink-500 to-rose-600 dark:from-pink-600 dark:to-rose-700 rounded-sm shadow-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 dark:focus:ring-pink-400 px-8 py-4"
									>
										<span className="mr-2 break-words">{item.title}の商品ページへ</span>
										<ExternalLink className="w-6 h-6 animate-pulse flex-shrink-0" />
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

export const revalidate = 86400
