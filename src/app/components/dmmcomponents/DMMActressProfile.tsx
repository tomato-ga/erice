import Link from 'next/link'
import { z } from 'zod'
import { fetchActressRelatedItem } from '../dmmcomponents/fetch/itemFetchers'
import { formatDate } from '@/utils/dmmUtils'
import { DMMActressProfile, DMMActressProfileSchema } from '@/types/APItypes'

// nullまたは空文字列でない値をチェックする関数
const isNotNullOrEmpty = <T,>(value: T | null | undefined | string): value is T => value != null && value !== ''

// 基本項目以外の情報が存在するかチェックする関数
const hasAdditionalInfo = (actress: DMMActressProfile['actress']) => {
	const basicFields = ['ruby', 'id', 'dmm_id', 'name']
	return Object.keys(actress).some(
		(key) => !basicFields.includes(key) && isNotNullOrEmpty(actress[key as keyof typeof actress])
	)
}

const ActressProfile = async ({ actressProfileData }: { actressProfileData: DMMActressProfile }) => {
	console.log('actressProfileData:', actressProfileData)

	if (!actressProfileData.actress.bust || !actressProfileData.actress.waist || !actressProfileData.actress.hip) {
		return null
	}

	const parseResult = DMMActressProfileSchema.safeParse(actressProfileData)

	if (!parseResult.success) {
		console.error('データの検証に失敗しました:', parseResult.error)
		return null
	}

	const ActressItems = parseResult.data

	// 基本項目以外の情報がない場合は、nullを返す
	if (!hasAdditionalInfo(ActressItems.actress)) {
		return null
	}

	return (
		<div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
			<h2 className="text-3xl font-bold text-center py-4 text-gray-800 dark:text-white">
				<span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
					{ActressItems.actress.name}のプロフィール
				</span>
			</h2>
			<div className="flex flex-col md:flex-row">
				<div className="md:w-1/3 p-4">
					<img
						src={(ActressItems.actress.image_url_large ?? ActressItems.actress.image_url_small) || ''}
						alt={ActressItems.actress.name ?? '女優画像'}
						className="w-full rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
					/>
				</div>
				<div className="md:w-2/3 p-4">
					<table className="w-full text-left border-collapse">
						<tbody>
							{isNotNullOrEmpty(ActressItems.actress.birthday) && (
								<tr className="border-b border-gray-200 dark:border-gray-700">
									<th className="py-2 pr-4 font-semibold text-gray-600 dark:text-gray-300">生年月日</th>
									<td className="py-2">{ActressItems.actress.birthday}</td>
								</tr>
							)}
							{(isNotNullOrEmpty(ActressItems.actress.bust) ||
								isNotNullOrEmpty(ActressItems.actress.waist) ||
								isNotNullOrEmpty(ActressItems.actress.hip)) && (
								<tr className="border-b border-gray-200 dark:border-gray-700">
									<th className="py-2 pr-4 font-semibold text-gray-600 dark:text-gray-300">サイズ</th>
									<td className="py-2">
										{isNotNullOrEmpty(ActressItems.actress.bust) && `B${ActressItems.actress.bust}`}
										{isNotNullOrEmpty(ActressItems.actress.waist) && ` W${ActressItems.actress.waist}`}
										{isNotNullOrEmpty(ActressItems.actress.hip) && ` H${ActressItems.actress.hip}`}
										{isNotNullOrEmpty(ActressItems.actress.cup) && ` (${ActressItems.actress.cup}カップ)`}
									</td>
								</tr>
							)}
							{isNotNullOrEmpty(ActressItems.actress.height) && (
								<tr className="border-b border-gray-200 dark:border-gray-700">
									<th className="py-2 pr-4 font-semibold text-gray-600 dark:text-gray-300">身長</th>
									<td className="py-2">{ActressItems.actress.height}cm</td>
								</tr>
							)}
							{isNotNullOrEmpty(ActressItems.actress.blood_type) && (
								<tr className="border-b border-gray-200 dark:border-gray-700">
									<th className="py-2 pr-4 font-semibold text-gray-600 dark:text-gray-300">血液型</th>
									<td className="py-2">{ActressItems.actress.blood_type}型</td>
								</tr>
							)}
							{isNotNullOrEmpty(ActressItems.actress.hobby) && (
								<tr className="border-b border-gray-200 dark:border-gray-700">
									<th className="py-2 pr-4 font-semibold text-gray-600 dark:text-gray-300">趣味</th>
									<td className="py-2">{ActressItems.actress.hobby}</td>
								</tr>
							)}
							{isNotNullOrEmpty(ActressItems.actress.prefectures) && (
								<tr className="border-b border-gray-200 dark:border-gray-700">
									<th className="py-2 pr-4 font-semibold text-gray-600 dark:text-gray-300">出身地</th>
									<td className="py-2">{ActressItems.actress.prefectures}</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}

export default ActressProfile
