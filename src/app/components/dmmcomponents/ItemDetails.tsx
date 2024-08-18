import { Suspense } from 'react'
import { DMMItemMainResponse, DMMItemDetailResponse } from '@/types/dmmitemzodschema'
import ActressRelatedItems from './DMMActressItemRelated'
import { CommentSection } from './Comment/CommentSection'
import ProductDetails from './DMMKobetuItemTable'
import { fetchItemDetailByContentId } from './fetch/itemFetchers'
import LoadingSpinner from '../Article/ArticleContent/loadingspinner'

interface ItemDetailsProps {
	ItemMain: DMMItemMainResponse
	contentId: string
}

export default async function ItemDetails({ ItemMain, contentId }: ItemDetailsProps) {
	const itemDetail = await fetchItemDetailByContentId(contentId)

	if (!itemDetail) {
		return <div>商品の詳細情報を取得できませんでした。</div>
	}

	return (
		<>
			<Suspense fallback={<LoadingSpinner />}>
				<CommentSection contentId={contentId} />
			</Suspense>

			<Suspense fallback={<LoadingSpinner />}>
				<ProductDetails itemDetail={itemDetail} title={ItemMain.title} contentId={contentId} />
			</Suspense>

			<Suspense fallback={<LoadingSpinner />}>
				<ActressRelatedItems actressName={itemDetail.actress || ''} />
			</Suspense>
		</>
	)
}
