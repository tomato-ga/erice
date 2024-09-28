// components/LoadingSpinner.tsx
'use client'

import React from 'react'

const LoadingSpinner: React.FC = () => {
	return (
		<div className='flex justify-center items-center h-64' aria-label='読み込み中'>
			<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900' />
		</div>
	)
}

export default LoadingSpinner
