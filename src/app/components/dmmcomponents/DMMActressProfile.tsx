import { DMMActressProfile, DMMActressProfileSchema } from '@/types/APItypes'
import { formatDate } from '@/utils/dmmUtils'
import Link from 'next/link'
import { z } from 'zod'
import { fetchActressRelatedItem } from '../dmmcomponents/fetch/itemFetchers'

// nullまたは空文字列でない値をチェックする関数
const isNotNullOrEmpty = <T,>(value: T | null | undefined | string): value is T =>
	value != null && value !== ''

// 基本項目以外の情報が存在するかチェックする関数
const hasAdditionalInfo = (actress: DMMActressProfile['actress']) => {
	const basicFields = ['ruby', 'id', 'dmm_id', 'name']
	return Object.keys(actress).some(
		key => !basicFields.includes(key) && isNotNullOrEmpty(actress[key as keyof typeof actress]),
	)
}

const ActressProfile = ({ actressProfileData }: { actressProfileData: DMMActressProfile }) => {
	// actressProfileDataとactressProfileData.actressの存在をチェック
	if (!actressProfileData) {
		console.error('actressProfileData または actressProfileData.actress が undefined です')
		return null
	}

	console.log('actressProfileData', actressProfileData)

	const parseResult = DMMActressProfileSchema.safeParse(actressProfileData)

	if (!parseResult.success) {
		console.error(
			'ActressProfile, データの検証に失敗しました:',
			JSON.stringify(parseResult.error, null, 2),
		)
		return null
	}

	const ActressItems = parseResult.data

	// 基本項目以外の情報がない場合は、nullを返す
	if (!hasAdditionalInfo(ActressItems.actress)) {
		return null
	}

	return (
		<div className='bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl'>
			<h2 className='text-3xl font-bold text-center py-4 text-gray-800 dark:text-white'>
				<span className='bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500'>
					{ActressItems.actress.name}のプロフィール
				</span>
			</h2>
			<div className='flex flex-col md:flex-row'>
				<div className='md:w-1/3 p-4'>
					<img
						src={(ActressItems.actress.image_url_large ?? ActressItems.actress.image_url_small) || ''}
						alt={ActressItems.actress.name ?? '女優画像'}
						className='w-full rounded-lg shadow-md transition-transform duration-300 hover:scale-105'
					/>
				</div>
				<div className='md:w-2/3 p-4'>
					<table className='w-full text-left border-collapse'>
						<tbody>
							{Object.entries(ActressItems.actress).map(([key, value]) => {
								// キーを加工してラベルとして表示 (例: snake_case を CamelCase に変換)
								const label = key.replace(/_([a-z])/g, (_, char) => char.toUpperCase())

								return (
									isNotNullOrEmpty(value) && (
										<tr key={key} className='border-b border-gray-200 dark:border-gray-700'>
											<th className='py-2 pr-4 font-semibold text-gray-600 dark:text-gray-300'>{label}</th>
											<td className='py-2'>{value}</td>
										</tr>
									)
								)
							})}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}

export default ActressProfile
