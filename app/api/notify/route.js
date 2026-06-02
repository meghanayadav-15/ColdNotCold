export async function POST() {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'ColdNotCold <onboarding@resend.dev>',
      to: 'meghanayadav.seattle@gmail.com',
      subject: '❄️🔥 Your 20 people are ready!',
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
          <h2>Hey Meghana! 👋</h2>
          <p>Your new batch of 20 marketing professionals is ready and waiting for you.</p>
          <p>10 Field & Event Marketers + 10 Product Marketers — all Senior or Manager level, all in the USA.</p>
          <a href="https://cold-not-cold.vercel.app/dashboard" style="
            display: inline-block;
            background: #0f0f0f;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            margin-top: 1rem;
          ">View your people →</a>
          <p style="color: #999; font-size: 0.85rem; margin-top: 2rem;">ColdNotCold · Smart LinkedIn outreach, on autopilot.</p>
        </div>
      `
    })
  })

  const data = await response.json()
  return Response.json({ success: true, data })
}
