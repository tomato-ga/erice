'use client'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
// import useMenubarStore from '../stores/useMenubar'

const Header: React.FC = () => {
	// const { toggleMenubar, menubarOpen, closeMenubar } = useMenubarStore()
	// const menubarRef = useRef<HTMLDivElement>(null)
	// const [screenName, setScreenName] = useState<string | null>(null)

	// useEffect(() => {
	// 	const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
	// 		if (!menubarRef.current?.contains(event.target as Node) && menubarOpen) {
	// 			closeMenubar()
	// 		}
	// 	}
	// 	document.addEventListener('mousedown', handleOutsideClick)
	// 	document.addEventListener('touchstart', handleOutsideClick)
	// 	return () => {
	// 		document.removeEventListener('mousedown', handleOutsideClick)
	// 		document.removeEventListener('touchstart', handleOutsideClick)
	// 	}
	// }, [menubarOpen, closeMenubar])

	// const handleLinkClick = () => {
	// 	if (menubarOpen) {
	// 		closeMenubar()
	// 	}
	// }

	return (
		<header className='relative bg-white text-black w-full border-b border-gray-300'>
			<div className='flex items-center justify-between w-full h-12 px-3'>
				<div className='ml-4 h-full'>
					<Link href='/' prefetch={false}>
						<img src='/site.webp' className='h-full w-auto' alt='エロコメスト' />
					</Link>
				</div>

				{/* <div className='flex items-center justify-end flex-grow'>
					<button type='button' onClick={toggleMenubar} className='text-black lg:hidden ml-auto'>
						🍔
					</button>
				</div> */}

				{/* <div
					ref={menubarRef}
					className={`${
						menubarOpen
							? 'fixed inset-0 bg-white p-4 flex flex-col space-y-4 z-50 transition-transform duration-300 ease-in-out'
							: 'hidden'
					} lg:flex lg:flex-grow lg:items-center lg:justify-end lg:space-x-4 lg:flex-row`}>
					<button
						type='button'
						onClick={closeMenubar}
						className='self-end text-xl font-bold lg:hidden'>
						×
					</button>
				</div> */}
				{/* <Link href="/popular" onClick={handleLinkClick} className="block">
						<span className="px-2 py-1 text-slate-700 rounded-md cursor-pointer font-semibold ">
							人気動画ランキング
						</span>
					</Link>
					<Link href="/rireki" onClick={handleLinkClick}>
						<span className="px-2 py-1 text-slate-700 rounded-md cursor-pointer font-semibold">最近見た動画</span>
					</Link> */}
				{/*<Link href="/" onClick={handleLinkClick}>
						<span className="px-2 py-1 rounded-md cursor-pointer font-semibold hover:bg-gray-200">お気に入り</span>
					</Link>
					<Link href="/" onClick={handleLinkClick}>
						<span className="px-2 py-1 rounded-md cursor-pointer font-semibold hover:bg-gray-200">閲覧履歴</span>
					</Link> */}
			</div>
		</header>
	)
}

export default Header
