import Link from 'next/link'
import { ThreeSizeResponse, ThreeSizeResponseSchema } from '../../../../_types_dmm/statstype'

async function fetchThreeSizeActresses(threeSize: { bust: number; waist: number; hip: number }) {
	console.log('Fetching three size data with:', threeSize)

	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dmm-actress-threesize`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ threeSize }),
			cache: 'no-store',
		})

		if (!response.ok) {
			const errorText = await response.text()
			console.error('Error response:', errorText)
			throw new Error(`Failed to fetch three size data: ${response.status} ${errorText}`)
		}

		const rawData = await response.json()

		// レスポンスの型検証とキャスト
		const validatedData = ThreeSizeResponseSchema.parse(rawData)
		console.log('Validated response data:', validatedData)

		return validatedData
	} catch (error) {
		console.error('Fetch error:', error)
		throw error
	}
}

const ThreeSize = async ({
	threeSize,
}: {
	threeSize: { bust: number; waist: number; hip: number } | null
}) => {
	if (!threeSize) return null

	try {
		console.log('ThreeSize component called with:', threeSize)
		const similarActresses = await fetchThreeSizeActresses(threeSize)
		console.log('Similar actresses data:', similarActresses)

		return (
			<div className='mt-8 p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-xl'>
				<h2 className='text-3xl font-extrabold mb-6 text-center'>
					<span className='text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-green-500'>
						スリーサイズが似ている女優とレビュー最高評価作品
					</span>
				</h2>

				{similarActresses?.threeSizeData ? (
					<ul className='space-y-6'>
						{similarActresses.threeSizeData.map(actress => (
							<li
								key={actress.id}
								className='bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 '>
								<div className='p-6 flex flex-col md:flex-row items-start md:items-center gap-4'>
									<div className='flex-grow'>
										<h3 className='font-bold text-xl mb-2 text-gray-800 dark:text-gray-200'>
											<Link href={`/actressprofile/${actress.name}`} prefetch={true}>
												{actress.name}
											</Link>
										</h3>
										<p className='text-emerald-600 dark:text-emerald-400 font-semibold mb-1'>
											B{actress.bust} W{actress.waist} H{actress.hip}
										</p>

										{actress.top_3_popular_items.length > 0 && (
											<div>
												<p className='text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2'>
													レビュー最高評価の作品:
												</p>
												<ul className='space-y-1'>
													{actress.top_3_popular_items.map(item => (
														<li key={item.id.toString()} className='text-blue-500 hover:underline'>
															<Link href={`/item/${item.id}`} prefetch={true}>
																• {item.title}
															</Link>
														</li>
													))}
												</ul>
											</div>
										)}
									</div>
								</div>
							</li>
						))}
					</ul>
				) : (
					<p className='text-center text-gray-600 dark:text-gray-400'>
						類似のスリーサイズの女優が見つかりませんでした。
					</p>
				)}
			</div>
		)
	} catch (error) {
		console.error('ThreeSize component error:', error)
		return (
			<div className='mt-8 p-6 bg-red-50 dark:bg-red-900 rounded-xl shadow-xl'>
				<p className='text-red-600 dark:text-red-400 text-center font-semibold'>
					データの取得中にエラーが発生しました。
				</p>
			</div>
		)
	}
}

export default ThreeSize
