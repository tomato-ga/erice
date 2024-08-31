import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import LoadingSpinner from '@/app/components/Article/ArticleContent/loadingspinner'
import { fetchActressProfileAndWorks } from '@/app/components/dmmcomponents/fetch/itemFetchers'
import { DMMActressProfile, ActressProfileAndWorks, DMMActressProfilePageItem, ActressDetails } from '@/types/APItypes'
import { formatDate } from '@/utils/dmmUtils'
import Link from 'next/link'
import { generateRefinedProfileDescription } from './profileAnalysis'

interface PageProps {
	params: { slug: string }
}

const SITE_NAME = 'エロコメスト'

export function parseDetails(details: string | null): ActressDetails | null {
	if (!details) return null
	try {
		return JSON.parse(details) as ActressDetails
	} catch {
		return null
	}
}

export function renderDetailValue(value: any): string {
	if (Array.isArray(value)) {
		return value.join(', ')
	} else if (typeof value === 'object' && value !== null) {
		return JSON.stringify(value)
	}
	return String(value)
}

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
	const { actress } = profile
	const details = parseDetails(actress.details)
	const description = generateRefinedProfileDescription(profile)

	const renderProfileRow = (label: string, value: string | number | null) => {
		if (value === null || value === '非公開' || value === '') return null
		return (
			<tr className="border-b dark:border-gray-700">
				<td className="py-2 px-4 font-medium">{label}</td>
				<td className="py-2 px-4">{value}</td>
			</tr>
		)
	}

	return (
		<div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
			<div className="p-6">
				<h2 className="text-3xl font-bold text-center mb-6">
					<span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
						{actress.name}のプロフィール
					</span>
				</h2>
				<div className="flex flex-col md:flex-row md:space-x-6">
					<div className="md:w-1/3 mb-6 md:mb-0">
						<img
							src={actress.image_url_large || '/placeholder-image.jpg'}
							alt={actress.name}
							className="w-full shadow-md object-cover aspect-[3/4]"
						/>
					</div>
					<div className="md:w-2/3">
						<table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
							<tbody>
								{renderProfileRow('生年月日', actress.birthday)}
								{renderProfileRow('血液型', actress.blood_type)}
								{renderProfileRow('出身地', actress.prefectures)}
								{renderProfileRow('趣味', actress.hobby)}
								{renderProfileRow(
									'スリーサイズ',
									actress.bust && actress.waist && actress.hip
										? `B${actress.bust} W${actress.waist} H${actress.hip}`
										: null
								)}
								{renderProfileRow('身長', actress.height ? `${actress.height}cm` : null)}
								{renderProfileRow('カップ', actress.cup)}
								{details &&
									Object.entries(details).map(([key, value]) => {
										if (key === 'full_name' || key === 'current_name' || key === 'aliases') return null
										return renderProfileRow(key, renderDetailValue(value))
									})}
							</tbody>
						</table>
						<div className="mt-4 text-sm text-gray-700 dark:text-gray-300">
							{description.split('\n').map((paragraph, index) => (
								<p key={index} className="mb-2">
									{paragraph}
								</p>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

const ActressWorksList = ({ works }: { works: DMMActressProfilePageItem[] }) => {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
			{works.map((work) => (
				<div key={work.id} className="bg-white dark:bg-gray-800 shadow-md overflow-hidden">
					<Link href={`/item/${work.id}`} className="block">
						<div className="relative aspect-[3/2] w-full">
							{work.imageURL ? (
								<img
									src={work.imageURL}
									alt={work.title}
									className="w-full h-full object-contain transition-transform duration-300"
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
							<Link href={`/item/${work.id}`}>{work.title}</Link>
						</h3>
						<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">発売日:{formatDate(work.release_date)}</p>
					</div>
				</div>
			))}
		</div>
	)
}

export default async function ActressProfilePage({ params }: PageProps) {
	console.log('ActressProfilePage params:', params)

	const actressName = decodeURIComponent(params.slug)

	console.log('actressName:', actressName)

	const data = await fetchActressProfileAndWorks(actressName)

	if (!data) {
		notFound()
	}

	const { profile, works } = data
	const itemCount = works.length

	console.log('profile:', JSON.stringify(profile, null, 2))
	console.log('profile.actress:', profile.actress)

	return (
		<div className="max-w-7xl mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-6 text-center">
				AV女優「{profile.actress.name}」のエロ動画・アダルト動画が{itemCount}作品あります
			</h1>

			{profile.actress && (
				<Suspense fallback={<LoadingSpinner />}>
					<ActressProfileSection profile={profile} />
				</Suspense>
			)}

			<h2 className="text-2xl font-semibold mt-12 mb-6">{profile.actress.name}の作品一覧</h2>

			<Suspense fallback={<LoadingSpinner />}>
				<ActressWorksList works={works} />
			</Suspense>
		</div>
	)
}
