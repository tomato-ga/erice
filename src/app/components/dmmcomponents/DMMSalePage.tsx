/**
 * DMMセール商品ページコンポーネント
 *
 * @module DMMSalePage
 * @description
 * このコンポーネントは、DMMのセール商品一覧を表示するページを構成します。
 * APIからセール商品データを非同期で取得し、SaleItemListコンポーネントを使用して表示します。
 *
 * @requires React
 * @requires next/server
 * @requires ./SaleItemList
 * @requires @/types/dmmtypes
 *
 * @returns {Promise<JSX.Element>} セール商品ページのJSX要素
 *
 * @example
 * <DMMSalePage />
 */

import { Suspense } from 'react'
import SaleItemList from './SaleItemList'
import { DMMSaleItem } from '@/types/dmmtypes'

export default async function DMMSalePage() {
	/**
	 * セール商品データをAPIから取得
	 * @type {Response}
	 */
	const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dmm-sale-getkv`)

	/**
	 * 取得したセール商品データ
	 * @type {DMMSaleItem[]}
	 */
	const saleItems: DMMSaleItem[] = await response.json()

	console.log('saleItems', saleItems)

	return (
		<div className="w-full px-4 py-8 lg:px-8">
			<h1 className="text-3xl font-bold mb-6">DMMセール商品</h1>
			<Suspense fallback={<div>読み込み中です...</div>}>
				<SaleItemList items={saleItems} />
			</Suspense>
		</div>
	)
}
