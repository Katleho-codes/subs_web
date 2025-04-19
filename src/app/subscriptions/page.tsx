import SubscriptionScreen from '@/components/screens/Subscriptions/page'
import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Subscriptions',
    description: '...',
}
const Subscriptions = () => {
    return (
        <SubscriptionScreen />
    )
}

export default Subscriptions