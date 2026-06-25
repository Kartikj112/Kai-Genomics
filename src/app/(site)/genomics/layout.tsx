import type { ReactNode } from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kai Genomics — A Kai Labs Initiative',
  description:
    'Kai Genomics — research and bioinformatics education. Workshops, publications, and an interactive decision engine for genomics workflows. A Kai Labs Initiative.',
}

export default function GenomicsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
