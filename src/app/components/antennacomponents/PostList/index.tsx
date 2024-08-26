import React from 'react'
import { antennaPost, antennaPostApiResponse } from '@/types/antennaschema'
import Link from 'next/link'
import { formatAntennaDate } from '@/app/utils/postUtils'
import { r18antennaFetch } from './PostList'

const PostItem: React.FC<{ post: antennaPost }> = ({ post }) => (
	<article className="border-t border-[#dae0e6]">
		<div className="flex p-2 hover:bg-[#fff6fb] text-[#212526]">
			<div className="flex-grow pr-2 flex flex-col justify-between">
				<Link href={post.url} target="_blank" className="no-underline text-[#212526]">
					<h3 className="text-base font-normal leading-tight mb-2 overflow-hidden line-clamp-3">{post.title}</h3>
				</Link>
				<div className="flex flex-col text-xs text-[#b1b1b1]">
					<Link href={`/itema/${post.id}`} className="no-underline text-[#b1b1b1] hover:underline">
						<span>{formatAntennaDate(post.published_at)}</span>
					</Link>
				</div>
			</div>
			{!!post.image_url && (
				<Link href={post.url} target="_blank" className="no-underline">
					<img
						src={post.image_url || ''}
						alt={`${post.title}の画像`}
						className="w-[90px] h-[60px] md:w-[120px] md:h-20 object-cover ml-2 md:ml-4"
						loading="lazy"
					/>
				</Link>
			)}
		</div>
	</article>
)

export const PostList: React.FC<{ limit: number }> = async ({ limit }) => {
	try {
		const postsdata = await r18antennaFetch(limit)

		if (!postsdata.data || postsdata.data.length === 0) {
			return <div>表示するデータがありません。</div>
		}

		return (
			<div className="bg-white">
				{postsdata.data.slice(0, limit).map((post) => (
					<PostItem key={post.id} post={post} />
				))}
			</div>
		)
	} catch (error) {
		console.error('PostList エラー:', error)
		return <div>データの読み込みに失敗しました。</div>
	}
}
