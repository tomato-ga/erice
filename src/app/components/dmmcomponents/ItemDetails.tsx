// components/ItemDetails.tsx

import {
	generateRefinedProfileDescription,
	parseDetails,
	renderDetailValue
} from '@/app/(pages)/actressprofile/[[...slug]]/profileAnalysis'
import { generatePersonStructuredData } from '@/app/components/json-ld/jsonld'
import { DMMActressProfile } from '@/types/APItypes'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import React from 'react'

import RelatedGenre from './RelatedGenre'
import { fetchActressProfile, fetchItemDetailByContentId, fetchSeriesStats } from './fetch/itemFetchers'

const DynamicActressStatsAndRelatedItemsTimeLine = dynamic(() => import('./DMMActressItemRelated'))
const DynamicDMMSeriesStats = dynamic(() => import('./Stats/DMMSeriesStats'))
const DynamicThreeSize = dynamic(() => import('./Stats/DMMThreeSize'))

interface ItemDetailsProps {
	contentId: string
	dbId: number
}

const parseActresses = (actressString: string | null | undefined): string[] => {
	if (!actressString) return []
	return actressString
		.split(',')
		.map((name) => name.trim())
		.filter((name) => name.length > 0)
}

const isPlaceholderImage = (imageUrl: string | null | undefined) => {
	if (!imageUrl) return true
	return imageUrl.includes('printing.jpg')
}

const ActressProfile = ({ actressProfileData }: { actressProfileData: DMMActressProfile }) => {
	const { actress } = actressProfileData

	if (!actress) {
		return null
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
				className="border-b border-gray-200 dark:border-gray-700 transition-colors duration-300 ease-in-out hover:bg-gray-50 dark:hover:bg-gray-800"
			>
				<td className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300">{label}</td>
				<td className="py-3 px-4 text-gray-600 dark:text-gray-400">{value}</td>
			</tr>
		)
	}

	return (
		<div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl mt-8">
			<div className="p-8">
				<h2 className="text-4xl font-extrabold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
					<Link href={`/actressprofile/${encodeURIComponent(actress.name)}`}>
						この動画の出演者「{actress.name}」のプロフィール
					</Link>
				</h2>
				<p className="text-gray-700 dark:text-gray-300 mb-6 text-center">
					{actress.name}
					さんは数多くのAV作品に出演している人気セクシー女優です。以下に基本情報やスリーサイズ、趣味などの詳細なプロフィールをまとめました。
					詳しくは、プロフィールページでさらに多くの出演作品やレビュー統計データを見ることができます。
				</p>
				<div className="flex flex-col lg:flex-row lg:space-x-8">
					<div className="lg:w-1/3 mb-6 lg:mb-0">
						<Link href={`/actressprofile/${encodeURIComponent(actress.name)}`}>
							<img
								src={actress.image_url_large || ''}
								alt={`女優 ${actress.name}のプロフィール画像`}
								className="w-full object-contain aspect-[3/4] transition-transform"
								decoding="async"
								loading="lazy"
								fetchPriority="low"
							/>
						</Link>
					</div>
					<div className="lg:w-2/3">
						<div className="overflow-x-auto">
							<table className="w-full text-left text-sm sm:text-base">
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
										'three_sizes'
									)}
									{renderProfileRow('身長', actress.height ? `${actress.height}cm` : null, 'height')}
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
				<div className="mt-4 text-center">
					<Link href={`/actressprofile/${encodeURIComponent(actress.name)}`} className="text-blue-500 hover:underline">
						{actress.name}さんの詳細プロフィール・出演作品一覧を見る
					</Link>
				</div>
			</div>
		</div>
	)
}

