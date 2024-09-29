import { create } from 'zustand'

type SidebarState = {
	sidebarOpen: boolean
	toggleSidebar: () => void
	openSidebar: () => void
	closeSidebar: () => void
}

const useSidebarStore = create<SidebarState>((set) => ({
	sidebarOpen: false, // 初期状態は非表示
	toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
	openSidebar: () => set({ sidebarOpen: true }),
	closeSidebar: () => set({ sidebarOpen: false }),
}))

export default useSidebarStore
