// components/DMMActressItemList.tsx
'use client'

import Link from 'next/link'
import { Actress, ActressItem } from '../../../../types/dmmtypes'

const ItemCard = ({ item }: { item: ActressItem }) => (
	<div className="bg-white rounded-lg overflow-hidden shadow-md flex flex-col h-full transition duration-300 ease-in-out hover:shadow-lg">
		<Link href={`/item/${item.id}`}>
			<div className="relative pt-[56.25%] overflow-hidden bg-gray-100">
				<img src={item.imageUrl} alt={item.title} className="absolute top-0 left-0 w-full h-full object-cover" />
			</div>
			<div className="p-4 flex flex-col flex-grow">
				<h3 className="text-lg font-semibold mb-2 line-clamp-2 text-gray-800">{item.title}</h3>
				<p className="text-red-600 font-bold mb-2">{item.price}</p>
			</div>
		</Link>
	</div>
)

const ActressCard = ({ actress }: { actress: Actress }) => (
	<div className="bg-white rounded-xl overflow-hidden shadow-lg p-6 transition duration-300 ease-in-out hover:shadow-xl">
		<div className="flex items-center mb-4">
			<div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-2xl font-bold">
				{actress.name[0]}
			</div>
			<h2 className="text-2xl font-bold ml-4 text-gray-800">{actress.name}</h2>
		</div>
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
		<div className="space-y-8">
			{actresses.map((actress) => (
				<ActressCard key={actress.id} actress={actress} />
			))}
		</div>
	)
}

export default ActressItemList
