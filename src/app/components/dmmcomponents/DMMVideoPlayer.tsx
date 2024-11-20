'use client'

const VideoPlayer = ({ src }: { src: string | null | undefined }) => {
	if (!src) return null

	const sizePriority = ['size_720_480', 'size_644_414', 'size_560_360', 'size_476_306']

	const extractSize = (url: string): { width: number; height: number } | null => {
		for (const size of sizePriority) {
			const match = url.match(new RegExp(`/${size}/`))
			if (match) {
				const [width, height] = size.split('_').slice(1).map(Number)
				return { width, height }
			}
		}
		return null
	}

	const size = extractSize(src)
	const width = size?.width || 720 // デフォルト値
	const height = size?.height || 480 // デフォルト値

	return (
		<div className='max-w-full' style={{ overflow: 'hidden' }}>
			<iframe
				src={src}
				loading='lazy'
				width={width}
				height={height} // 必要に応じて高さを調整
				allow='autoplay'
				title='動画プレイヤー'
				className='border-0 overflow-hidden max-w-full'
				scrolling='no'
				frameBorder={0}
			/>
		</div>
	)
}

export default VideoPlayer
