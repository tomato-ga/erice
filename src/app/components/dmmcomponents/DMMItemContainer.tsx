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

export default async function DMMItemContainer({ itemType }: { itemType: ItemType }) {
	const items = await fetchData(itemType)

	return (
		<div>
			{/* DMMItemListコンポーネントにデータを渡す */}
			<DMMItemList items={items} itemType={itemType} />
		</div>
	)
}
