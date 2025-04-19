import CreateSubscriptionScreen from '@/components/screens/CreateSubscription/page'
import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Create sub',
    description: '...',
}
const CreateSubscription = () => {
    return (
        <CreateSubscriptionScreen />
    )
}

export default CreateSubscription