import React from 'react'

interface Prices {
	list_price?: string | number
	price?: string | number
}

interface PriceDisplayProps {
	prices: Prices
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ prices }) => {
	const formatPrice = (price: string | number | undefined): string => {
		if (typeof price === 'undefined') return 'N/A'
		return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(Number(price))
	}

	const listPrice = formatPrice(prices.list_price)
	const salePrice = formatPrice(prices.price)

	const hasDiscount = listPrice !== salePrice && listPrice !== 'N/A' && salePrice !== 'N/A'

	return (
		<div className="mt-4">
			{hasDiscount && <span className="text-gray-500 line-through mr-2">{listPrice}</span>}
			<span className="text-red-600 font-bold text-2xl">{salePrice}</span>
			{hasDiscount && (
				<span className="ml-2 bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">割引中</span>
			)}
		</div>
	)
}

export default PriceDisplay
