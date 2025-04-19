import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth';

const NotLoggedIn = () => {
    const { googleLogin } = useAuth();
    return (
        <div className="p-2 h-full min-h-full max-h-full">
            <main className='grid grid-cols-1 lg:grid-cols-2 items-center h-full rounded-sm shadow-sm w-full border'>
                <div className='not_logged_in_bg hidden lg:flex' />
                <div className='p-2  grid place-content-center gap-5 justify-center'>
                    <Image width={50} height={50} alt="logo" src={"/logo.svg"} className="mx-auto" />
                    <Button className="login-with-google-btn" onClick={googleLogin}> Sign in with Google</Button>
                </div>
            </main>
        </div>
    )
}

export default NotLoggedIn