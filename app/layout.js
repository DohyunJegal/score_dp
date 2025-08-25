import './globals.css'
import Navigation from './components/Navigation'

export const metadata = {
  title: 'score.dp',
  description: 'iidx dp table',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        <main style={{ marginLeft: '220px', padding: '20px' }}>
          {children}
        </main>
      </body>
    </html>
  )
}