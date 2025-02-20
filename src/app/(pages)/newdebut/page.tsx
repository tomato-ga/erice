import { UmamiTracking } from '@/app/components/dmmcomponents/UmamiTracking'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ProcessedDMMItem } from '@/types/APINewDebuttypes'
import { formatDate, formatMMDDDate } from '@/utils/dmmUtils'
import { Building, CalendarDays, Film, Tag, User } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'

async function fetchData(): Promise<ProcessedDMMItem[]> {
	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dmm-newdebut-getkv`, {
			cache: 'no-store'
		})
		if (!response.ok) {
			console.error(`API response not ok: ${response.status} ${response.statusText}`)
			return []
		}
		const data: ProcessedDMMItem[] = await response.json()

		// デバッグ用ログ
		console.log('NewActressesPage Received data:', data.length)

		// データ構造のチェックと処理
		if (Array.isArray(data) && data.every(isValidProcessedDMMItem)) {
			return data
		}
		console.error('Unexpected data structure:', data)
		return []
	} catch (error) {
		console.error('データの取得に失敗しました:', error)
		return []
	}
}

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: '新人セクシー女優のデビュー作品一覧',
		description: `AVデビューした新人セクシー女優、素人女性の作品を紹介しています。 これから注目の新人セクシー女優とデビュー作品がすぐに見つかるよう随時更新しています。${new Date().toLocaleDateString()}現在の注目デビュー作品を要チェック！`
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
					<UmamiTracking
						trackingData={{
							dataType: 'item',
							from: 'newdebutpage-item',
							otherData: {
								db_id: item.db_id,
								title: item.title,
								actress: item.actress,
								actressId: item.actress_id
							}
						}}
					>
						<Link href={`/item/${item.db_id}`} className="relative overflow-hidden" prefetch={true}>
							<img
								src={item.imageURL || ''}
								alt={`新人AV・セクシー女優${item.actress}のデビュー作品${item.title} / ${item.content_id}`}
								width={300}
								height={450}
								className="object-cover transition-transform duration-300"
							/>
						</Link>
					</UmamiTracking>
				</div>

				<div className="text-center">
					<Badge variant="outline" className="text-lg font-semibold py-1 px-3">
						発売日: {item.date ? formatMMDDDate(item.date) : '不明'}
					</Badge>
				</div>

				<Table>
					<TableBody>
						<TableRow>
							<TableHead className="w-1/3">
								<User className="inline-block mr-2" /> 女優
							</TableHead>
							<TableCell>{item.actress || '名前なし'}</TableCell>
						</TableRow>
						<TableRow>
							<TableHead>
								<CalendarDays className="inline-block mr-2" /> 作品
							</TableHead>
							<TableCell>
								<Link
									href={`/item/${item.db_id}`}
									className="text-indigo-600 hover:text-indigo-800 transition-colors duration-300"
									prefetch={true}
								>
									{item.title} / {item.content_id}
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
						prefetch={true}
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
		<div className="min-h-screen bg-gradient-to-br from-pink-50  to-rose-50 py-12 px-4 sm:px-6 lg:px-8">
			<main className="max-w-7xl mx-auto space-y-8">
				<h1 className="text-4xl font-extrabold text-center sm:text-5xl md:text-6xl">
					<span className="block bg-gradient-to-r from-pink-500  to-rose-500 text-transparent bg-clip-text">
						新人セクシー女優{itemsdata.length}人の
					</span>
					<span className="block bg-gradient-to-r from-pink-500  to-rose-500 text-transparent bg-clip-text pt-1">
						最新デビュー作品一覧
					</span>
				</h1>

				<p className="mt-3 text-xl text-gray-500 sm:mt-5 sm:text-2xl max-w-prose mx-auto text-center">
					AVデビューした新人セクシー女優、素人女性の作品を紹介しています。
					これから注目の新人セクシー女優とデビュー作品がすぐに見つかるよう随時更新しています。
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
