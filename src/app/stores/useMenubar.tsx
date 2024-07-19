/* このコード スニペットは、React 用の小型で高速な状態管理ライブラリである Zustand を使用して、`useMenubarStore` というカスタム フックを定義する TypeScript
ファイルです。 */
// src/stores/useMenubarStore.ts
import { create } from 'zustand'

interface MenubarState {
	menubarOpen: boolean
	toggleMenubar: () => void
	closeMenubar: () => void
}

const useMenubarStore = create<MenubarState>((set) => ({
	menubarOpen: false,
	toggleMenubar: () => set((state) => ({ menubarOpen: !state.menubarOpen })),
	closeMenubar: () => set({ menubarOpen: false })
}))

export default useMenubarStore
