// src/types/dmm.ts

// package_imagesの型定義
interface PackageImages {
	large: string
	list: string
	small: string
}

export interface DmmBasePage {
	id: number
	content_id: string
	title: string
	release_date: string
	actresses: string
	package_images: PackageImages // JSON.parseされた後の型として定義
}

export interface DmmKeyword {
	id: number
	keyword: string
}

// DmmHomePageはDmmBasePageと同じ構造なので、そのまま継承します
export interface DmmHomePage extends DmmBasePage {}

// APIレスポンスの型定義（resultsのみ）
export interface DmmHomePageAPIResponse {
	results: DmmHomePage[]
}
