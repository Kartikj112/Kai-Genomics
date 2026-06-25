import type { ReactNode } from 'react'
import { KaiLabsNav } from '@/components/labs/KaiLabsNav'
import { KaiLabsFooter } from '@/components/labs/KaiLabsFooter'

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <KaiLabsNav />
      {children}
      <KaiLabsFooter />
    </>
  )
}
