// import { antennaPostApiResponse } from '@/types/antennaschema'
// import { unstable_cache } from 'next/cache'
// import { revalidate } from '../../doujincomponents/DMMDoujinFeaturedItemContainer'

// export const r18antennaFetch = async (limit: number): Promise<antennaPostApiResponse> => {
// 	try {
// 		const response = await fetch(
// 			`${process.env.NEXT_PUBLIC_API_URL}/api/r18-latestpost?limit=${limit}`,
// 			{ next: { revalidate: 3600 } },
// 		)

// 		const postsdata: antennaPostApiResponse = await response.json()

// 		if (postsdata.status !== 'success') {
// 			throw new Error('APIからのレスポンスが不正です')
// 		}

// 		return postsdata
// 	} catch (error) {
// 		console.error('データの取得に失敗しました:', error)
// 		throw error
// 	}
// }
