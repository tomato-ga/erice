import React from 'react'

const LoadingSpinner: React.FC = () => {
	return (
		<div className='flex justify-center items-center h-screen'>
			<div className='animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900' />
			<span className='sr-only'>読み込み中...</span>
		</div>
	)
}

export default LoadingSpinner
