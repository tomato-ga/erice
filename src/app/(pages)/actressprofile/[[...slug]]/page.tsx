import LoadingSpinner from '@/app/components/Article/ArticleContent/loadingspinner'
import DMMActressStats from '@/app/components/dmmcomponents/DMMActressStats'
import { fetchActressProfileAndWorks } from '@/app/components/dmmcomponents/fetch/itemFetchers'
import {
	generateActressArticleStructuredData,
	generatePersonStructuredData,
} from '@/app/components/json-ld/jsonld'
import { DMMActressProfile, DMMActressProfilePageItem } from '@/types/APItypes'
import { formatDate } from '@/utils/dmmUtils'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import {
	generateRefinedProfileDescription,
	parseDetails,
	renderDetailValue,
} from './profileAnalysis'

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
			description: '指定された女優は存在しません。',
		}
	}

	const { actress } = data.profile
	const { name, birthday, prefectures } = actress
	const title = ` セクシー女優「${name}」のエロ動画が${data.works.length}作品あります`
	const description = `${actress.name}さんのセクシー女優プロフィールと作品一覧を見ることができるページです。${actress.name}さんの${data.works.length ? `出演作品数は ${data.works.length}件です。` : ''}${birthday ? `生年月日は${birthday}、` : ''}${prefectures ? `出身地は${prefectures}です。` : ''}${actress.bust && actress.waist && actress.hip ? `スリーサイズはB${actress.bust} W${actress.waist} H${actress.hip}です。` : ''}${actress.height ? `身長は${actress.height}cm。` : ''}${actress.cup ? `カップ数は${actress.cup}です。` : ''}${actress.hobby ? `趣味は${actress.hobby}です。` : ''}${actress.hobby ? `趣味は${actress.hobby}です。` : ''}`

	return {
		title,
		description,
		openGraph: {
			title,
			description,
		},
		twitter: {
			card: 'summary',
			title,
			description,
		},
	}
}

const ActressProfileSection = ({
	profile,
	pageTitle, // pageTitleを受け取る
	descriptionFromMetadata,
}: {
	profile: DMMActressProfile
	pageTitle: string // pageTitleの型を追加
	descriptionFromMetadata: string | undefined
}) => {
	const { actress } = profile
	const details = parseDetails(actress.details)
	const description = generateRefinedProfileDescription(profile)

	const renderProfileRow = (label: string, value: string | number | null, key?: string) => {
		if (value === null || value === '非公開' || value === '') return null
		return (
			<tr
				key={key}
				className='border-b border-gray-200 dark:border-gray-700 transition-colors duration-300 ease-in-out hover:bg-gray-50 dark:hover:bg-gray-800'>
				<td className='py-3 px-4 font-medium text-gray-700 dark:text-gray-300'>{label}</td>
				<td className='py-3 px-4 text-gray-600 dark:text-gray-400'>{value}</td>
			</tr>
		)
	}

	const articleJsonLd = generateActressArticleStructuredData(
		pageTitle,
		descriptionFromMetadata || '',
		profile,
	)

	return (
		<>
			<script
				id={`structured-data-${actress.name}-person`}
				type='application/ld+json'
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(articleJsonLd),
				}}
			/>
			{/* <script
				id={`structured-data-${actress.name}-article`}
				type='application/ld+json'
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(articleJsonLd),
				}}
			/> */}

			<div className='bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-xl rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl'>
				<div className='p-8'>
					<h2 className='text-4xl font-extrabold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400'>
						{actress.name}のプロフィール
					</h2>
					<div className='flex flex-col lg:flex-row lg:space-x-8'>
						<div className='lg:w-1/3 mb-6 lg:mb-0'>
							<img
								src={actress.image_url_large || ''}
								alt={actress.name}
								className='w-full object-contain aspect-[3/4]  transition-transform'
							/>
						</div>
						<div className='lg:w-2/3'>
							<div className='overflow-x-auto'>
								<table className='w-full text-left text-sm sm:text-base'>
									<tbody>
										{renderProfileRow('生年月日', actress.birthday, 'birthday')}
										{renderProfileRow('血液型', actress.blood_type, 'blood_type')}
										{renderProfileRow('出身地', actress.prefectures, 'prefectures')}
										{renderProfileRow('趣味', actress.hobby, 'hobby')}
										{renderProfileRow(
											'スリーサイズ',
											actress.bust && actress.waist && actress.hip
												? `B${actress.bust} W${actress.waist} H${actress.hip}`
												: null,
											'three_sizes',
										)}
										{renderProfileRow(
											'身長',
											actress.height ? `${actress.height}cm` : null,
											'height',
										)}
										{renderProfileRow('カップ', actress.cup, 'cup')}
										{details &&
											Object.entries(details).map(([key, value], index) => {
												if (['full_name', 'current_name', 'aliases'].includes(key)) return null
												return renderProfileRow(key, renderDetailValue(value), `detail-${index}`)
											})}
									</tbody>
								</table>
							</div>
						</div>
					</div>
					<div className='mt-8 text-lg text-gray-700 dark:text-gray-300 space-y-4'>
						{description.split('\n').map((paragraph, index) => (
							<p
								key={index}
								className='transition-opacity duration-300 ease-in-out hover:opacity-80'>
								{paragraph}
							</p>
						))}
					</div>

					<div className='mt-8'>
						<div className='flex flex-wrap gap-3'>
							{actress.styles?.map((style, index) => (
								<Link
									key={index}
									href={`/style/${encodeURIComponent(style)}`}
									className='px-4 py-2 bg-indigo-50 text-indigo-600 font-bold rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out hover:underline'>
									{style}
								</Link>
							))}
							{actress.types?.map((type, index) => (
								<Link
									key={index}
									href={`/type/${encodeURIComponent(type)}`}
									className='px-4 py-2 bg-indigo-50 text-indigo-600 font-bold rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out hover:underline'>
									{type}
								</Link>
							))}
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

