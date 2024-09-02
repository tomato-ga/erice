// 女優のスタイルとタイプのデータの型を定義
interface ActressStyleAndType {
	id: number
	name: string
}

export default async function ActressStylesAndTypesPage({
	params,
}: {
	params: { slug: string[] }
}) {
	const stylesAndTypes = params.slug[0]

	// Cloudflare Workers の API ルートを呼び出す
	const data: ActressStyleAndType[] = await fetch(`/api/actressprofile/${stylesAndTypes}`).then(
		res => res.json(),
	)

	// 取得したデータを表示する
	return (
		<div>
			<h1>{stylesAndTypes}</h1>
			<ul>
				{data.map((item: ActressStyleAndType) => (
					<li key={item.id}>{item.name}</li>
				))}
			</ul>
		</div>
	)
}
