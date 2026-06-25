import { ComingSoon } from '@/components/labs/ComingSoon'

export const metadata = { title: 'Kai Exchange — Kai Labs' }

export default function ExchangePage() {
  return (
    <ComingSoon
      eyebrow="Kai Exchange · Coming Soon"
      title="Scientists teach scientists."
      description="A free, community-driven platform where anyone can host a workshop and anyone can attend — no payments, no subscriptions, no monetization. We're building the two-sided platform now."
      bullets={[
        'Host a workshop: submit your session for community review',
        'Attend a workshop: browse, apply, and get a confirmation with a QR pass',
        'Future: mentorship, journal clubs, hackathons, and research collaborations',
      ]}
    />
  )
}
