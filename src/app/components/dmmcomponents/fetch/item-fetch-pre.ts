import { cache } from 'react'
import 'server-only'
import {
	fetchItemDetailByContentId,
	fetchItemMainByContentId,
	fetchItemMainByContentIdToActressInfo,
} from './itemFetchers'

// fetch関数をキャッシュしつつ定義
export const getItemData = cache(async (dbId: number) => {
	const [itemMain, itemDetail, actressInfo] = await Promise.all([
		fetchItemMainByContentId(dbId),
		fetchItemDetailByContentId(dbId),
		fetchItemMainByContentIdToActressInfo(dbId),
	])
	return { itemMain, itemDetail, actressInfo }
})

// preload関数で事前にデータフェッチを開始
export const preload = (dbId: number) => {
	void getItemData(dbId)
}
