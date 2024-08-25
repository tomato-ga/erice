export const formatDate = (dateString: string): string => {
	const date = new Date(dateString)
	const year = date.getFullYear()
	const month = (date.getMonth() + 1).toString().padStart(2, '0')
	const day = date.getDate().toString().padStart(2, '0')
	const hours = date.getHours().toString().padStart(2, '0')
	const minutes = date.getMinutes().toString().padStart(2, '0')
	return `${year}/${month}/${day}`
}

export const formatAntennaDate = (dateString: string): string => {
	const date = new Date(dateString)
	const japanTime = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }))

	const year = japanTime.getFullYear()
	const month = (japanTime.getMonth() + 1).toString().padStart(2, '0')
	const day = japanTime.getDate().toString().padStart(2, '0')
	const hours = japanTime.getHours().toString().padStart(2, '0')
	const minutes = japanTime.getMinutes().toString().padStart(2, '0')
	const seconds = japanTime.getSeconds().toString().padStart(2, '0')

	return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`
}

export const truncateDescription = (description: string, maxLength: number): string => {
	if (description.length <= maxLength) return description
	return description.slice(0, maxLength) + '...'
}
