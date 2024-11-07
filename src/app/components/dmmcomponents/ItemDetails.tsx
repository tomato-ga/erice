// components/ItemDetails.tsx

import {
	generateRefinedProfileDescription,
	parseDetails,
	renderDetailValue,
} from '@/app/(pages)/actressprofile/[[...slug]]/profileAnalysis'
import { generatePersonStructuredData } from '@/app/components/json-ld/jsonld'
import { DMMActressProfile } from '@/types/APItypes'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import React from 'react'

import RelatedGenre from './RelatedGenre'
// import DMMSeriesStats from './Stats/DMMSeriesStats'
import {
	fetchActressProfile,
	fetchItemDetailByContentId,
	fetchSeriesStats,
} from './fetch/itemFetchers'

const DynamicActressStatsAndRelatedItemsTimeLine = dynamic(() => import('./DMMActressItemRelated'))
const DynamicDMMSeriesStats = dynamic(() => import('./Stats/DMMSeriesStats'))

interface ItemDetailsProps {
	contentId: string
	dbId: number
}

const parseActresses = (actressString: string | null | undefined): string[] => {
	if (!actressString) return []
	return actressString
		.split(',')
		.map(name => name.trim())
		.filter(name => name.length > 0)
}

const ActressProfile = ({ actressProfileData }: { actressProfileData: DMMActressProfile }) => {
	const { actress } = actressProfileData

	if (!actress) {
		return null
	}

	const isPlaceholderImage = (imageUrl: string | null | undefined) => {
		if (!imageUrl) return true
		return imageUrl.includes('printing.jpg')
	}

	if (isPlaceholderImage(actress.image_url_large)) {
		return null
	}

	const details = parseDetails(actress.details)
	const description = generateRefinedProfileDescription(actressProfileData)

	const renderProfileRow = (label: string, value: string | number | null, key?: string) => {
		if (value === null || value === '非公開' || value === '') return null
		return (
			<tr
				key={key}
				className='border-b border-gray-200 dark:border-gray-700 transition-colors duration-300 ease-in-out hover:bg-gray-50 dark:hover:bg-gray-800'>
				<td className='py-3 px-4 font-medium text-gray-700 dark:text-gray-300'>{label}</td>
				<td className='py-3 px-4 text-gray-600 dark:text-gray-400'>{value}</td>
			</tr>
		)
	}

	return (
		<div className='bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl mt-8'>
			<div className='p-8'>
				<h2 className='text-4xl font-extrabold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400'>
					<Link href={`/actressprofile/${encodeURIComponent(actress.name)}`}>
						この動画の出演者「{actress.name}」のプロフィール
					</Link>
				</h2>
				<div className='flex flex-col lg:flex-row lg:space-x-8'>
					<div className='lg:w-1/3 mb-6 lg:mb-0'>
						<Link href={`/actressprofile/${encodeURIComponent(actress.name)}`}>
							<img
								src={actress.image_url_large || ''}
								alt={actress.name}
								className='w-full object-contain aspect-[3/4] transition-transform'
								decoding='async'
								loading='lazy'
								fetchPriority='low'
							/>
						</Link>
					</div>
					<div className='lg:w-2/3'>
						<div className='overflow-x-auto'>
							<table className='w-full text-left text-sm sm:text-base'>
								<tbody>
									{renderProfileRow('生年月日', actress.birthday, 'birthday')}
									{renderProfileRow('血液型', actress.blood_type, 'blood_type')}
									{renderProfileRow('出身地', actress.prefectures, 'prefectures')}
									{renderProfileRow('趣味', actress.hobby, 'hobby')}
									{renderProfileRow(
										'スリーサイズ',
										actress.bust && actress.waist && actress.hip
											? `B${actress.bust} W${actress.waist} H${actress.hip}`
											: null,
										'three_sizes',
									)}
									{renderProfileRow(
										'身長',
										actress.height ? `${actress.height}cm` : null,
										'height',
									)}
									{renderProfileRow('カップ', actress.cup, 'cup')}
									{details &&
										Object.entries(details).map(([key, value], index) => {
											if (['full_name', 'current_name', 'aliases'].includes(key)) return null
											return renderProfileRow(key, renderDetailValue(value), `detail-${index}`)
										})}
								</tbody>
							</table>
						</div>
					</div>
				</div>
				<div className='mt-4 text-center'>
					<Link
						href={`/actressprofile/${encodeURIComponent(actress.name)}`}
						className='text-blue-500 hover:underline'>
						詳細プロフィールを見る
					</Link>
				</div>
			</div>
		</div>
	)
}

