import Link from 'next/link'
import React from 'react'

const about = () => {
	return (
		<>
			<div>
				Powered by <Link href="https://affiliate.dmm.com/api/">DMM.com</Link>
			</div>
			<div>
				<Link href="https://sokmil-ad.com/" target="_blank" rel="nofollow">
					<img src="https://sokmil-ad.com/api/credit/135x18.gif" alt="WEB SERVICE BY SOKMIL" width="135" height="18" />
				</Link>
			</div>
			≈
		</>
	)
}

export default about
