import React from 'react'
import dynamic from 'next/dynamic'

import { formatDate } from '@/app/utils/postUtils'
import { NextPage } from 'next'

const PostPage: NextPage<{ params: { postId: string } }> = async ({ params }) => {
	return (
		<div className="bg-white min-h-screen">
			<div className="container mx-auto px-4 py-8">
				<PostContent />
			</div>
		</div>
	)
}

const PostContent: React.FC = () => (
	<div className="bg-white">
		<div className="relative">{'パンくずとか'}</div>
		<div className="p-8">
			{/* <PostHeader post={post} isCurrentUser={isCurrentUser} /> */}
			<h1 className="text-gray-600 text-2xl sm:text-4xl font-bold py-4">タイトル</h1>
			{/* <PostParts part={post.part} /> */}
			<p className="text-gray-600 leading-relaxed mb-8 py-4 whitespace-pre-wrap break-words">test</p>
		</div>
	</div>
)

// const PostHeader: React.FC<PostHeaderProps> = ({ post, isCurrentUser }) => (
// 	<div className="flex items-center justify-between mb-4">
// 		<div className="flex items-center">
// 			<img
// 				src={post.user.image || '/default-avatar.jpg'}
// 				alt={post.user.profile?.screenName ?? 'スクリーンネームがありません'}
// 				className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-4"
// 			/>
// 			<div>
// 				<p className="text-gray-900 font-semibold">{post.user.profile?.screenName}</p>
// 				{post.updatedat ? (
// 					<p className="text-gray-600 text-sm">{formatDate(post.updatedat)}</p>
// 				) : (
// 					<p className="text-gray-600 text-sm">{formatDate(post.createdat)}</p>
// 				)}
// 			</div>
// 		</div>
// 		{isCurrentUser && (
// 			<div className="relative">
// 				<PostOptionsButton postId={post.id} screenName={post.user.profile?.screenName} />
// 			</div>
// 		)}
// 	</div>
// )

// const PostParts: React.FC<PostPartsProps> = ({ part }) => (
// 	<div className="bg-white rounded-lg py-2">
// 		{part && (
// 			<ul className="space-y-4">
// 				<li className="flex items-center">
// 					<span className="font-semibold flex-shrink-0">ケース:</span>
// 					<span className="ml-2">{part.case}</span>
// 				</li>
// 				<li className="flex items-center">
// 					<span className="font-semibold flex-shrink-0">プレート:</span>
// 					<span className="ml-2">{part.plate}</span>
// 				</li>
// 				<li className="flex items-center">
// 					<span className="font-semibold flex-shrink-0">スイッチ:</span>
// 					<span className="ml-2">{part.switches}</span>
// 				</li>
// 				<li className="flex items-center">
// 					<span className="font-semibold flex-shrink-0">キーキャップ:</span>
// 					<span className="ml-2">{part.keyCaps}</span>
// 				</li>
// 			</ul>
// 		)}
// 	</div>
// )

const linkifyText = (text: string) => {
	const urlRegex = /(https?:\/\/[^\s]+)/g
	return text.split(urlRegex).map((part, index) => {
		if (part.match(urlRegex)) {
			return (
				<a key={index} href={part} target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">
					{part}
				</a>
			)
		}
		return part
	})
}

export default PostPage
