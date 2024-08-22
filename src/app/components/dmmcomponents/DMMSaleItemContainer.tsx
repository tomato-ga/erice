// components/DMMItemContainer.tsx
import Link from 'next/link'
import { DMMItemProps } from '@/types/dmmtypes'
import { ArrowRight } from 'lucide-react'
import DMMFeaturesItemList from './DMMTopFeaturesItemList'

// ジェネリックな型パラメータTを追加
interface DMMItemContainerProps<T extends DMMItemProps> {
	from: string
	bgGradient?: string
	endpoint: string // APIエンドポイント
	title: string // タイトル
	linkText: string // リンクテキスト
	linkHref: '/sale' | '/todaynew' | '/debut' | '/feature' // リンク先 /sale /todaynew /debut
	textGradient: string
}

// ジェネリックな型パラメータTを追加
async function fetchData<T extends DMMItemProps>(endpoint: string): Promise<T[]> {
	const fetchOptions = { next: { revalidate: 43200 } }

	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, fetchOptions)

		if (!response.ok) {
			return []
		}

		const data: T[] = await response.json()
		if (!Array.isArray(data)) {
			return []
		}

		return data
	} catch (error) {
		console.error('データの取得に失敗しました:', error)
		return []
	}
}

// ジェネリックな型パラメータTを追加
export default async function DMMTopItemContainer<T extends DMMItemProps>({
	from,
	bgGradient,
	endpoint,
	title,
	linkText,
	linkHref,
	textGradient
}: DMMItemContainerProps<T>) {
	const items = await fetchData<T>(endpoint)

	return (
		<div className={`bg-gradient-to-r ${bgGradient} shadow-lg p-4 sm:p-4 md:p-8 transition duration-300 ease-in-out`}>
			<div className="text-center mb-8">
				<h2 className="text-4xl font-extrabold mb-4">
					<span className={`text-transparent bg-clip-text bg-gradient-to-r ${textGradient}`}>{title}</span>
				</h2>
				<Link
					href={linkHref}
					className={`inline-flex items-center px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r ${textGradient} shadow-lg transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50`}
				>
					{linkText}
					<ArrowRight className="ml-2 h-5 w-5 animate-bounce" />
				</Link>
			</div>
			<DMMFeaturesItemList items={items} from={from} />
		</div>
	)
}

// 12時間キャッシュ
export const revalidate = 43200
