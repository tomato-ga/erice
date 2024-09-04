import {
	generateRefinedProfileDescription,
	parseDetails,
	renderDetailValue,
} from '@/app/(pages)/actressprofile/[[...slug]]/profileAnalysis'
import { DMMActressProfile } from '@/types/APItypes'
import Link from 'next/link'
import { Suspense } from 'react'
import LoadingSpinner from '../Article/ArticleContent/loadingspinner'
import ActressRelatedItemsTimeLine from './DMMActressItemRelated'
import { fetchActressProfile, fetchItemDetailByContentId } from './fetch/itemFetchers'

interface ItemDetailsProps {
	contentId: string
	dbId: number
}

const ActressProfile = ({ actressProfileData }: { actressProfileData: DMMActressProfile }) => {
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
				<h2 className='text-4xl font-extrabold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400'>
					{actress.name}のプロフィール
				</h2>
				<div className='flex flex-col lg:flex-row lg:space-x-8'>
					<div className='lg:w-1/3 mb-6 lg:mb-0'>
						<img
							src={actress.image_url_large || '/placeholder-image.jpg'}
							alt={actress.name}
							className='w-full object-contain aspect-[3/4] transition-transform'
						/>
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
			</div>
		</div>
	)
}

export default async function ItemDetails({ contentId, dbId }: ItemDetailsProps) {
	const itemDetailPromise = fetchItemDetailByContentId(dbId)

	const actressProfileDataPromise = itemDetailPromise.then(detail =>
		detail ? fetchActressProfile(detail.actress || '') : null,
	)

	const [itemDetail, actressProfileData] = await Promise.all([
		itemDetailPromise,
		actressProfileDataPromise,
	])

	console.log('actressProfileData', actressProfileData)

	return (
		<>
			{itemDetail && (
				<Suspense fallback={<LoadingSpinner />}>
					<ActressRelatedItemsTimeLine actressName={itemDetail.actress || ''} />
				</Suspense>
			)}

			{/* {actressProfileData && (
				<Suspense fallback={<LoadingSpinner />}>
					<ActressProfile actressProfileData={actressProfileData} />
				</Suspense>
			)} */}
		</>
	)
}
