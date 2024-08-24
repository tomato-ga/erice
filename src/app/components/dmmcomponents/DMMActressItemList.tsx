'use client'

import Link from 'next/link'
import { Actress, ActressItem } from '@/types/dmmtypes'

const ItemCard = ({ item }: { item: ActressItem }) => (
	<div className="bg-white rounded-lg overflow-hidden shadow-md flex flex-col h-full transition duration-300 ease-in-out hover:shadow-lg">
		<Link href={`/item/${item.db_id}`}>
			<div className="relative pt-[56.25%] overflow-hidden bg-gray-100">
				<img src={item.imageUrl} alt={item.title} className="absolute top-0 left-0 w-full h-full object-contain" />
			</div>
			<div className="p-2 sm:p-3 flex flex-col flex-grow">
				<h3 className="text-sm sm:text-base font-semibold mb-1 line-clamp-2 text-gray-800">{item.title}</h3>
				<p className="text-red-600 font-bold text-xs sm:text-sm">
					{item.price.match(/\d+~円/) ? item.price : item.price.replace(/~/, '円〜')}
				</p>
			</div>
		</Link>
	</div>
)

const ActressCard = ({ actress }: { actress: Actress }) => (
	<div className="bg-white rounded-xl overflow-hidden shadow-lg p-3 sm:p-4 transition duration-300 ease-in-out hover:shadow-xl">
		<div className="flex items-center mb-2 sm:mb-3">
			<h2 className="text-lg sm:text-xl font-bold text-gray-800">{actress.name}</h2>
		</div>
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
			{actress.items.slice(0, 4).map((item) => (
				<ItemCard key={item.id} item={item} />
			))}
		</div>
	</div>
)

const ActressItemList = ({
	actresses,
	actressType,
	from
}: {
	actresses: Actress[]
	actressType: string
	from: string
}) => {
	return (
		<div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto px-2 sm:px-4">
			{actresses.map((actress) => (
				<ActressCard key={actress.id} actress={actress} />
			))}
		</div>
	)
}

export default ActressItemList
