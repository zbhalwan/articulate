import './globals.css'

export const metadata = {
  title: 'Articulate - Online Board Game',
  description: 'Play Articulate with friends online',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
