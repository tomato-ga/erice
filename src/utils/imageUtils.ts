export function getPackageImageUrl(
	packageImages:
		| {
				list: string
				large: string
		  }
		| string
		| null,
): string {
	if (!packageImages) return ''
	if (typeof packageImages === 'string') {
		try {
			const parsed = JSON.parse(packageImages)
			return parsed.large || parsed.list || ''
		} catch {
			return packageImages
		}
	}
	return packageImages.large || packageImages.list || ''
}