const ItemDetails = async ({ contentId, dbId }: ItemDetailsProps) => {
	// アイテム詳細情報を取得
	const itemDetail = await fetchItemDetailByContentId(dbId)
	if (!itemDetail || !itemDetail.actress || !itemDetail.series) {
		return null
	}

	// 女優名を取得（最初の1名のみ）
	const actresses = parseActresses(itemDetail.actress).slice(0, 1)
	if (actresses.length === 0) {
		return null
	}
	const actressName = actresses[0]

	// 並列で女優プロフィールとシリーズ統計データを取得
	const [actressProfiles, seriesStatsData] = await Promise.all([
		fetchActressProfile(actressName),
		fetchSeriesStats(itemDetail.series[0])
	])

	const actressProfileData = actressProfiles ? actressProfiles[0] : null
	const hasEssentialData = (data: DMMActressProfile) => {
		const { actress } = data
		const { birthday, name } = actress
		return !!(birthday || name)
	}

	if (!actressProfileData || !hasEssentialData(actressProfileData)) {
		return null
	}

	const threeSize = (actressProfileData: DMMActressProfile): { bust: number; waist: number; hip: number } | null => {
		if (
			actressProfileData.actress.bust !== null &&
			actressProfileData.actress.waist !== null &&
			actressProfileData.actress.hip !== null
		) {
			const { bust, waist, hip } = actressProfileData.actress
			return { bust, waist, hip }
		}
		return null
	}

	const threeSizeData = threeSize(actressProfileData)
	const actressId = actressProfileData.actress.id

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
			<h2 className="text-2xl font-semibold mt-12 mb-6">関連データと女優・シリーズ情報</h2>
			<p className="mb-4 text-gray-700 dark:text-gray-300">
				このエロ動画作品に関連する女優やシリーズに関する詳細な統計データ、発売日タイムライン、女優さんのプロフィールをご覧いただけます。
			</p>

			{/* 女優のレビュー統計データ、発売日タイムライン */}
			{itemDetail.actress && actressId && (
				<>
					<h3 className="text-xl font-semibold mt-8 mb-4">{actressName}さんの評価傾向と関連作品</h3>
					<p className="mb-4 text-gray-700 dark:text-gray-300">
						「{actressName}」さんのレビュー統計データや出演作品の発売日タイムラインを表示します。
						<br />
						<Link href={`/actressprofile/${encodeURIComponent(actressName)}`} className="text-blue-500 hover:underline">
							{actressName}さんの全プロフィールや出演作品一覧を見る
						</Link>
					</p>
					<DynamicActressStatsAndRelatedItemsTimeLine
						actressName={actressName}
						actressId={actressId}
						profile={actressProfileData}
					/>
				</>
			)}

			{/* シリーズ統計データ */}
			{seriesStatsData && (
				<>
					<h3 className="text-xl font-semibold mt-8 mb-4">「{itemDetail.series[0]}」シリーズの統計データ</h3>
					<p className="mb-4 text-gray-700 dark:text-gray-300">
						「{itemDetail.series[0]}
						」シリーズの評価傾向や人気作品、レビュー平均点の推移など詳しい統計情報です。シーズンごとの傾向や、特に人気の高い作品などをチェックできます。
					</p>
					<DynamicDMMSeriesStats
						seriesStatsData={seriesStatsData}
						seriesName={itemDetail.series[0]}
						isSummary={false}
					/>
				</>
			)}

			{/* 女優プロフィール */}
			{!isPlaceholderImage(actressProfileData.actress.image_url_large) && (
				<>
					<h3 className="text-xl font-semibold mt-8 mb-4">出演女優「{actressName}」の詳細情報</h3>
					<p className="mb-4 text-gray-700 dark:text-gray-300">
						{actressName}
						さんの基本プロフィールや身体的特徴、趣味などをご紹介します。より深くセクシー女優の魅力をお届けします。
					</p>
					<ActressProfile actressProfileData={actressProfileData} key={actressProfileData.actress.id} />
				</>
			)}

			{/* スリーサイズ分析 */}
			{threeSizeData && (
				<>
					<h3 className="text-xl font-semibold mt-8 mb-4">女優のスリーサイズ分析</h3>
					<p className="mb-4 text-gray-700 dark:text-gray-300">
						{actressName}
						さんのスリーサイズデータから、似ている体型の女優さんをご紹介します。
					</p>
					<DynamicThreeSize threeSize={threeSizeData} actressId={actressId} />
				</>
			)}

			{/* 関連ジャンル表示（無効化中）
		{randomGenre && (
		  <>
			<h3 className='text-xl font-semibold mt-8 mb-4'>関連ジャンルの作品をチェック</h3>
			<p className='mb-4 text-gray-700 dark:text-gray-300'>
			  この作品と関連するジャンル「{randomGenre}」の他のAV作品もぜひご覧ください。
			</p>
			<RelatedGenre genreName={randomGenre} />
		  </>
		)} */}
		</>
	)
}

export default React.memo(ItemDetails)
