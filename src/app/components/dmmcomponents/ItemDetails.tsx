import { Suspense } from 'react'
import { DMMItemMainResponse, DMMItemDetailResponse } from '@/types/dmmitemzodschema'
import ActressRelatedItems from './DMMActressItemRelated'
import { CommentSection } from './Comment/CommentSection'
import ProductDetails from './DMMKobetuItemTable'
import { fetchActressProfile, fetchItemDetailByContentId } from './fetch/itemFetchers'
import LoadingSpinner from '../Article/ArticleContent/loadingspinner'
import ActressProfile from './DMMActressProfile'

interface ItemDetailsProps {
	ItemMain: DMMItemMainResponse
	contentId: string
}

export default async function ItemDetails({ ItemMain, contentId }: ItemDetailsProps) {
	const itemDetail = await fetchItemDetailByContentId(contentId)
	const actressProfileData = await fetchActressProfile(itemDetail?.actress || '')

	if (!itemDetail) {
		return <div>商品の詳細情報を取得できませんでした。</div>
	}

	if (!actressProfileData) {
		return <div>女優のプロフィールを取得できませんでした。</div>
	}

	return (
		<>
			<Suspense fallback={<LoadingSpinner />}>
				<CommentSection contentId={contentId} />
			</Suspense>

			<Suspense fallback={<LoadingSpinner />}>
				<ActressRelatedItems actressName={itemDetail.actress || ''} />
			</Suspense>

			<Suspense fallback={<LoadingSpinner />}>
				<ActressProfile actressProfileData={actressProfileData} />
			</Suspense>
		</>
	)
}
