import { ProcessedDMMItem } from '@/types/APINewDebuttypes'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { CalendarDays, User, Tag, Building, Film } from 'lucide-react'
import { formatDate } from '@/utils/dmmUtils'

async function fetchData(): Promise<ProcessedDMMItem[]> {
	const fetchOptions = { next: { revalidate: 43200 } }

	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dmm-newdebut-getkv`, fetchOptions)
		if (!response.ok) {
			console.error(`API response not ok: ${response.status} ${response.statusText}`)
			return []
		}
		const data: unknown = await response.json()

		// デバッグ用ログ
		console.log('NewActressesPage Received data:', JSON.stringify(data, null, 2))

		// データ構造のチェックと処理
		if (Array.isArray(data) && data.every(isValidProcessedDMMItem)) {
			return data
		} else {
			console.error('Unexpected data structure:', data)
			return []
		}
	} catch (error) {
		console.error('データの取得に失敗しました:', error)
		return []
	}
}

// 型ガード関数
function isValidProcessedDMMItem(item: unknown): item is ProcessedDMMItem {
	return (
		typeof item === 'object' &&
		item !== null &&
		'content_id' in item &&
		typeof item.content_id === 'string' &&
		'actress' in item &&
		(typeof item.actress === 'string' || item.actress === null) &&
		'genre' in item &&
		(Array.isArray(item.genre) || item.genre === null)
	)
}

function NewActressCard({ item }: { item: ProcessedDMMItem }) {
	return (
		<Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
			<CardHeader>
				<CardTitle className="text-2xl font-bold text-gray-900">{item.actress || '名前なし'}</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="flex justify-center">
					<Link href={`/item/${item.db_id}`} className="relative overflow-hidden">
						<Image
							src={item.imageURL || '/placeholder.jpg'}
							alt={item.title}
							width={300}
							height={450}
							className="object-cover transition-transform duration-300"
						/>
						<span className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 text-sm rounded">
							{item.content_id}
						</span>
					</Link>
				</div>

				<div className="text-center">
					<Badge variant="outline" className="text-lg font-semibold py-1 px-3">
						発売日: {item.date ? formatDate(item.date) : '不明'}
					</Badge>
				</div>

				<Table>
					<TableBody>
						<TableRow>
							<TableHead className="w-1/3">
								<User className="inline-block mr-2" /> 女優名
							</TableHead>
							<TableCell>{item.actress || '名前なし'}</TableCell>
						</TableRow>
						<TableRow>
							<TableHead>
								<CalendarDays className="inline-block mr-2" /> 作品名
							</TableHead>
							<TableCell>
								<Link
									href={`/item/${item.db_id}`}
									className="text-indigo-600 hover:text-indigo-800 transition-colors duration-300"
								>
									{item.title}
								</Link>
							</TableCell>
						</TableRow>
						{/* {item.genre && item.genre.length > 0 && (
							<TableRow>
								<TableHead>
									<Tag className="inline-block mr-2" /> ジャンル
								</TableHead>
								<TableCell>{item.genre.join(', ')}</TableCell>
							</TableRow>
						)}
						{item.maker && (
							<TableRow>
								<TableHead>
									<Building className="inline-block mr-2" /> メーカー
								</TableHead>
								<TableCell>{item.maker}</TableCell>
							</TableRow>
						)}
						{item.label && (
							<TableRow>
								<TableHead>
									<Film className="inline-block mr-2" /> レーベル
								</TableHead>
								<TableCell>{item.label}</TableCell>
							</TableRow>
						)} */}
					</TableBody>
				</Table>

				<div className="text-center">
					<Link
						href={`/item/${item.db_id}`}
						className="inline-block bg-indigo-600 text-white font-bold py-2 px-4 rounded-full hover:bg-indigo-700 transition-colors duration-300"
					>
						詳細を見る
					</Link>
				</div>
			</CardContent>
		</Card>
	)
}

export default async function NewActressesPage() {
	const itemsdata = await fetchData()

	return (
		<div className="min-h-screen bg-gradient-to-br from-pink-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
			<main className="max-w-7xl mx-auto space-y-8">
				<h1 className="text-4xl font-extrabold text-center text-gray-900 sm:text-5xl md:text-6xl">
					<span className="block">新人AV女優{itemsdata.length}人の</span>
					<span className="block text-indigo-600 pt-1">最新デビュー作品一覧</span>
				</h1>

				<p className="mt-3 text-xl text-gray-500 sm:mt-5 sm:text-2xl max-w-prose mx-auto text-center">
					AVデビューした新人女優、素人女性の作品を紹介しています。
					デビュー作品やこれから注目の新人AV女優・セクシー女優の作品がすぐに見つかるよう随時更新しています。
				</p>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{itemsdata.map((item) => (
						<NewActressCard key={item.content_id} item={item} />
					))}
				</div>
			</main>
		</div>
	)
}
