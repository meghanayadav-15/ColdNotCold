'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [people, setPeople] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/login'
      } else {
        setUser(user)
        fetchThisWeek()
      }
    }
    getUser()
  }, [])

  const fetchThisWeek = async () => {
    const now = new Date()
    const month = now.toLocaleString('default', { month: 'long' })
    const year = now.getFullYear()
    const weekNumber = getWeekNumber(now)

    const { data } = await supabase
      .from('people')
      .select('*')
      .eq('month', month)
      .eq('year', year)
      .eq('week_number', weekNumber)
      .order('created_at', { ascending: true })

    setPeople(data || [])
    setLoading(false)
  }

  const getWeekNumber = (date) => {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const dayNum = d.getDay() || 7
    d.setDate(d.getDate() + 4 - dayNum)
    const yearStart = new Date(d.getFullYear(), 0, 1)
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
  }

  const copyDM = (dm) => {
    navigator.clipboard.writeText(dm)
    alert('DM copied!')
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>ColdNotCold ❄️🔥</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/history" style={{ color: '#666', fontSize: '0.9rem' }}>History</Link>
          <button onClick={handleSignOut} style={{ color: '#666', fontSize: '0.9rem', background: 'none', border: 'none', cursor: 'pointer' }}>Sign out</button>
        </div>
      </div>

      <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>This week's people</h2>

      {loading && <p style={{ color: '#666' }}>Loading...</p>}
      {!loading && people.length === 0 && (
        <p style={{ color: '#666' }}>No people yet this week. Check back Tuesday or Thursday!</p>
      )}

      {people.map((person) => (
        <div key={person.id} style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem',
          borderBottom: '1px solid #f0f0f0',
          gap: '1rem'
        }}>
          <div>
            <p style={{ fontWeight: '600' }}>{person.name}</p>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>{person.title} · {person.company}</p>
            <p style={{ color: '#999', fontSize: '0.8rem' }}>{person.role_type}</p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
            {person.linkedin_url && (
              <a href={person.linkedin_url} target="_blank" rel="noopener noreferrer" style={{
                padding: '0.4rem 0.8rem',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '0.85rem',
                color: '#0f0f0f'
              }}>LinkedIn ↗</a>
            )}
            <button onClick={() => copyDM(person.drafted_dm)} style={{
              padding: '0.4rem 0.8rem',
              backgroundColor: '#0f0f0f',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}>Copy DM</button>
          </div>
        </div>
      ))}
    </main>
  )
}
