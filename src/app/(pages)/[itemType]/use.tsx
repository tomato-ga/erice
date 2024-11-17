'use client'

import { ItemType } from '@/types/dmmtypes'
import { useEffect } from 'react'

export default function ClientLog({ params }: { params: { itemType: string } }) {
	const itemType = params.itemType as ItemType

	// Client-side logging
	useEffect(() => {
		console.log('Client-side log: itemType:', itemType)
	}, [itemType])

	console.log('params:', params)
	console.log('params:')
	return null
}
