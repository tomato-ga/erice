import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { formatAntennaDate } from '@/app/utils/postUtils'

import { antennaPost, antennaGetOnePostApiResponse } from '@/types/antennaschema'
import { PostList } from '@/app/components/antennacomponents/PostList'

interface Props {
	params: { dbId: string }
}

async function getAntennaPost(dbId: string): Promise<antennaPost | null> {
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/r18-get-one-item?db_id=${dbId}`)
	if (!res.ok) return null
	const data: antennaGetOnePostApiResponse = await res.json()

	console.log('getAntennaPost', data)

	return data.status === 'success' && data.data.length > 0 ? data.data[0] : null
}

export async function generateMetadata({ params }: Props) {
	const post = await getAntennaPost(params.dbId)
	if (!post) return { title: 'Post Not Found' }
	return { title: post.title }
}

export default async function AntennaKobetuPage({ params }: Props) {
	const post = await getAntennaPost(params.dbId)

	if (!post) notFound()

	const formattedDate = formatAntennaDate(post.published_at)

	return (
		<div className="max-w-2xl mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">{post.title}</h1>
			<div className="mb-4">
				{!!post.image_url && (
					<img src={post.image_url} alt={`${post.title}の画像`} className="rounded-lg object-cover top-0 left-0" />
				)}
			</div>
			<div className="mb-4">
				<p className="text-gray-600">{formattedDate}</p>
				{/* <p className="text-gray-600">カテゴリー: {post.category_name}</p> */}
				<p className="text-gray-600">{post.site_name}</p>
			</div>
			{/* <div className="mb-4">
				<p>{post.description}</p>
			</div> */}
			<div className="mb-4">
				<Link
					href={post.url}
					target="_blank"
					rel="noopener noreferrer"
					className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
				>
					元の記事を見る
				</Link>
			</div>
			<div>
				<Link href="/antenna" className="text-blue-500 hover:underline">
					← トップページに戻る
				</Link>
			</div>

			<div className="pt-10">
				<PostList limit={100} />
			</div>
		</div>
	)
}
