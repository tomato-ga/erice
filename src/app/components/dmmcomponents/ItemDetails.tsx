// components/ItemDetails.tsx
import {
	generateRefinedProfileDescription,
	parseDetails,
	renderDetailValue,
} from '@/app/(pages)/actressprofile/[[...slug]]/profileAnalysis'
import { generatePersonStructuredData } from '@/app/components/json-ld/jsonld' // 先ほど作成した関数をインポート
import { DMMActressProfile } from '@/types/APItypes'
import Link from 'next/link'
import { Suspense } from 'react'
import LoadingSpinner from '../Article/ArticleContent/loadingspinner'
import ActressStatsAndRelatedItemsTimeLine from './DMMActressItemRelated'
import RelatedGenre from './RelatedGenre'
import { fetchActressProfile, fetchItemDetailByContentId } from './fetch/itemFetchers'

interface ItemDetailsProps {
	contentId: string
	dbId: number
}

const parseActresses = (actressString: string | null | undefined): string[] => {
	// actressString が空や null の場合は空の配列を返す
	if (!actressString) return []

	// カンマ区切りで分割し、前後の空白をトリムした配列を返す
	return actressString
		.split(',')
		.map(name => name.trim())
		.filter(name => name.length > 0) // 空の名前を除去
}

const ActressProfile = ({ actressProfileData }: { actressProfileData: DMMActressProfile }) => {
	const { actress } = actressProfileData

	if (!actress) {
		return null
	}

	// プレースホルダー画像かどうかをチェックする関数
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
		return null
	}

	// 女優名を解析（単一またはカンマ区切り）
	const actresses = parseActresses(itemDetail.actress)

	if (actresses.length === 0) {
		return null
	}

	console.log('actresses:', actresses)

	// 各女優のプロフィールをフェッチ
	// 女優プロフィールをフェッチ
	const actressProfileDataPromises = actresses.map((actressName: string) => {
		console.log('actressName:', actressName)
		return fetchActressProfile(actressName)
	})
	const actressProfilesData = await Promise.all(actressProfileDataPromises)

	// nullを除去し、配列を平坦化
	const validActressProfilesArrays = actressProfilesData.filter(
		(profileArray): profileArray is DMMActressProfile[] => profileArray !== null,
	)
	const validActressProfiles = validActressProfilesArrays.flat()

	// 重要なデータを持つプロファイルのみフィルタリング
	const hasEssentialData = (data: DMMActressProfile) => {
		const { actress } = data
		const { birthday, name } = actress
		return !!(birthday || name)
	}
	const essentialActressProfiles = validActressProfiles.filter(hasEssentialData)

	// プレースホルダー画像かどうかをチェックする関数
	const isPlaceholderImage = (imageUrl: string | null | undefined) => {
		if (!imageUrl) return true
		return imageUrl.includes('printing.jpg')
	}

	if (itemDetail.genre) {
		console.log('itemDetail:', itemDetail.genre[0])
	}

	// 構造化データの生成
	// const personStructuredData = generatePersonStructuredData(essentialActressProfiles[0])

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
			{/* JSON-LDを構造化データとして埋め込む */}
			{/* JSON-LD構造化データのコードはここに記述します */}
			{itemDetail.actress && (
				<Suspense fallback={<LoadingSpinner />}>
					{/* 女優ごとに関連アイテムのタイムラインを表示 */}
					{actresses.slice(0, 2).map((actressName: string, index: number) => (
						<ActressStatsAndRelatedItemsTimeLine key={index} actressName={actressName} />
					))}
				</Suspense>
			)}

			{/* 各女優のプロフィールを表示 */}
			<div className='grid grid-cols-1 gap-8 mt-8'>
				{essentialActressProfiles.map(
					(profile: DMMActressProfile) =>
						!isPlaceholderImage(profile.actress.image_url_large) && (
							<Suspense key={profile.actress.name} fallback={<LoadingSpinner />}>
								<ActressProfile actressProfileData={profile} />
							</Suspense>
						),
				)}
			</div>

			{/* 関連ジャンル（ランダムに選択） */}
			{randomGenre && <RelatedGenre genreName={randomGenre} />}
		</>
	)
}

export default ItemDetails
