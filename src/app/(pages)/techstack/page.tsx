import React from 'react'

const TechStack = () => {
	return (
		<div className='max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8'>
			<h1 className='text-3xl font-bold text-gray-900 mb-8'>このサイトの技術構成</h1>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
				<div className='bg-white p-6 rounded-lg shadow-md'>
					<h2 className='text-xl font-semibold text-gray-800 mb-4'>フロントエンド</h2>
					<ul className='space-y-2 text-gray-600'>
						<li className='flex items-center'>
							<span className='mr-2'>•</span>Next.js 14 App Router
						</li>
						<li className='flex items-center'>
							<span className='mr-2'>•</span>TypeScript
						</li>
						<li className='flex items-center'>
							<span className='mr-2'>•</span>Tailwind CSS
						</li>
						<li className='flex items-center'>
							<span className='mr-2'>•</span>Shadcn UI
						</li>
					</ul>
				</div>

				<div className='bg-white p-6 rounded-lg shadow-md'>
					<h2 className='text-xl font-semibold text-gray-800 mb-4'>バックエンド</h2>
					<ul className='space-y-2 text-gray-600'>
						<li className='flex items-center'>
							<span className='mr-2'>•</span>Go言語
						</li>
					</ul>
				</div>

				<div className='bg-white p-6 rounded-lg shadow-md'>
					<h2 className='text-xl font-semibold text-gray-800 mb-4'>クラウド</h2>
					<ul className='space-y-2 text-gray-600'>
						<li className='flex items-center'>
							<span className='mr-2'>•</span>Cloudflare Workers
						</li>
						<li className='flex items-center'>
							<span className='mr-2'>•</span>Cloudflare D1
						</li>
						<li className='flex items-center'>
							<span className='mr-2'>•</span>Cloudflare KV
						</li>
						<li className='flex items-center'>
							<span className='mr-2'>•</span>Vercel
						</li>
					</ul>
				</div>

				{/* <div className='bg-white p-6 rounded-lg shadow-md'> */}
				{/* <h2 className='text-xl font-semibold text-gray-800 mb-4'>フロントエンドソースコード</h2> */}
				{/* <p className='text-gray-600'> */}
				{/* <a href='https://github.com/tomato-ga' className="text-blue-600 hover:text-blue-800">erice</a> */}
				{/* </p> */}
				{/* </div> */}
			</div>
		</div>
	)
}

export default TechStack
