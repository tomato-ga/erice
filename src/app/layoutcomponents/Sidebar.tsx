// components/Sidebar.tsx
import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'

const TagCloud = dynamic(() => import('../components/SidebarTags'), {
  suspense: true,
  loading: () => <div>タグを読み込み中...</div>
})

const Sidebar: React.FC = () => {
  return (
    <aside className="w-full md:w-64 lg:w-80 flex-shrink-0 bg-white border-b md:border-r md:border-b-0 p-4 md:p-6 mt-2">
      <div className="sticky top-4">
        <TagCloud />
      </div>
    </aside>
  )
}

export default Sidebar