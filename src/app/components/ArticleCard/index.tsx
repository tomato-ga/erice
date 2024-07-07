import Link from 'next/link'
import Image from 'next/image'
import { HomePageArticle } from '../../../../types/types'
import { formatDate, truncateDescription } from '@/app/utils/postUtils'

interface ArticleCardProps {
	article: HomePageArticle
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
	return (
		<div className="bg-white rounded-lg overflow-hidden shadow m-2 h-full flex flex-col justify-between">
			<Link href={article.link} className="flex flex-col h-full">
				<div className="relative w-full h-48">
					{article.image_url ? (
						<Image
							src={article.image_url}
							alt={article.title}
							fill
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
							className="object-cover"
						/>
					) : (
						<div className="w-full h-full bg-gray-200 flex items-center justify-center">
							<span>No Image</span>
						</div>
					)}
				</div>
				<div className="px-4 py-4 flex-grow">
					<span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
						{article.site_name}
					</span>
					<h3 className="text-black text-lg md:text-xl font-semibold mb-2 mt-2">{article.title}</h3>
					<p className="text-gray-700 mb-2 md:mb-4 overflow-hidden">{truncateDescription(article.title, 140)}</p>
				</div>
				<div className="px-4 py-4 mt-auto">
					<div className="flex justify-between items-center">
						<p className="text-gray-600 text-xs md:text-sm">{formatDate(article.created_at)}</p>
						<span className="inline-block bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 text-transparent bg-clip-text font-bold hover:underline">
							続きを読む
						</span>
					</div>
				</div>
			</Link>
		</div>
	)
}

export default ArticleCard
