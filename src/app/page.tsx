import CreateSubscriptionScreen from '@/components/screens/CreateSubscription/page'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Subscriptions',
    description: '...',
}
const Home = () => {
    return (
         <CreateSubscriptionScreen />
   
    )
}

export default Home