import { formatAntennaDate } from '@/app/utils/postUtils'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { PostList } from '@/app/components/antennacomponents/PostList'
import DMMFeaturesItemContainer from '@/app/components/dmmcomponents/DMMTopFeaturesItemList'
import RelatedItemsScroll from '@/app/components/dmmcomponents/Related/RelatedItemsScroll'
import { UmamiTracking } from '@/app/components/dmmcomponents/UmamiTracking'
import { antennaGetOnePostApiResponse, antennaPost } from '@/types/antennaschema'

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
		<div className='max-w-4xl mx-auto p-4 space-y-8'>
			<article className='bg-white overflow-hidden'>
				<div className='relative w-full'>
					{post.image_url && (
						<img src={post.image_url} alt={`${post.title}の画像`} width={800} height={600} />
					)}
				</div>
				<div className='p-6'>
					<h1 className='text-3xl font-bold mb-4'>{post.title}</h1>
					<div className='flex items-center text-gray-600 mb-4'>
						<time dateTime={post.published_at}>{formattedDate}</time>
						<span className='mx-2'>•</span>
						<span>{post.site_name}</span>
					</div>
					<p className='text-gray-700 mb-6'>{post.description}</p>
					<UmamiTracking
						trackingData={{
							dataType: 'antenna',
							from: 'antenna-post-detail',
							otherData: { postId: post.id, postTitle: post.title, siteName: post.site_name },
						}}>
						<Link
							href={post.url}
							target='_blank'
							rel='noopener noreferrer'
							className='inline-block bg-blue-600 text-white px-6 py-3  hover:bg-blue-700 transition-colors duration-200'>
							元の記事を読む
						</Link>
					</UmamiTracking>
				</div>
			</article>

			<DMMFeaturesItemContainer
				from='antenna-detail'
				bgGradient='bg-gradient-to-r from-pink-50 to-purple-50'
				endpoint='/api/dmm-feature-getkv'
				title='注目作品'
				linkText='全ての注目作品を見る'
				linkHref='/feature'
				umamifrom='antenna-detail-feature'
				textGradient='from-pink-500 to-purple-500'
			/>

			<nav className='flex justify-between items-center py-4'>
				<Link href='/antenna' className='text-blue-600 hover:underline'>
					← アンテナトップに戻る
				</Link>
				<Link href='/' className='text-blue-600 hover:underline'>
					サイトトップへ →
				</Link>
			</nav>

			<section className='bg-white shadow-lg rounded-lg p-6'>
				<h2 className='text-2xl font-bold mb-4'>最新の投稿</h2>
				<PostList limit={50} />
			</section>
		</div>
	)
}
