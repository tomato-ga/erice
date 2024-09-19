// src/app/(pages)/keywords/page.tsx
import React from 'react'
import { AllCategories } from '../../components/dmmcomponents/Top100/keywords'

const KeywordsPage = () => {
	return (
		<div className='container mx-auto px-6 py-12 bg-gray-50 dark:bg-gray-900 transition-colors duration-300'>
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
								{/* サブカテゴリー名にグラデーション色を追加 */}
								<h3 className='text-2xl font-semibold mb-6 text-slate-700'>
									{sub.SubCategoryName}
								</h3>
								<ul className='flex flex-wrap gap-4'>
									{sub.Keywords.map(keyword => (
										<li key={keyword}>
											<button
												type='button'
												className='bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded dark:text-blue-200 dark:border-blue-400 dark:hover:bg-blue-600 dark:hover:text-white'>
												{keyword}
											</button>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</section>
			))}
		</div>
	)
}

export default KeywordsPage
