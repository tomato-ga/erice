// app/dmm-sale/page.tsx
import { Suspense } from 'react'
import SaleItemList from './SaleItemList'

import { DMMSaleItem } from '../../../../types/dmmtypes'

export default async function DMMSalePage() {
	const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dmm-sale-getkv`)
	const saleItems: DMMSaleItem[] = await response.json()

	console.log('saleItems', saleItems)

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-6">DMMセール商品</h1>
			<Suspense fallback={<div>読み込み中...</div>}>
				<SaleItemList items={saleItems} />
			</Suspense>
		</div>
	)
}
