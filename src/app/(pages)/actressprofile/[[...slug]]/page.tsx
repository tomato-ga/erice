import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import LoadingSpinner from '@/app/components/Article/ArticleContent/loadingspinner'
import { fetchActressProfileAndWorks } from '@/app/components/dmmcomponents/fetch/itemFetchers'
import { DMMActressProfile, ActressProfileAndWorks, DMMActressProfilePageItem } from '@/types/APItypes'
import { formatDate } from '@/utils/dmmUtils'
import Image from 'next/image'
import Link from 'next/link'

interface PageProps {
	params: { slug: string }
}

const SITE_NAME = 'エロコメスト'

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const actressName = decodeURIComponent(params.slug)
	const data = await fetchActressProfileAndWorks(actressName)

	if (!data) {
		return {
			title: 'ページが見つかりません | ' + SITE_NAME,
			description: '指定された女優は存在しません。'
		}
	}

	const { actress } = data.profile
	const { name, birthday, prefectures } = actress
	const title = ` AV女優「${name}」のエロ動画・アダルト動画が${data.works.length}作品あります`
	const description = `${name}のAV女優プロフィールと作品一覧。${birthday ? `生年月日: ${birthday}、` : ''}${
		prefectures ? `出身地: ${prefectures}` : ''
	}`

	return {
		title,
		description,
		openGraph: {
			title,
			description
		},
		twitter: {
			card: 'summary',
			title,
			description
		}
	}
}

const ActressProfileSection = ({ profile }: { profile: DMMActressProfile }) => {
	return (
		<div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl p-6">
			<h2 className="text-3xl font-bold text-center py-4 text-gray-800 dark:text-white">
				<span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
					{profile.actress.name}のプロフィール
				</span>
			</h2>
			<div className="flex flex-col md:flex-row">
				<div className="md:w-1/3 p-4">
					<img
						src={profile.actress.image_url_large || ''}
						alt={profile.actress.name}
						className="w-full rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
					/>
				</div>
				<div className="md:w-2/3 p-4">
					{/* プロフィール情報を表示 */}
					{/* 例: 生年月日、サイズ、身長など */}
				</div>
			</div>
		</div>
	)
}

const ActressWorksList = ({ works }: { works: DMMActressProfilePageItem[] }) => {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
			{works.map((work) => (
				<div key={work.content_id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
					<Link href={`/item/${work.content_id}`} className="block">
						<div className="relative aspect-[3/2] w-full">
							{work.imageURL ? (
								<Image
									src={work.imageURL}
									alt={work.title}
									layout="fill"
									objectFit="cover"
									className="transition-transform duration-300 hover:scale-105"
								/>
							) : (
								<div className="w-full h-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
									<span className="text-gray-500 dark:text-gray-400">画像なし</span>
								</div>
							)}
						</div>
					</Link>
					<div className="p-4">
						<h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2 hover:underline">
							<Link href={`/item/${work.content_id}`}>{work.title}</Link>
						</h3>
						<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">発売日:{formatDate(work.release_date)}</p>
					</div>
				</div>
			))}
		</div>
	)
}

export default async function ActressProfilePage({ params }: PageProps) {
	console.log('params:', params)

	const actressName = decodeURIComponent(params.slug)

	console.log('actressName:', actressName)

	const data = await fetchActressProfileAndWorks(actressName)

	if (!data) {
		notFound()
	}

	const { profile, works } = data
	const itemCount = works.length

	console.log('profile:', profile)

	return (
		<div className="max-w-7xl mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-6 text-center">
				AV女優「{profile.actress.name}」のエロ動画・アダルト動画が{itemCount}作品あります
			</h1>

			<Suspense fallback={<LoadingSpinner />}>
				<ActressProfileSection profile={profile} />
			</Suspense>

			<h2 className="text-2xl font-semibold mt-12 mb-6">作品一覧</h2>

			<Suspense fallback={<LoadingSpinner />}>
				<ActressWorksList works={works} />
			</Suspense>
		</div>
	)
}
