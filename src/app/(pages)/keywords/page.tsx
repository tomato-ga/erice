// src/app/(pages)/keywords/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'
import {
	AllCategories,
	CombinedGroupedKeywords,
} from '../../components/dmmcomponents/Top100/keywords'
import HashScrollHandler from './HashScrollHandelr'
import KeywordsNavigation from './KeywordNavigation'
/**
 * ページのメタデータを生成します。
 *
 * @returns ページのメタデータオブジェクト
 */
export async function generateMetadata(): Promise<Metadata> {
	const totalCategories = AllCategories.length
	const totalSubcategories = AllCategories.reduce(
		(acc, category) => acc + category.Subcategories.length,
		0,
	)
	const totalKeywords = AllCategories.reduce(
		(acc, category) =>
			acc + category.Subcategories.reduce((subAcc, sub) => subAcc + sub.Keywords.length, 0),
		0,
	)
	const totalCombinedKeywords = CombinedGroupedKeywords.length

	const description = `人気のキーワードを${totalKeywords}件集めました。豊富なキーワードの中から、観たい作品を見つけるのに役立ててください。カテゴリーは${totalCategories}個、サブカテゴリは${totalSubcategories}個、組み合わせキーワードは${totalCombinedKeywords}件あります。レビュー合計数は多数です。最も多く登場する女優はN/Aです。`

	return {
		title: 'エロ動画キーワード一覧',
		description,
		robots: { index: false, follow: false },
		openGraph: {
			title: 'エロ動画キーワード一覧',
			description,
		},
		twitter: {
			card: 'summary_large_image',
			title: 'エロ動画キーワード一覧',
			description,
		},
	}
}

/**
 * キーワードページコンポーネント
 *
 * @returns キーワード一覧ページの JSX 要素
 */
const KeywordsPage: React.FC = () => {
	// 動的データの定義（実際にはデータ取得処理を実装してください）
	const validData = {
		createdAt: new Date().toISOString(),
	}
	const keyword = 'サンプルキーワード' // 実際のキーワードを使用してください
	const items = [{}, {}, {}] // 実際のアイテムデータに置き換えてください
	const allItemReviewCount = 123 // 実際のレビュー数を使用してください
	const sortedActessArray = [{ name: '女優名' }] // 実際の女優データを使用してください

	return (
		<div className='container mx-auto px-6 py-12 bg-gray-50 dark:bg-gray-900 transition-colors duration-300'>
			{/* ハッシュスクロールハンドラー */}
			<HashScrollHandler />

			{/* h1 と説明文の表示 */}
			<h1 className='text-4xl font-extrabold mb-4 text-slate-800'>
				【{new Date(validData.createdAt).getFullYear()}年最新】人気のエロ動画キーワード一覧
			</h1>
			<p className='pb-2 font-semibold'>
				エロ動画で人気のキーワード一覧です。
				<br />
				<br />
				キーワードのリンク先には、厳選したエロ動画をまとめています。観たい作品を見つけるのに役立ててください。
			</p>

			{/* 目次の表示 */}
			<KeywordsNavigation categories={AllCategories} />

			{/* カテゴリごとのキーワードセクション */}
			{AllCategories.map((category, categoryIndex) => (
				<section
					key={`${category.MainCategoryName}-${categoryIndex}`}
					id={`category-${categoryIndex}`}
					className='mb-16'>
					<h2 className='text-4xl font-extrabold mb-8 text-slate-800 dark:text-slate-200'>
						{category.MainCategoryName}
					</h2>
					<div className='grid grid-cols-1 gap-10'>
						{category.Subcategories.map((sub, subIndex) => (
							<div
								key={`${sub.SubCategoryName}-${subIndex}`}
								id={`subcategory-${categoryIndex}-${subIndex}`}
								className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md shadow-slate-200 dark:shadow-slate-700 transition-shadow'>
								<h3 className='text-2xl font-semibold mb-6 text-slate-700 dark:text-slate-300'>
									{sub.SubCategoryName}
								</h3>
								<ul className='flex flex-wrap gap-4'>
									{sub.Keywords.map((keyword, keywordIndex) => (
										<li key={`${keyword}-${keywordIndex}`}>
											<KeywordButton
												keyword={keyword}
												href={`/keywords/${encodeURIComponent(keyword)}`}
											/>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</section>
			))}

			{/* 体型とバストの組み合わせキーワードセクション */}
			<section id='combined-keywords' className='mb-16'>
				<h2 className='text-4xl font-extrabold mb-8 text-slate-800 dark:text-slate-200'>
					体型とバストの組み合わせ
				</h2>
				<div className='grid grid-cols-1 gap-10'>
					{CombinedGroupedKeywords.map((group, groupIndex) => (
						<div
							key={`${group.base}-${groupIndex}`}
							className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md shadow-slate-200 dark:shadow-slate-700 transition-shadow'>
							<h3 className='text-2xl font-semibold mb-6 text-slate-700 dark:text-slate-300'>
								{group.base}
							</h3>
							<ul className='flex flex-wrap gap-4'>
								{group.combinations.map((combinedKeyword, combinedIndex) => (
									<li key={`${group.base}-${combinedIndex}`}>
										<KeywordButton
											keyword={combinedKeyword}
											href={`/keywords/${encodeURIComponent(
												group.fetchCombinations[combinedIndex],
											)}`}
										/>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
			</section>
		</div>
	)
}

export default KeywordsPage

/**
 * キーワードボタンコンポーネント
 *
 * @param keyword - 表示するキーワード
 * @param href - キーワードへのリンク先
 * @returns キーワードボタンの JSX 要素
 */
const KeywordButton: React.FC<{ keyword: string; href: string }> = ({ keyword, href }) => (
	<Link
		href={href}
		className='bg-transparent hover:bg-pink-600 text-pink-500 font-semibold hover:text-white py-1.5 px-2.5 border border-pink-500 hover:border-transparent rounded dark:text-pink-200 dark:border-pink-400 dark:hover:bg-pink-600 dark:hover:text-white transition-colors duration-300'>
		{keyword}
	</Link>
)
