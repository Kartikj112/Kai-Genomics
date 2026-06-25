import { ComingSoon } from '@/components/labs/ComingSoon'

export const metadata = { title: 'Research — Kai Labs' }

export default function ResearchPage() {
  return (
    <ComingSoon
      eyebrow="Research · Coming Soon"
      title="Open scientific questions."
      description="Projects, publications, and active research threads across marine genomics, natural-product discovery, peptide design, and origin-of-life theory — collected in one place."
      bullets={[
        'Sponge holobiont metagenomics and BGC discovery',
        'Antimicrobial peptide design and validation',
        'Theoretical origin-of-life and assembly frameworks',
      ]}
    />
  )
}
