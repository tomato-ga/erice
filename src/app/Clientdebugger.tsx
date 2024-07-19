'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

interface ClientDebuggerProps {
	currentPage: number
	articlesCount: number
}

export default function ClientDebugger({ currentPage, articlesCount }: ClientDebuggerProps) {
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const renderCountRef = useRef(0)
	const prevPathnameRef = useRef(pathname)
	const prevSearchParamsRef = useRef(searchParams)

	useEffect(() => {
		renderCountRef.current += 1
		console.log(`[Client] HomePage rendered. Count: ${renderCountRef.current}`)
		console.log(`[Client] Current URL: ${pathname}${searchParams.toString()}`)
		console.log(`[Client] Current Page: ${currentPage}, Articles Count: ${articlesCount}`)

		// ルート変更の検出
		if (pathname !== prevPathnameRef.current || searchParams.toString() !== prevSearchParamsRef.current.toString()) {
			console.log(`[Client] Route changed to: ${pathname}${searchParams.toString()}`)
			prevPathnameRef.current = pathname
			prevSearchParamsRef.current = searchParams
		}
	}, [pathname, searchParams, currentPage, articlesCount])

	// パフォーマンス測定
	useEffect(() => {
		const observer = new PerformanceObserver((list) => {
			list.getEntries().forEach((entry) => {
				console.log(`[Performance] ${entry.name}: ${entry.duration}ms`)
			})
		})
		observer.observe({ entryTypes: ['resource', 'navigation'] })

		return () => observer.disconnect()
	}, [])

	return null
}
