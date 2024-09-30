import {
	generateRefinedProfileDescription,
	parseDetails,
	renderDetailValue,
} from '@/app/(pages)/actressprofile/[[...slug]]/profileAnalysis'
import { generateWebPageStructuredData } from '@/app/components/json-ld/jsonld'
import { DMMActressProfile, DMMActressRelatedItem } from '@/types/APItypes'
import Link from 'next/link'
// components/ItemDetails.tsx
import React from 'react'
import { Suspense } from 'react'
import LoadingSpinner from '../Article/ArticleContent/loadingspinner'
import ActressRelatedItemsTimeLine from './DMMActressItemRelated'
import {
	fetchActressProfile,
	fetchActressRelatedItem,
	fetchItemDetailByContentId,
} from './fetch/itemFetchers'

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
	if (!actressProfileData || !actressProfileData.actress) {
		return null
	}

	const { actress } = actressProfileData
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
				{/* 女優名をリンクにする */}
				<h2 className='text-4xl font-extrabold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400'>
					<Link href={`/actressprofile/${encodeURIComponent(actress.name)}`}>
						この動画の出演者「{actress.name}」のプロフィール
					</Link>
				</h2>
				<div className='flex flex-col lg:flex-row lg:space-x-8'>
					{/* 画像をリンクにする */}
					<div className='lg:w-1/3 mb-6 lg:mb-0'>
						<Link href={`/actressprofile/${encodeURIComponent(actress.name)}`}>
							<img
								src={actress.image_url_large || '/placeholder-image.jpg'}
								alt={actress.name}
								className='w-full object-contain aspect-[3/4] transition-transform'
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
				{/* プロフィールページへ遷移する文言を追加 */}
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

	if (!itemDetail) {
		return (
			<div className='text-center p-4 bg-red-100 border border-red-400 text-red-700 rounded'>
				<p>アイテムの詳細情報を取得できませんでした。</p>
				<p>後ほど再度お試しください。</p>
			</div>
		)
	}

	// 女優名を解析（単一またはカンマ区切り）
	const actresses = parseActresses(itemDetail.actress)

	if (actresses.length === 0) {
		return null
	}

	// 各女優のプロフィールと関連作品をフェッチ
	const actressDataPromises = actresses.map(async (actressName: string) => {
		const profile = await fetchActressProfile(actressName)
		const relatedItems = profile ? await fetchActressRelatedItem(actressName) : []
		return { profile, relatedItems }
	})
	const actressData = await Promise.all(actressDataPromises)

	// フィルタリング: null を除去
	const validActressData = actressData.filter(
		(data): data is { profile: DMMActressProfile; relatedItems: DMMActressRelatedItem[] } =>
			data.profile !== null &&
			data.profile.actress !== undefined &&
			Array.isArray(data.relatedItems),
	)

	// 重要なデータを持つプロファイルのみ
	const hasEssentialData = (data: {
		profile: DMMActressProfile
		relatedItems: DMMActressRelatedItem[]
	}) => {
		const { birthday, blood_type, hobby, prefectures, name } = data.profile.actress
		return birthday || blood_type || hobby || prefectures || (name && name.trim() !== '')
	}

	const essentialActressData = validActressData.filter(hasEssentialData)

	// プレースホルダー画像かどうかをチェックする関数
	const isPlaceholderImage = (imageUrl: string | null | undefined) => {
		if (!imageUrl) return true
		return imageUrl.includes('printing.jpg')
	}

	if (essentialActressData.length === 0) {
		return (
			<div className='text-center p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded'>
				<p>表示するプロフィールがありません。</p>
			</div>
		)
	}

	return (
		<>
			{essentialActressData.map((data, index) => {
				const structuredData = generateWebPageStructuredData(data.profile, data.relatedItems)
				const jsonLdString = JSON.stringify(structuredData)
				return (
					<React.Fragment key={data.profile.actress.name}>
						{/* JSON-LDを構造化データとして埋め込む */}
						<script
							id={`structured-data-${data.profile.actress.name}`}
							type='application/ld+json'
							dangerouslySetInnerHTML={{ __html: jsonLdString }}
						/>
						{/* 関連作品のタイムラインを表示 */}
						<Suspense fallback={<LoadingSpinner />}>
							<ActressRelatedItemsTimeLine
								actressName={data.profile.actress.name}
								relatedItems={data.relatedItems}
							/>
						</Suspense>
						{/* 各女優のプロフィールを表示 */}
						{!isPlaceholderImage(data.profile.actress.image_url_large) && (
							<Suspense key={data.profile.actress.name} fallback={<LoadingSpinner />}>
								<ActressProfile actressProfileData={data.profile} />
							</Suspense>
						)}
					</React.Fragment>
				)
			})}
		</>
	)
}

export default ItemDetails
