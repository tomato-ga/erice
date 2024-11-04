import { cache } from 'react'
import 'server-only'
import {
	fetchCampaignNames,
	fetchItemDetailByContentId,
	fetchItemMainByContentId,
	fetchItemMainByContentIdToActressInfo,
} from './itemFetchers'

// fetch関数をキャッシュしつつ定義
export const getItemData = cache(async (dbId: number) => {
	const [itemMain, itemDetail, actressInfo, campaignNames] = await Promise.all([
		fetchItemMainByContentId(dbId),
		fetchItemDetailByContentId(dbId),
		fetchItemMainByContentIdToActressInfo(dbId),
		fetchCampaignNames(),
	])
	return { itemMain, itemDetail, actressInfo, campaignNames }
})

// preload関数で事前にデータフェッチを開始
export const preload = (dbId: number) => {
	void getItemData(dbId)
}
