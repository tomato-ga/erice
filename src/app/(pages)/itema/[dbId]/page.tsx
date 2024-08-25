import React from 'react'
import Link from 'next/link'

import { antennaPost } from '@/types/antennaschema'

interface Props {
	params: { dbId: number }
}

const AntennaKobetuPage = ({ params }: Props) => {
	const dbId = params.dbId

    // TODO dbIdでfetchする

	return <div>テスト</div>
}

export default AntennaKobetuPage
