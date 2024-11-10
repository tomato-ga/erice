// components/Timeline.tsx
import { TimelineItem } from '@/_types_doujin/doujintypes'
import { formatDate } from '@/utils/dmmUtils'
import Link from 'next/link'

interface TimelineProps {
	items: TimelineItem[]
	title: string
}

const Timeline = ({ items, title }: TimelineProps) => {
	return (
		<div className='bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg p-4 sm:p-8 md:p-12'>
			<h2 className='text-3xl font-bold mb-12 text-center'>
				<span className='bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500'>
					{title}
				</span>
			</h2>
			<div className='relative'>
				<div className='absolute left-0 sm:left-1/4 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500 to-pink-500' />
				{items.map(item => (
					<div key={item.id} className='flex flex-col sm:flex-row items-center mb-8 relative'>
						<div className='w-full sm:w-1/4 mb-4 sm:mb-0 sm:pr-4 flex justify-center sm:justify-end z-10'>
							<div className='bg-white rounded-full p-2 sm:p-3 shadow-md text-center'>
								<span className='text-xs sm:text-sm md:text-base font-bold text-gray-800 whitespace-nowrap'>
									{formatDate(item.release_date)}
								</span>
							</div>
						</div>
						<div className='w-full sm:w-3/4 sm:pl-4 relative'>
							<Link prefetch={true} href={`/doujin/itemd/${item.id}`}>
								<div className='bg-white rounded-lg overflow-hidden transition duration-300 ease-in-out transform shadow-lg hover:shadow-xl ml-6 sm:ml-0'>
									<div className='relative pt-[56.25%] overflow-hidden bg-gray-100'>
										{item.package_images?.large && (
											<img
												src={item.package_images.large}
												alt={`${item.title}の画像です。`}
												className='absolute top-0 left-0 w-full h-full object-contain'
											/>
										)}
									</div>
									<div className='p-4'>
										<h2
											className='text-sm sm:text-base md:text-lg font-semibold mb-2 line-clamp-2'
											title={item.title}>
											{item.title}
										</h2>
									</div>
								</div>
							</Link>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

export default Timeline
