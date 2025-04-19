import AnalyticsScreen from '@/components/screens/Analytics/page'
import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Analytics',
    description: '...',
}
const Analytics = () => {
    return (
        <AnalyticsScreen />
    )
}

export default Analytics