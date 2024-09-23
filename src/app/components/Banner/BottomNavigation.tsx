// components/BottomNavigation.tsx
'use client'

import { NavigationItem, NavigationItemSchema } from '@/_types_component/compTypes'
import { usePathname } from 'next/navigation'
import React from 'react'
import { FaHome, FaList, FaTag, FaUserPlus } from 'react-icons/fa'

/**
 * ボトムナビゲーションコンポーネント
 */
const BottomNavigation: React.FC = () => {
	const pathname = usePathname()

	// ナビゲーションアイテムの定義
	const navigationItems: NavigationItem[] = [
		{ label: 'ホーム', href: '/', icon: FaHome },
		{ label: 'セール', href: '/sale', icon: FaTag },
		{ label: '新人', href: '/newdebut', icon: FaUserPlus },
		{ label: 'キーワード一覧', href: '/keywords', icon: FaList },
	]

	// 型のバリデーション
	for (const item of navigationItems) {
		NavigationItemSchema.parse(item)
	}

	// /doujin が pathname に含まれていない場合にナビゲーションを表示
	if (!pathname.includes('/doujin')) {
		return (
			<nav className='fixed bottom-0 w-full bg-white border-t border-gray-200 md:hidden'>
				<ul className='flex justify-around py-2'>
					{navigationItems.map(item => {
						const isActive = pathname === item.href
						return (
							<li key={item.href}>
								<a
									href={item.href}
									className={`flex flex-col items-center ${
										isActive ? 'text-blue-500' : 'text-gray-500'
									}`}>
									<item.icon className='w-6 h-6' aria-hidden='true' />
									<span className='text-xs'>{item.label}</span>
								</a>
							</li>
						)
					})}
				</ul>
			</nav>
		)
	}

	// /doujin が含まれている場合はナビゲーションを表示しない
	return null
}

export default BottomNavigation
