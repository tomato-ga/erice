import type { Metadata } from 'next'
import React from 'react'
import GenreButton from './GenreButton'

/**
 * ページのメタデータを生成します。
 *
 * @returns ページのメタデータオブジェクト
 */
export async function generateMetadata(): Promise<Metadata> {
	const description = 'エロ動画のジャンル一覧ページです。'

	return {
		title: 'ジャンル一覧',
		description,
		openGraph: {
			title: 'ジャンル一覧',
			description,
		},
		twitter: {
			card: 'summary_large_image',
			title: 'ジャンル一覧',
			description,
		},
	}
}

/**
 * ジャンルページコンポーネント
 *
 * @returns ジャンル一覧ページの JSX 要素
 */
const GenresPage: React.FC = async () => {
	// APIエンドポイントのURL
	const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/dmm-genre-names`

	// サーバーサイドでデータをフェッチ
	const res = await fetch(API_URL, {
		next: { revalidate: 60 * 60 * 24 * 7 }, // 7日キャッシュ
	})

	if (!res.ok) {
		// エラーハンドリング
		console.error('Failed to fetch genres:', res.status)
		return <div>ジャンルの取得に失敗しました。</div>
	}

	const data: { genres: string[] } = await res.json()
	const genrenamelength = data.genres.length

	return (
		<div className='container mx-auto px-6 py-12 bg-gray-50 dark:bg-gray-900 transition-colors duration-300'>
			<h1 className='text-4xl font-extrabold mb-4 text-slate-800'>ジャンル一覧</h1>
			<p className='pb-6 font-semibold'>
				エロ動画のジャンル一覧ページです。{genrenamelength}件のジャンルが存在しています。
			</p>

			{/* ジャンルリストの表示 */}
			<ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
				{data.genres.map((genre, index) => (
					<li key={`${genre}-${index}`} className='flex justify-center'>
						<GenreButton genre={genre} href={`/genre/${encodeURIComponent(genre)}`} />
					</li>
				))}
			</ul>
		</div>
	)
}

export default GenresPage
