import './globals.css'
import Navigation from './components/Navigation'

export const metadata = {
  title: 'score.dp',
  description: 'iidx dp table',
  manifest: '/manifest.json',
  themeColor: '#000000',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'score.dp',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        <main className="main-content">
          {children}
        </main>
      </body>
    </html>
  )
}