import { DmmHomePage } from '../../../../../types/dmmtypes'

export default async function DMMTopPage() {
	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dmm-toppage`, { cache: 'no-store' })
		if (!response.ok) {
			throw new Error('APIレスポンスが正常ではありません')
		}
		const data: DmmHomePage[] = await response.json()

		return (
			<section className="max-w-7xl mx-auto px-4 py-8">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{data.map((info) => (
						<div key={info.id} className="bg-white shadow-md rounded-lg overflow-hidden">
							<img src={info.package_images.large} alt={info.title} className="w-full h-48 object-cover" />
							<div className="p-4">
								<h2 className="text-lg font-semibold mb-2 line-clamp-2">{info.title}</h2>
								<p className="text-sm text-gray-600 mb-2">
									公開日: {new Date(info.release_date).toLocaleDateString('ja-JP')}
								</p>
								<p className="text-sm text-gray-600">出演: {info.actresses}</p>
							</div>
						</div>
					))}
				</div>
			</section>
		)
	} catch (error) {
		console.error('[Server] Failed to fetch articles:', error)
		return <ErrorDisplay message="動画情報の取得に失敗しました。後でもう一度お試しください。" />
	}
}

function ErrorDisplay({ message }: { message: string }) {
	return (
		<div className="text-center text-red-600 py-8" role="alert">
			<p>{message}</p>
		</div>
	)
}
