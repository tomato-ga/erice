// components/DMMActressItemContainer.tsx
import { Actress, ActressType, AllContentResponse, NewActressResponse } from '@/types/dmmtypes'
import ActressItemList from './DMMActressItemList'

async function fetchData(actressType: ActressType): Promise<Actress[]> {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/api/dmm-actresses-getkv?type=${actressType}`,
		)

		if (!response.ok) {
			console.error('Error fetching data:', response.status, response.statusText)
			// TODO: 適切なエラーハンドリングを実装する
			return []
		}

		const data: NewActressResponse | AllContentResponse = await response.json()

		if ('actresses' in data) {
			return data.actresses
		}

		// AllContentResponseの場合、適切な形式に変換する
		const allItems = [
			...data['dmm-debut-items'],
			...data['dmm-feature-items'],
			...data['dmm-today-new-items'],
			...data['sale-items'],
		]
		return [{ id: 'all', name: 'All Content', items: allItems }]
	} catch (error) {
		console.error('Error fetching data:', error)
		// TODO: 適切なエラーハンドリングを実装する
		return []
	}
}

export default async function DMMActressItemContainer({
	actressType,
	from,
}: {
	actressType: ActressType
	from: string
}) {
	const actresses = await fetchData(actressType)

	const gradients = {
		new: 'from-emerald-100 to-sky-100',
		popular: 'from-amber-100 to-rose-100',
		all: 'from-fuchsia-100 to-violet-100',
	}

	const titles = {
		new: '新人女優',
		popular: '人気女優',
		all: '全てのコンテンツ',
	}

	return (
		<div
			className={`bg-gradient-to-r ${
				gradients[actressType]
			} shadow-lg p-4 sm:p-4 md:p-8 transition duration-300 ease-in-out`}>
			<div className='text-center mb-8'>
				<h2 className='text-4xl font-extrabold mb-4'>
					<span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600'>
						{titles[actressType]}
					</span>
				</h2>
			</div>
			<ActressItemList actresses={actresses} actressType={actressType} from={from} />
		</div>
	)
}
