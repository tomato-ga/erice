// /pages/item/[contentId]/page.tsx

import { Suspense } from 'react'
import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import ArticleLBasic from '@/app/components/Article/ArticleLinks'
import KeywordRelatedArticles from '@/app/components/Article/ArticleLoaded/KeywordRelated'
import Link from 'next/link'
import { ItemType } from '@/app/components/dmmcomponents/DMMItemContainer'
import { DMMItem, DMMItemProps } from '../../../../../types/dmmtypes' // DMMItem をインポート
import { DMMItemSchema } from '../../../../../types/dmmitemzodschema'

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
		// KVストアからのデータ取得を試みる
		const kvResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`)
		const kvData: DMMItemProps[] = await kvResponse.json()
		const itemFromKV = kvData.find((item) => item.content_id === contentId)

		if (itemFromKV) {
			// DMMItemSchemaを使用して検証
			const validatedItem = DMMItemSchema.parse(itemFromKV)
			return validatedItem
		}

		// KVストアでアイテムが見つからない場合、D1からデータを取得
		const d1Response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dmm-get-one-item?content_id=${contentId}`)
		const d1Data: DMMItem[] = await d1Response.json()

		if (d1Data.length > 0) {
			// DMMItemSchemaを使用して検証
			const validatedItem = DMMItemSchema.parse(d1Data[0])
			return validatedItem
		}

		// どちらのソースからもアイテムが見つからない場合
		console.log(`Item with content_id ${contentId} not found in KV store or D1.`)
		return null
	} catch (error) {
		if (error instanceof Error) {
			console.error(`Error fetching data for ${itemType} with content_id ${contentId}: ${error.message}`)
		} else {
			console.error(`Unknown error occurred while fetching data for ${itemType} with content_id ${contentId}`)
		}
		return null
	}
}

// itemType を使用しないデータフェッチ関数
async function fetchItemByContentId(contentId: string): Promise<DMMItem[] | null> {
	// DMMItem[] に変更
	try {
		const d1Response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dmm-get-one-item?content_id=${contentId}`)
		const d1Data: DMMItem[] = await d1Response.json() // DMMItem[] に変更
		return d1Data
	} catch (error) {
		console.error('Error fetching data:', error)
		return null
	}
}

export default async function DMMKobetuItemPage({
	params,
	searchParams
}: Props & { searchParams: { itemType?: ItemType } }) {
	console.log('Received params:', params) // contentId の値を確認
	console.log('itemType:', searchParams.itemType) // itemType の値を確認

	// itemType の有無でデータフェッチ関数を切り替える
	let Item: DMMItem | null = null
	if (searchParams.itemType) {
		const itemType = searchParams.itemType
		Item = await fetchData(itemType, params.contentId)
	} else {
		const items = await fetchItemByContentId(params.contentId)
		Item = items && items.length > 0 ? items[0] : null
	}

	console.log('Found Item:', Item)

	if (!params.contentId || !Item || Item.length === 0) {
		// Item.length === 0 を追加
		return (
			<div className="container mx-auto px-2 py-6">
				<h1 className="text-2xl font-bold text-red-600">
					{searchParams.itemType ? searchParams.itemType : '指定された'}のアイテムが見つかりませんでした
				</h1>{' '}
				{/* itemType に応じたエラーメッセージ */}
				<p>アイテムが存在しないか、取得中にエラーが発生しました。</p>
			</div>
		)
	}

	// Item が undefined でないことが確認できたので、安全に JSX を記述できます
	return (
		<div className="bg-white min-h-screen">
			<div className="container mx-auto px-2 py-6">
				<article className="flex flex-col space-y-4">
					<div className="relative">
						<Link href={Item.affiliateURL || '#'} target="_blank" rel="noopener">
							<img
								src={Item.imageURL?.toString() || '/default.jpg'}
								alt={Item.title}
								className="w-full h-auto rounded-lg"
							/>
						</Link>
					</div>

					{/* ... (省略) ... */}

					<h1 className="text-gray-600 font-semibold text-2xl sm:text-4xl">{Item.title}</h1>

					{/* ... (省略) ... */}

					<Link href={Item.affiliateURL || '#'} target="_blank" rel="noopener">
						<div className="text-lg p-5 text-slate-700 text-center font-semibold rounded-md bg-red-50">
							{Item.title}のページを見る
						</div>
					</Link>

					{/* sampleImageURL の表示 */}
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