const ActressWorksList = ({ works }: { works: DMMActressProfilePageItem[] }) => {
	return (
		<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6'>
			{works.map(work => (
				<div key={work.id} className='bg-white dark:bg-gray-800 shadow-md overflow-hidden'>
					<Link href={`/item/${work.id}`} className='block' prefetch={true}>
						<div className='relative aspect-[3/2] w-full'>
							{work.imageURL ? (
								<img
									src={work.imageURL}
									alt={work.title}
									className='w-full h-full object-contain transition-transform duration-300'
								/>
							) : (
								<div className='w-full h-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center'>
									<span className='text-gray-500 dark:text-gray-400'>画像なし</span>
								</div>
							)}
						</div>

						<div className='p-4'>
							<h3 className='text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2 hover:underline'>
								{work.title}
							</h3>
							<p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
								発売日:{formatDate(work.release_date)}
							</p>
						</div>
					</Link>
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

	// タイトルと概要を再計算
	const pageTitle = `セクシー女優「${profile.actress.name}」さんのエロ動画が${works.length}作品あります`

	const { birthday, prefectures, bust, waist, hip, height, cup } = profile.actress

	const pageDescription = `${profile.actress.name}さんのセクシー女優プロフィールと作品一覧を見ることができるページです。${profile.actress.name}さんの${works.length ? `出演作品数は ${works.length}件です。` : ''}${birthday ? `生年月日は${birthday}、` : ''}${prefectures ? `出身地は${prefectures}です。` : ''}${bust && waist && hip ? `スリーサイズはB${bust} W${waist} H${hip}です。` : ''}${height ? `身長は${height}cm。` : ''}${cup ? `カップ数は${cup}です。` : ''}
	${profile.actress.hobby ? `趣味は${profile.actress.hobby}です。` : ''}`

	return (
		<div className='max-w-7xl mx-auto px-4 py-8'>
			<h1 className='text-3xl font-bold mb-6 text-center'>
				{pageTitle} {/* 再計算したpageTitleを使用 */}
			</h1>

			<div className='mb-10'>
				<Suspense fallback={<LoadingSpinner />}>
					{profile.actress && (
						<ActressProfileSection
							profile={profile}
							pageTitle={pageTitle} // pageTitleを渡す
							descriptionFromMetadata={pageDescription}
						/>
					)}
				</Suspense>
			</div>

			<Suspense fallback={<LoadingSpinner />}>
				<DMMActressStats
					actress_id={profile.actress.id}
					actress_name={profile.actress.name}
					isSummary={false}
				/>
			</Suspense>

			<h2 className='text-2xl font-semibold mt-12 mb-6'>{profile.actress.name}の作品一覧</h2>

			<Suspense fallback={<LoadingSpinner />}>
				<ActressWorksList works={works} />
			</Suspense>
		</div>
	)
}
