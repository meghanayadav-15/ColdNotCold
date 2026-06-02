'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function History() {
  const [grouped, setGrouped] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) window.location.href = '/login'
      else fetchAll()
    }
    getUser()
  }, [])

  const fetchAll = async () => {
    const { data } = await supabase
      .from('people')
      .select('*')
      .order('created_at', { ascending: false })

    const result = {}
    data?.forEach(person => {
      const monthKey = `${person.month} ${person.year}`
      const weekKey = `Week ${person.week_number}`
      if (!result[monthKey]) result[monthKey] = {}
      if (!result[monthKey][weekKey]) result[monthKey][weekKey] = []
      result[monthKey][weekKey].push(person)
    })
    setGrouped(result)
    setLoading(false)
  }

  const exportCSV = (people, label) => {
    const headers = 'Name,Title,Company,LinkedIn URL,Role Type\n'
    const rows = people.map(p =>
      `"${p.name}","${p.title}","${p.company}","${p.linkedin_url}","${p.role_type}"`
    ).join('\n')
    const blob = new Blob([headers + rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${label}.csv`
    a.click()
  }

  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>ColdNotCold ❄️🔥</h1>
        <Link href="/dashboard" style={{ color: '#666', fontSize: '0.9rem' }}>← Back</Link>
      </div>

      <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem' }}>History</h2>

      {loading && <p style={{ color: '#666' }}>Loading...</p>}

      {Object.entries(grouped).map(([month, weeks]) => {
        const allPeople = Object.values(weeks).flat()
        return (
          <div key={month} style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>{month}</h3>
              <button onClick={() => exportCSV(allPeople, month)} style={{
                padding: '0.3rem 0.7rem',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '0.8rem',
                cursor: 'pointer',
                background: 'none'
              }}>Export month ↓</button>
            </div>

            {Object.entries(weeks).map(([week, people]) => (
              <div key={week} style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <p style={{ fontWeight: '600', fontSize: '0.9rem', color: '#666' }}>{week}</p>
                  <button onClick={() => exportCSV(people, `${month}-${week}`)} style={{
                    padding: '0.2rem 0.6rem',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    background: 'none'
                  }}>Export week ↓</button>
                </div>
                {people.map(person => (
                  <div key={person.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem',
                    borderBottom: '1px solid #f0f0f0',
                  }}>
                    <div>
                      <p style={{ fontWeight: '600', fontSize: '0.9rem' }}>{person.name}</p>
                      <p style={{ color: '#666', fontSize: '0.8rem' }}>{person.title} · {person.company}</p>
                    </div>
                    {person.linkedin_url && (
                      <a href={person.linkedin_url} target="_blank" rel="noopener noreferrer" style={{
                        padding: '0.3rem 0.6rem',
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        color: '#0f0f0f'
                      }}>LinkedIn ↗</a>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )
      })}
    </main>
  )
}
