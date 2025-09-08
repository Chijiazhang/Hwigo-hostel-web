import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Hwigo Hostel - 住进城市的呼吸，遇见世界的你',
  description: '我们是一家为背包客、独行侠与小团队打造的青年旅馆。干净、友好、价格公道——一切都不复杂，只为让你的旅行轻松舒心。',
  keywords: '青年旅馆,青旅,背包客,住宿,旅行,马德里,西班牙',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
