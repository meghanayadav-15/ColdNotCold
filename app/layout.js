import './globals.css'

export const metadata = {
  title: 'ColdNotCold',
  description: 'Smart LinkedIn outreach, on autopilot.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
