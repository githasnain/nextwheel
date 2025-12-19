'use client'

import dynamic from 'next/dynamic'

// Dynamically import the App component to avoid SSR issues with canvas
const App = dynamic(() => import('@/components/App'), { 
  ssr: false,
  loading: () => (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #2b0505 0%, #233159 60%, #05051a 100%)',
      color: 'white',
      fontSize: '20px'
    }}>
      Loading Wheel of Names...
    </div>
  )
})

export default function Home() {
  return <App />
}