const ItemDetails = async ({ contentId, dbId }: ItemDetailsProps) => {
	const itemDetail = await fetchItemDetailByContentId(dbId)
	console.time('itemdetail timelog')

	if (!itemDetail) {
		return null
	}

	// カンマ区切りの女優名を配列に変換し、最初の1名だけを取得
	const actresses = parseActresses(itemDetail.actress).slice(0, 1)

	if (actresses.length === 0) {
		return null
	}

	// 1名の女優のプロフィールをフェッチ
	const actressName = actresses[0]
	console.log('actressName:', actressName)
	console.timeLog('itemdetail timelog')
	const actressProfiles = await fetchActressProfile(actressName)

	// 有効なプロフィールの抽出
	const actressProfileData = actressProfiles ? actressProfiles[0] : null

	// 重要なデータを持つか確認
	const hasEssentialData = (data: DMMActressProfile) => {
		const { actress } = data
		const { birthday, name } = actress
		return !!(birthday || name)
	}

	if (!actressProfileData || !hasEssentialData(actressProfileData)) {
		return null
	}

	// actress_id を取得
	const actressId = actressProfileData.actress.id

	// series_idを取得
	if (!itemDetail.series) {
		return null
	}

	const seriesStatsData = await fetchSeriesStats(itemDetail.series[0])
	// console.log('Resolved seriesStatsData:', JSON.stringify(seriesStatsData, null, 2))

	// プレースホルダー画像かどうかをチェックする関数
	const isPlaceholderImage = (imageUrl: string | null | undefined) => {
		if (!imageUrl) return true
		return imageUrl.includes('printing.jpg')
	}

	// 構造化データの生成
	// const personStructuredData = generatePersonStructuredData(actressProfileData)

	// JSON-LDを文字列に変換
	// const jsonLdString = JSON.stringify(personStructuredData)

	// ランダムなジャンルを選択する関数
	const getRandomGenre = (genres: string[]): string | null => {
		if (!genres || genres.length === 0) return null
		const randomIndex = Math.floor(Math.random() * genres.length)
		return genres[randomIndex]
	}

	// ジャンルが存在する場合、ランダムに1つ選択
	const randomGenre = itemDetail.genre ? getRandomGenre(itemDetail.genre) : null

	return (
		<>
			{itemDetail.actress && actressId && (
				<DynamicActressStatsAndRelatedItemsTimeLine
					actressName={actressName}
					actressId={actressId}
					profile={actressProfileData}
				/>
			)}

			{/* シリーズの統計データ表示 */}
			{seriesStatsData && (
				<DynamicDMMSeriesStats
					seriesStatsData={seriesStatsData}
					seriesName={itemDetail.series[0]}
					isSummary={false}
				/>
			)}

			{/* 女優のプロフィールを表示 */}
			{!isPlaceholderImage(actressProfileData.actress.image_url_large) && (
				<ActressProfile
					actressProfileData={actressProfileData}
					key={actressProfileData.actress.id}
				/>
			)}

			{/* 関連ジャンル（ランダムに選択） */}
			{/* {randomGenre && <RelatedGenre genreName={randomGenre} />} */}
		</>
	)
}

export default React.memo(ItemDetails)
