// src/app/components/GenreComponents/GenreButton.tsx
import Link from 'next/link'
import React from 'react'

/**
 * ジャンルボタンコンポーネント
 *
 * @param genre - 表示するジャンル名
 * @param href - ジャンルへのリンク先
 * @returns ジャンルボタンの JSX 要素
 */
const GenreButton: React.FC<{ genre: string; href: string }> = ({ genre, href }) => (
	<Link
		href={href}
		className='bg-transparent hover:bg-blue-600 text-blue-500 font-semibold hover:text-white py-1.5 px-2.5  hover:border-transparent rounded dark:text-blue-200 dark:border-blue-400 dark:hover:bg-blue-600 dark:hover:text-white transition-colors duration-300'>
		{genre}
	</Link>
)

export default GenreButton
