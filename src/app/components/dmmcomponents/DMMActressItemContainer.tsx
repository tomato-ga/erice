// components/DMMActressItemContainer.tsx
import { Actress, ActressType, NewActressResponse, AllContentResponse } from '../../../../types/dmmtypes'
import ActressItemList from './DMMActressItemList'

async function fetchData(actressType: ActressType): Promise<Actress[]> {
	const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dmm-actresses-getkv?type=${actressType}`)
	const data: NewActressResponse | AllContentResponse = await response.json()

	if ('actresses' in data) {
		return data.actresses
	} else {
		// AllContentResponseの場合、適切な形式に変換する
		const allItems = [
			...data['dmm-debut-items'],
			...data['dmm-feature-items'],
			...data['dmm-today-new-items'],
			...data['sale-items']
		]
		return [{ id: 'all', name: 'All Content', items: allItems }]
	}
}

export default async function DMMActressItemContainer({
	actressType,
	from
}: {
	actressType: ActressType
	from: string
}) {
	const actresses = await fetchData(actressType)

	const gradients = {
		new: 'from-emerald-100 to-sky-100',
		popular: 'from-amber-100 to-rose-100',
		all: 'from-fuchsia-100 to-violet-100'
	}

	const titles = {
		new: '新人女優',
		popular: '人気女優',
		all: '全てのコンテンツ'
	}

	return (
		<div
			className={`bg-gradient-to-br ${gradients[actressType]} rounded-2xl p-8 shadow-lg transition duration-300 ease-in-out hover:shadow-xl`}
		>
			<h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
				<span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
					{titles[actressType]}
				</span>
			</h2>
			<ActressItemList actresses={actresses} actressType={actressType} from={from} />
		</div>
	)
}
