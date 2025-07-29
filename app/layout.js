export const metadata = {
  title: 'Snake Game',
  description: 'A classic Snake game built with Next.js',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#111' }}>
        {children}
      </body>
    </html>
  )
}