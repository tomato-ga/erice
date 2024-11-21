// import { UmamiTracking } from '@/app/components/dmmcomponents/UmamiTracking'
// import { formatAntennaDate } from '@/app/utils/postUtils'
// import { antennaPost } from '@/types/antennaschema'
// import Link from 'next/link'
// import React from 'react'
// import { r18antennaFetch } from './r18fetch'

// const PostItem: React.FC<{ post: antennaPost }> = ({ post }) => (
// 	<article className='border-t border-[#dae0e6]'>
// 		<div className='flex p-2 hover:bg-[#fff6fb] text-[#212526]'>
// 			{!!post.image_url && (
// 				<Link href={post.url} target='_blank' className='no-underline'>
// 					<img
// 						src={post.image_url || ''}
// 						alt={`${post.title}の画像`}
// 						className='w-[90px] h-[60px] md:w-[120px] md:h-20 object-cover mr-2 md:mr-4'
// 						loading='lazy'
// 					/>
// 				</Link>
// 			)}
// 			<div className='flex-grow pl-2 flex flex-col justify-between'>
// 				<UmamiTracking
// 					trackingData={{
// 						dataType: 'antenna',
// 						from: 'antenna-post-list',
// 						otherData: { postId: post.id, postTitle: post.title, siteName: post.site_name },
// 					}}>
// 					<Link href={post.url} target='_blank' className='no-underline text-[#212526]'>
// 						<h3 className='text-base font-normal leading-tight mb-2 overflow-hidden line-clamp-3'>
// 							{post.title}
// 						</h3>
// 					</Link>
// 				</UmamiTracking>
// 				<div className='flex flex-col text-xs text-[#b1b1b1]'>
// 					<Link href={`/itema/${post.id}`} className='no-underline text-[#b1b1b1] hover:underline'>
// 						<span>{formatAntennaDate(post.published_at)}</span>
// 					</Link>
// 				</div>
// 			</div>
// 		</div>
// 	</article>
// )

// export const PostList: React.FC<{ limit: number }> = async ({ limit }) => {
// 	try {
// 		const postsdata = await r18antennaFetch(limit)

// 		if (!postsdata.data || postsdata.data.length === 0) {
// 			return <div>表示するデータがありません。</div>
// 		}

// 		return (
// 			<div className='bg-white'>
// 				{postsdata.data.slice(0, limit).map(post => (
// 					<PostItem key={post.id} post={post} />
// 				))}
// 			</div>
// 		)
// 	} catch (error) {
// 		console.error('PostList エラー:', error)
// 		return <div>データの読み込みに失敗しました。</div>
// 	}
// }

// export default React.memo(PostList)
