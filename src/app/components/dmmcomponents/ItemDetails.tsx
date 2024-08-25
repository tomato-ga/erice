import { Suspense } from 'react'
import { DMMItemMainResponse, DMMItemDetailResponse } from '@/types/dmmitemzodschema'
import ActressRelatedItems from './DMMActressItemRelated'
import { CommentSection } from './Comment/CommentSection'
import ProductDetails from './DMMKobetuItemTable'
import { fetchActressProfile, fetchItemDetailByContentId } from './fetch/itemFetchers'
import LoadingSpinner from '../Article/ArticleContent/loadingspinner'
import ActressProfile from './DMMActressProfile'

interface ItemDetailsProps {
	// ItemMain: DMMItemMainResponse
	contentId: string
	dbId: number
}

export default async function ItemDetails({ contentId, dbId }: ItemDetailsProps) {
	const itemDetailPromise = fetchItemDetailByContentId(dbId)
	const actressProfileDataPromise = itemDetailPromise.then((detail) =>
		detail ? fetchActressProfile(detail.actress || '') : null
	)

	const [itemDetail, actressProfileData] = await Promise.all([itemDetailPromise, actressProfileDataPromise])

	return (
		<>


			{itemDetail && (
				<Suspense fallback={<LoadingSpinner />}>
					<ActressRelatedItems actressName={itemDetail.actress || ''} />
				</Suspense>
			)}

			{actressProfileData && (
				<Suspense fallback={<LoadingSpinner />}>
					<ActressProfile actressProfileData={actressProfileData} />
				</Suspense>
			)}
		</>
	)
}
