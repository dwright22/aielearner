

import { Providers } from './providers'
import './globals.css'

export const metadata = {
  title: 'AI Learning SaaS',
  description: 'Personalized learning platform powered by AI',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
