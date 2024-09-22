import Link from 'next/link'
import React from 'react'
import {
	AllCategories,
	CombinedGroupedKeywords,
} from '../../components/dmmcomponents/Top100/keywords'

const KeywordButton: React.FC<{ keyword: string; href: string }> = ({ keyword, href }) => (
	<Link href={href} passHref>
		<button
			type='button'
			className='bg-transparent hover:bg-pink-600 text-pink-500 font-semibold hover:text-white py-2 px-4 border border-pink-500 hover:border-transparent rounded dark:text-pink-200 dark:border-pink-400 dark:hover:bg-pink-600 dark:hover:text-white transition-colors duration-300'>
			{keyword}
		</button>
	</Link>
)

const KeywordsPage: React.FC = () => {
	return (
		<div className='container mx-auto px-6 py-12 bg-gray-50 dark:bg-gray-900 transition-colors duration-300'>
			{AllCategories.map((category, categoryIndex) => (
				<section key={`${category.MainCategoryName}-${categoryIndex}`} className='mb-16'>
					<h2 className='text-4xl font-extrabold mb-8 text-slate-800 dark:text-slate-200'>
						{category.MainCategoryName}
					</h2>
					<div className='grid grid-cols-1 gap-10'>
						{category.Subcategories.map((sub, subIndex) => (
							<div
								key={`${sub.SubCategoryName}-${subIndex}`}
								className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md shadow-slate-200 dark:shadow-slate-700 transition-shadow'>
								<h3 className='text-2xl font-semibold mb-6 text-slate-700 dark:text-slate-300'>
									{sub.SubCategoryName}
								</h3>
								<ul className='flex flex-wrap gap-4' >
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

			<section className='mb-16'>
				<h2 className='text-4xl font-extrabold mb-8 text-slate-800 dark:text-slate-200'>
					体型とバストの組み合わせキーワード
				</h2>
				<div className='grid grid-cols-1 gap-10'>
					{CombinedGroupedKeywords.map((group, groupIndex) => (
						<div
							key={`${group.base}-${groupIndex}`}
							className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md shadow-slate-200 dark:shadow-slate-700 transition-shadow'>
							<h3 className='text-2xl font-semibold mb-6 text-slate-700 dark:text-slate-300'>
								{group.base}
							</h3>
							<ul className='flex flex-wrap gap-4' >
								{group.combinations.map((combinedKeyword, combinedIndex) => (
									<li key={`${group.base}-${combinedIndex}`}>
										<KeywordButton
											keyword={combinedKeyword}
											href={`/keywords/${encodeURIComponent(group.fetchCombinations[combinedIndex])}`}
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
