import { Suspense } from 'react'
import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ItemType } from '@/app/components/dmmcomponents/DMMItemContainer'
import { DMMItem, DMMItemSchema } from '../../../../../types/dmmitemzodschema'

const PopularArticle = dynamic(() => import('@/app/components/Article/PopularArticle'))

interface Props {
	params: { contentId: string }
}

// itemType を使用したデータフェッチ関数
async function fetchData(itemType: ItemType, contentId: string): Promise<DMMItem | null> {
	let endpoint = ''
	switch (itemType) {
		case 'todaynew':
			endpoint = '/api/dmm-todaynew-getkv'
			break
		case 'debut':
			endpoint = '/api/dmm-debut-getkv'
			break
		case 'feature':
			endpoint = '/api/dmm-feature-getkv'
			break
		case 'sale':
			endpoint = '/api/dmm-sale-getkv'
			break
		default:
			throw new Error(`Invalid itemType: ${itemType}`)
	}

	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`)
		const data: DMMItem[] = await response.json()
		const item = data.find((item) => item.content_id === contentId)

		if (item) {
			return DMMItemSchema.parse(item)
		}

		return null
	} catch (error) {
		console.error(`Error fetching data for ${itemType} with content_id ${contentId}:`, error)
		return null
	}
}

// itemType を使用しないデータフェッチ関数
async function fetchItemByContentId(contentId: string): Promise<DMMItem | null> {
	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dmm-get-one-item?content_id=${contentId}`)
		const data: unknown = await response.json()

		console.log('Raw API response:', data) // APIレスポンスの詳細をログ出力

		if (Array.isArray(data) && data.length > 0) {
			const parseResult = DMMItemSchema.safeParse(data[0])
			if (parseResult.success) {
				return parseResult.data
			} else {
				console.error('Validation error:', parseResult.error)
				// バリデーションエラーが発生した場合、部分的なデータを返す
				return {
					content_id: data[0].content_id,
					title: data[0].title,
					affiliateURL: data[0].affiliateURL,
					imageURL: data[0].imageURL,
					...data[0]
				} as DMMItem
			}
		}

		console.error('No data returned from API')
		return null
	} catch (error) {
		console.error('Error fetching data:', error)
		return null
	}
}

export default async function DMMKobetuItemPage({
	params,
	searchParams
}: Props & { searchParams: { itemType?: ItemType } }) {
	console.log('Received params:', params)
	console.log('itemType:', searchParams.itemType)

	let Item: DMMItem | null = null
	try {
		if (searchParams.itemType) {
			Item = await fetchData(searchParams.itemType, params.contentId)
		} else {
			Item = await fetchItemByContentId(params.contentId)
		}
	} catch (error) {
		console.error('Error fetching item:', error)
	}

	console.log('Found Item:', Item)

	if (!params.contentId || !Item) {
		return (
			<div className="container mx-auto px-2 py-6">
				<h1 className="text-2xl font-bold text-red-600">
					{searchParams.itemType ? searchParams.itemType : '指定された'}のアイテムが見つかりませんでした
				</h1>
				<p>アイテムが存在しないか、取得中にエラーが発生しました。</p>
			</div>
		)
	}

	// TODO クライアントコンポーネントに対応させる予定
	return (
		<div className="bg-white min-h-screen">
			<div className="container mx-auto px-2 py-6">
				<article className="flex flex-col space-y-4">
					<div className="relative">
						<Link href={Item.affiliateURL || '#'} target="_blank" rel="noopener">
							<img src={Item.imageURL || '/default.jpg'} alt={Item.title} className="w-full h-auto rounded-lg" />
						</Link>
					</div>

					<h1 className="text-gray-600 font-semibold text-2xl sm:text-4xl">{Item.title}</h1>

					<Link href={Item.affiliateURL || '#'} target="_blank" rel="noopener">
						<div className="text-lg p-5 text-slate-700 text-center font-semibold rounded-md bg-red-50">
							{Item.title}の高画質動画を見る
						</div>
					</Link>

					{Item.sampleImageURL && (
						<div className="grid grid-cols-2 gap-4">
							{Item.sampleImageURL.map((imageUrl, index) => (
								<img
									key={index}
									src={imageUrl}
									alt={`Sample Image ${index + 1}`}
									className="w-full h-auto rounded-lg"
								/>
							))}
						</div>
					)}
				</article>
			</div>
		</div>
	)
}
