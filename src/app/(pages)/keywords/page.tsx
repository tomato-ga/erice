// src/app/keywords/page.tsx

import Link from 'next/link'
import React from 'react'
import {
	AllCategories,
	CombinedGroupedKeywords,
} from '../../components/dmmcomponents/Top100/keywords'

/**
 * キーワード一覧ページコンポーネント
 * 各キーワードへのリンクを表示します。
 * @returns JSX.Element
 */
const KeywordsPage = () => {
	return (
		<div className='container mx-auto px-6 py-12 bg-gray-50 dark:bg-gray-900 transition-colors duration-300'>
			{/* すべてのカテゴリーを表示 */}
			{AllCategories.map(category => (
				<section key={category.MainCategoryName} className='mb-16'>
					<h2 className='text-4xl font-extrabold mb-8 text-slate-800'>
						{category.MainCategoryName}
					</h2>
					<div className='grid grid-cols-1 gap-10'>
						{category.Subcategories.map(sub => (
							<div
								key={sub.SubCategoryName}
								className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md shadow-slate-200 transition-shadow'>
								<h3 className='text-2xl font-semibold mb-6 text-slate-700'>
									{sub.SubCategoryName}
								</h3>
								<ul className='flex flex-wrap gap-4'>
									{sub.Keywords.map(keyword => (
										<li key={keyword}>
											<Link href={`/keywords/${encodeURIComponent(keyword)}`} passHref>
												<button
													type='button'
													className='bg-transparent hover:bg-pink-600 text-pink-500 font-semibold hover:text-white py-2 px-4 border border-pink-500 hover:border-transparent rounded dark:text-pink-200 dark:border-pink-400 dark:hover:bg-pink-600 dark:hover:text-white'>
													{keyword}
												</button>
											</Link>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</section>
			))}

			{/* 体型とバストの組み合わせキーワードをグループ化して表示 */}
			<section className='mb-16'>
				<h2 className='text-4xl font-extrabold mb-8 text-slate-800'>
					体型とバストの組み合わせキーワード
				</h2>
				<div className='grid grid-cols-1 gap-10'>
					{CombinedGroupedKeywords.map(group => (
						<div
							key={group.base}
							className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md shadow-slate-200 transition-shadow'>
							<h3 className='text-2xl font-semibold mb-6 text-slate-700'>{group.base}</h3>
							<ul className='flex flex-wrap gap-4'>
								{group.combinations.map(combinedKeyword => (
									<li key={combinedKeyword}>
										<Link href={`/keywords/${encodeURIComponent(combinedKeyword)}`} passHref>
											<button
												type='button'
												className='bg-transparent hover:bg-pink-600 text-pink-500 font-semibold hover:text-white py-2 px-4 border border-pink-500 hover:border-transparent rounded dark:text-pink-200 dark:border-pink-400 dark:hover:bg-pink-600 dark:hover:text-white'>
												{combinedKeyword}
											</button>
										</Link>
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
