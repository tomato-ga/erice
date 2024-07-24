'use client'

import { useEffect, useState } from 'react'

interface DebugLoggerProps {
	postId: string
}

const DebugLogger: React.FC<DebugLoggerProps> = ({ postId }) => {
	const [historyEntries, setHistoryEntries] = useState<string[]>([])

	useEffect(() => {
		const logHistoryInfo = () => {
			console.log('Current history length:', window.history.length)
			console.log('Current URL:', window.location.href)
			console.log('Debugging for postId:', postId)

			const entries = []
			for (let i = 0; i < window.history.length; i++) {
				entries.push(`Entry ${i}: ${window.history.state?.as || 'Unknown'}`)
			}
			setHistoryEntries(entries)
			console.log('History entries:', entries)
		}

		logHistoryInfo()

		const handlePopState = () => {
			console.log('Popstate event triggered')
			logHistoryInfo()
		}

		window.addEventListener('popstate', handlePopState)

		return () => {
			window.removeEventListener('popstate', handlePopState)
		}
	}, [postId])

	return (
		<div style={{ display: 'none' }}>
			{historyEntries.map((entry, index) => (
				<div key={index}>{entry}</div>
			))}
		</div>
	)
}

export default DebugLogger
