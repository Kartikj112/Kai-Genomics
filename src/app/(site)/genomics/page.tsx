'use client'

import { useState, useEffect } from 'react'
import { Hero } from '@/components/sections/Hero/Hero'
import { Workshops } from '@/components/sections/Workshops/Workshops'
import { WorkshopDetail } from '@/components/sections/Workshops/WorkshopDetail'
import { About } from '@/components/sections/About/About'
import { Publications } from '@/components/sections/Publications/Publications'
import { LecturerApplication } from '@/components/sections/LecturerApplication/LecturerApplication'
import { Contact } from '@/components/sections/Contact/Contact'
import { useScrollReveal } from '@/lib/hooks/useScrollReveal'
import type { Workshop } from '@/lib/types'

export default function GenomicsHome() {
  const [activeWorkshop, setActiveWorkshop] = useState<Workshop | null>(null)

  useScrollReveal()

  useEffect(() => {
    document.body.style.overflow = activeWorkshop ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [activeWorkshop])

  const openWorkshop = (workshop: Workshop) => {
    setActiveWorkshop(workshop)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const closeWorkshop = () => {
    setActiveWorkshop(null)
    setTimeout(() => {
      document.getElementById('workshops')?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
  }

  return (
    <>
      {/* ── Workshop detail overlay ──────────────────────────── */}
      {activeWorkshop && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 300, overflowY: 'auto', background: 'var(--bg)' }}
        >
          <button
            onClick={closeWorkshop}
            style={{
              position: 'fixed', top: 22, left: 40, zIndex: 310,
              display: 'flex', alignItems: 'center', gap: 8,
              fontFamily: 'var(--font-mono), DM Mono, monospace',
              fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
              color: 'var(--muted)', background: 'var(--nav-fade)', border: '1px solid var(--border-color)',
              borderRadius: 999, padding: '8px 16px', cursor: 'pointer', transition: 'color 0.3s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--muted)' }}
          >
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden>
              <path d="M5 1L1 5L5 9M1 5H13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            All Workshops
          </button>
          <WorkshopDetail workshop={activeWorkshop} />
        </div>
      )}

      {/* ── Main page ────────────────────────────────────────── */}
      <main>
        <Hero />
        <Workshops onOpenWorkshop={openWorkshop} />
        <About />
        <Publications />
        <LecturerApplication />
        <Contact />
      </main>
    </>
  )
}
