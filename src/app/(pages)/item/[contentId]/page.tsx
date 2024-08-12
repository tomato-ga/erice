import { Suspense } from 'react'
import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ItemType } from '@/app/components/dmmcomponents/DMMItemContainer'
import {
	DMMDebutItem,
	DMMDebutItemSchema,
	DMMFeatureItem,
	DMMFeatureItemSchema,
	DMMItem,
	DMMItemSchema,
	DMMSaleItem,
	DMMSaleItemSchema,
	DMMTodayNewItem,
	DMMTodayNewItemSchema
} from '../../../../../types/dmmitemzodschema'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { z } from 'zod'
import ProductDetails from '@/app/components/dmmcomponents/DMMKobetuItemTable'

interface Props {
	params: { contentId: string }
}

// itemType を使用したデータフェッチ関数
async function fetchData(itemType: ItemType, contentId: string): Promise<DMMItem | null> {
	let endpoint = ''
	let parseFunction: (data: unknown) => DMMItem[]

	switch (itemType) {
		case 'todaynew':
			endpoint = '/api/dmm-todaynew-getkv'
			parseFunction = (data) => z.array(DMMTodayNewItemSchema).parse(data) as DMMTodayNewItem[]
			break
		case 'debut':
			endpoint = '/api/dmm-debut-getkv'
			parseFunction = (data) => z.array(DMMDebutItemSchema).parse(data) as DMMDebutItem[]
			break
		case 'feature':
			endpoint = '/api/dmm-feature-getkv'
			parseFunction = (data) => z.array(DMMFeatureItemSchema).parse(data) as DMMFeatureItem[]
			break
		case 'sale':
			endpoint = '/api/dmm-sale-getkv'
			parseFunction = (data) => z.array(DMMSaleItemSchema).parse(data) as DMMSaleItem[]
			break
		default:
			throw new Error(`Invalid itemType: ${itemType}`)
	}

	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`)
		const data: unknown = await response.json()

		// Zodバリデーションを実行
		const validatedData = parseFunction(data)
		const item = validatedData.find((item) => item.content_id === contentId)

		if (item) {
			return item
		}

		return null
	} catch (error) {
		if (error instanceof z.ZodError) {
			console.error(`Validation error for ${itemType} with content_id ${contentId}:`, error.errors)
		} else {
			console.error(`Error fetching data for ${itemType} with content_id ${contentId}:`, error)
		}
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
				console.error('Validation error:', parseResult.error.errors)
				return null
			}
		}

		console.error('No data returned from API or data is not an array')
		return null
	} catch (error) {
		if (error instanceof z.ZodError) {
			console.error('Zod validation error:', error.errors)
		} else if (error instanceof Error) {
			console.error('Error fetching data:', error.message)
		} else {
			console.error('Unknown error occurred while fetching data')
		}
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
					{searchParams.itemType ? searchParams.itemType : '指定された'}のアイテムが見つかりませんでし
				</h1>
				<p>アイテムが存在しないか、取得中にエラーが発生しました。</p>
			</div>
		)
	}

	return (
		<div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
			<div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8">
				<article className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 space-y-6 sm:space-y-8">
					<div className="relative overflow-hidden rounded-lg aspect-w-16 aspect-h-9">
						<Link href={Item.affiliateURL || '#'} target="_blank" rel="noopener noreferrer">
							<img
								src={Item.imageURL}
								alt={`${Item.title}のパッケージ画像`}
								className="w-full h-full object-cover transition-transform duration-300"
							/>
						</Link>
					</div>

					<h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 text-center">
						{Item.title}
					</h1>

					<div className="flex justify-center">
						<Link
							href={Item.affiliateURL || '#'}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center justify-center text-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 rounded-full shadow-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 px-6 sm:px-8 py-3 sm:py-4"
						>
							<span className="mr-2">高画質動画を見る</span>
							<ExternalLink className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
						</Link>
					</div>

					<ProductDetails Item={Item} />

					{Item.sampleImageURL && (
						<>
							<h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">サンプル画像</h2>
							<div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
								{Item.sampleImageURL.map((imageUrl, index) => (
									<div key={index} className="aspect-w-16 aspect-h-9 relative rounded-lg overflow-hidden">
										<img
											src={imageUrl}
											alt={`${Item.title}のサンプル画像${index + 1}`}
											className="w-full h-full object-cover transition-transform duration-300 "
										/>
									</div>
								))}
							</div>
							<div className="flex justify-center mt-6 sm:mt-8">
								<Link
									href={Item.affiliateURL || '#'}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center justify-center text-lg sm:text-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 rounded-sm shadow-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 px-6 sm:px-8 py-3 sm:py-4 min-h-[3.5rem] sm:min-h-[4rem] max-w-[90%] text-center"
								>
									<span className="mr-2 break-words">{Item.title}の高画質動画を見る</span>
									<ExternalLink className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse flex-shrink-0" />
								</Link>
							</div>
						</>
					)}
				</article>
			</div>
		</div>
	)
}
