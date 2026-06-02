'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [people, setPeople] = useState([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

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

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const res = await fetch('/api/generate', { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        await fetchThisWeek()
      } else {
        alert('Something went wrong generating people.')
      }
    } catch (e) {
      alert('Error: ' + e.message)
    }
    setGenerating(false)
  }

  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>ColdNotCold ❄️🔥</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link href="/history" style={{ color: '#666', fontSize: '0.9rem' }}>History</Link>
          <button onClick={handleSignOut} style={{ color: '#666', fontSize: '0.9rem', background: 'none', border: 'none', cursor: 'pointer' }}>Sign out</button>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h
