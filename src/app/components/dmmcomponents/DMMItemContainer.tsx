import { DMMItemProps } from '../../../../types/dmmtypes'
import DMMItemList from './DMMItemList'

export type ItemType = 'todaynew' | 'debut' | 'feature' | 'sale'

async function fetchData(itemType: ItemType): Promise<DMMItemProps[]> {
	let endpoint = ''
	switch (itemType) {
		case 'todaynew':
			endpoint = '/api/dmm-todaynew-getkv'
			break
		case 'debut':
			endpoint = '/api/dmm-debut-getkv'
			break
		case 'feature':
			endpoint = '/api/dmm-feature-getkv'
			break
		case 'sale':
			endpoint = '/api/dmm-sale-getkv'
			break
		default:
			throw new Error(`Invalid itemType: ${itemType}`)
	}

	const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`)
	const data: DMMItemProps[] = await response.json()
	return data
}

export default async function DMMItemContainer({ itemType, from }: { itemType: ItemType; from: string }) {
	const items = await fetchData(itemType)

	const gradients = {
		todaynew: 'from-green-50 to-blue-50',
		debut: 'from-yellow-50 to-red-50',
		feature: 'from-pink-50 to-purple-50',
		sale: 'from-blue-50 to-purple-50'
	}
	return (
		<div
			className={`bg-gradient-to-r ${gradients[itemType]} rounded-xl  p-6 md:p-8 transition duration-300 ease-in-out hover:shadow-xl`}
		>
			<DMMItemList items={items} itemType={itemType} from={from} />
		</div>
	)
}
