// src/components/KeywordsNavigation.tsx
'use client'

import React from 'react'
import { Link as ScrollLink } from 'react-scroll'

interface Subcategory {
	SubCategoryName: string
}

interface Category {
	MainCategoryName: string
	Subcategories: Subcategory[]
}

interface KeywordsNavigationProps {
	categories: Category[]
}

const KeywordsNavigation: React.FC<KeywordsNavigationProps> = ({ categories }) => {
	return (
		<nav className='mb-12'>
			<h2 className='text-3xl font-bold mb-4 text-slate-800 dark:text-slate-200'>目次</h2>
			<ul className='list-disc list-inside space-y-2'>
				{categories.map((category, categoryIndex) => (
					<li key={`toc-category-${categoryIndex}`}>
						<ScrollLink
							to={`category-${categoryIndex}`}
							smooth
							duration={500}
							offset={-70}
							className='text-blue-500 hover:underline dark:text-blue-400 transition-colors duration-300 cursor-pointer'>
							{category.MainCategoryName}
						</ScrollLink>
						{category.Subcategories.length > 0 && (
							<ul className='list-inside list-disc ml-5 mt-2 space-y-1'>
								{category.Subcategories.map((sub, subIndex) => (
									<li key={`toc-subcategory-${categoryIndex}-${subIndex}`}>
										<ScrollLink
											to={`subcategory-${categoryIndex}-${subIndex}`}
											smooth
											duration={500}
											offset={-70}
											className='text-blue-400 hover:underline dark:text-blue-300 transition-colors duration-300 cursor-pointer'>
											{sub.SubCategoryName}
										</ScrollLink>
									</li>
								))}
							</ul>
						)}
					</li>
				))}
				<li>
					<ScrollLink
						to='combined-keywords'
						smooth
						duration={500}
						offset={-70}
						className='text-blue-500 hover:underline dark:text-blue-400 transition-colors duration-300 cursor-pointer'>
						体型とバストの組み合わせ
					</ScrollLink>
				</li>
			</ul>
		</nav>
	)
}

export default KeywordsNavigation
