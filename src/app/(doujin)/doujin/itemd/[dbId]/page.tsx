import { FetchDoujinItem, FetchDoujinItemSchema } from '@/_types_doujin/doujintypes'
import { ZodError } from 'zod'

import { DoujinTopItem } from '@/_types_doujin/doujintypes'
import PriceDisplay from '@/app/components/doujincomponents/kobetu/PriceDisplay'
import ProductHeader from '@/app/components/doujincomponents/kobetu/ProductHeader'
import ProductMetadata from '@/app/components/doujincomponents/kobetu/ProductMetadata'
import ReviewInfo from '@/app/components/doujincomponents/kobetu/ReviewInfo'
import SampleImages from '@/app/components/doujincomponents/kobetu/SampleImage'
import { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'

function isValidFetchDoujinItem(data: unknown): data is FetchDoujinItem {
	return FetchDoujinItemSchema.safeParse(data).success
}

async function fetchItemData(dbId: string): Promise<DoujinTopItem> {
	// http://localhost:3000/api/doujin-item?db_id=2
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/doujin-item?db_id=${dbId}`, {
		next: { revalidate: 3600 },
	})

	if (!res.ok) {
		throw new Error(`Failed to fetch item data: ${res.status} ${res.statusText}`)
	}

	return res.json()
}

type Props = {
	params: { dbId: string }
	searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
	{ params, searchParams }: Props,
	parent: ResolvingMetadata,
): Promise<Metadata> {
	const dbId = params.dbId
	console.log(dbId)

	try {
		const item = await fetchItemData(params.dbId)
		// const previousImages = (await parent).openGraph?.images || []

		return {
			title: `${item.title} | エロコメスト`,
			description: `${item.title}の商品詳細ページです。`,
			openGraph: {
				title: `${item.title} | エロコメスト`,
				description: `${item.title}の商品詳細ページです。`,
				// images: item.package_images?.large ? [{ url: item.package_images.large }, ...previousImages] : previousImages
			},
		}
	} catch (error) {
		console.error('Error generating metadata:', error)
		return {
			title: 'エロコメスト - 商品詳細',
			description: '商品詳細ページです。',
		}
	}
}

export default async function ItemDetailPage({ params }: Props) {
	try {
		const rawItem = await fetchItemData(params.dbId)

		if (!isValidFetchDoujinItem(rawItem)) {
			throw new Error('Invalid item data structure')
		}

		const item: FetchDoujinItem = rawItem

		return (
			<div className='container mx-auto px-4 py-8'>
				<ProductHeader
					title={item.title}
					package_images={item.package_images ?? ''} // 型を適切に修正
					affiliate_url={item.affiliate_url}
					umamifrom='item-detail'
				/>
				{/* <div className="mt-8 bg-white shadow-lg rounded-lg p-6"></div> */}
			</div>
		)
	} catch (error) {
		console.error('Error fetching item data:', error)
		notFound()
	}
}

// <PriceDisplay prices={item.prices || {}} />
// 					<ReviewInfo review_count={item.review_count} review_average={item.review_average} />
// 					<ProductMetadata genres={item.genres} makers={item.makers} series={item.series} />
// 					<SampleImages sample_images={item.sample_images} />
