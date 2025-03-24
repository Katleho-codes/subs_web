'use client'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth';
import useGetSubscriptions from '@/hooks/useGetSubscriptions';
import React from 'react'

const SubscriptionScreen = () => {
    const { user, googleLogin, logout } = useAuth();
    const { subs, subsLoading, getData } = useGetSubscriptions()
    return (
        <>

            {
                !user ?
                    <Button onClick={googleLogin}>Sign in with Google</Button> :

                    <>
                    
                    </>
            }
        </>
    )
}

export default SubscriptionScreen