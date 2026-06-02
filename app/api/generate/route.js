import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const getWeekNumber = (date) => {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const dayNum = d.getDay() || 7
  d.setDate(d.getDate() + 4 - dayNum)
  const yearStart = new Date(d.getFullYear(), 0, 1)
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
}

export async function POST() {
  const now = new Date()
  const month = now.toLocaleString('default', { month: 'long' })
  const year = now.getFullYear()
  const weekNumber = getWeekNumber(now)

  const prompt = `You are a networking assistant. Find 20 real Senior or Manager level marketing professionals currently working in the USA.
- 10 in Field Marketing or Event Marketing
- 10 in Product Marketing
For each person return realistic details in this exact JSON array format, no extra text:
[
  {
    "name": "Full Name",
    "title": "Their exact job title",
    "company": "Company name",
    "linkedin_url": "https://linkedin.com/in/their-handle",
    "role_type": "Field & Event Marketing" or "Product Marketing",
    "drafted_dm": "A warm personalized 2-3 sentence LinkedIn DM from Meghana, a marketer exploring opportunities in field/event or product marketing. Reference their specific role and company. End with a simple question to connect. Vary the tone — some warm, some bold, some concise."
  }
]
Return only the JSON array, nothing else.`

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8
    })
  })

  const data = await response.json()
  const text = data.choices[0].message.content.trim()
  const clean = text.replace(/```json|```/g, '').trim()
  const people = JSON.parse(clean)

  const rows = people.map(p => ({
    ...p,
    week_number: weekNumber,
    month,
    year
  }))

  await supabase.from('people').insert(rows)

  return Response.json({ success: true, count: rows.length })
}
