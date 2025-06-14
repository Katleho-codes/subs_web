'use client'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useAddSubscription from '@/hooks/useAddSusbcription';

import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Sidebar from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/useAuth';
import cycles from '@/lib/billing_cycles';
import currencies from '@/lib/currencies';
import { datetimestamp } from '@/lib/datetime';
import categories from '@/lib/subscription_categories';
import React, { useState } from 'react';
import NotLoggedIn from '../NotLoggedIn/page';

export default function CreateSubscriptionScreen() {
    const { user } = useAuth();

    const { addSub, addSubLoading } = useAddSubscription()
    const [sub_name, setSubName] = useState("")
    const [plan_name, setPlanName] = useState("")
    const [amount, setAmount] = useState("")
    const [category, setCategory] = useState("")
    const [billing_cycle, setBillingCycle] = useState("")
    const [start_date, setStartDate] = useState("")
    const [next_billing_date, setNextBillingDate] = useState("")
    const [currency, setCurrency] = useState("")
    const [is_trial, setIsTrial] = useState(false)
    const [trial_start_date, setTrialStartDate] = useState("")
    const [trial_end_date, setTrialEndDate] = useState("")
    const [auto_renew, setAutoRenew] = useState(false)
    const toggleCheckbox = () => setAutoRenew(previousState => !previousState);
    const toggleTrialCheckbox = () => {
        setIsTrial(previousState => !previousState);
    }
    const created_at = datetimestamp
    const createSub = async (values: React.SyntheticEvent) => {
        values.preventDefault()
        const payload = {
            sub_name, category, plan_name, billing_cycle, amount,
            start_date, next_billing_date, currency, auto_renew, created_at
        }
        await addSub(payload)


    }
    return (
        <>

            {
                !user ?
                    <NotLoggedIn /> :
                    <main className="dark:bg-[#333533] h-screen">
                        <Sidebar />
                        <div className='container max-w-full lg:w-md lg:min-w-md mx-auto p-2'>

                            <form onSubmit={createSub}>
                                <div className='mb-3'>
                                    <Label htmlFor="sub_name" className='mb-2 text-gray-800 dark:text-[#f6fff8]'>Subscription name</Label>
                                    <Input type="text" className='focus-visible:shadow-none focus-visible:ring-0 focus-visible:outline-none focus-visible:border-[#eee] dark:border-[#333533]' value={sub_name} onChange={(e) => setSubName(e.target.value)} />
                                </div>
                                <div className='mb-3'>
                                    <Select value={category} onValueChange={(e) => setCategory(e)}>
                                        <SelectTrigger className="w-full cursor-pointer text-gray-800 dark:text-[#f6fff8] focus-visible:shadow-none focus-visible:ring-0 focus-visible:outline-none focus-visible:border-[#eee] dark:border-[#333533]">
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent className="dark:bg-[#333533] dark:text-[#f6fff8]">
                                            <SelectGroup>
                                                <SelectLabel className='dark:text-[#f6fff8]'>Categories</SelectLabel>
                                                {categories?.map((x) => (
                                                    <SelectItem className="hover:dark:bg-[#212529] focus:dark:bg-[#212529]" key={x?.id} value={x?._name}>{x?._name}</SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-center space-x-2 mb-3">
                                    <Checkbox id="is_trial" checked={is_trial} onCheckedChange={toggleTrialCheckbox} className='cursor-pointer' />
                                    <label
                                        htmlFor="is_trial"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-800 dark:text-[#f6fff8]"
                                    >
                                        Trial subscription? (Check for yes, leave blank for no)
                                    </label>
                                </div>
                                {/* if trial */}
                                {
                                    is_trial === true ?

                                        <>

                                            <div className='mb-3'>
                                                <Label htmlFor='trial_start_date' className='mb-2 text-gray-800 dark:text-[#f6fff8]'>Trial start date</Label>
                                                <Input type="date" name="trial_start_date" value={trial_start_date} className='focus-visible:shadow-none focus-visible:ring-0 focus-visible:outline-none focus-visible:border-[#eee] dark:border-[#333533]' onChange={(e) => setTrialStartDate(e.target.value)} />
                                            </div>
                                            <div className='mb-3'>
                                                <Label htmlFor='trial_end_date' className='mb-2 text-gray-800 dark:text-[#f6fff8]'>Trial end date</Label>
                                                <Input type="date" name="trial_end_date" value={trial_end_date} className='focus-visible:shadow-none focus-visible:ring-0 focus-visible:outline-none focus-visible:border-[#eee] dark:border-[#333533]' onChange={(e) => setTrialEndDate(e.target.value)} />
                                            </div>
                                        </>
                                        :
                                        <>

                                            <div className='mb-3'>
                                                <Label htmlFor="plan_name" className='mb-2 text-gray-800 dark:text-[#f6fff8]'>Plan name e.g. Premium</Label>
                                                <Input type="text" value={plan_name} className='focus-visible:shadow-none focus-visible:ring-0 focus-visible:outline-none focus-visible:border-[#eee] dark:border-[#333533]' onChange={(e) => setPlanName(e.target.value)} />
                                            </div>
                                            <div className='mb-3'>
                                                <Select value={billing_cycle} onValueChange={(e) => setBillingCycle(e)}>
                                                    <SelectTrigger className="w-full cursor-pointer text-gray-800 dark:text-[#f6fff8] focus-visible:shadow-none focus-visible:ring-0 focus-visible:outline-none focus-visible:border-[#eee] dark:border-[#333533]">
                                                        <SelectValue placeholder="Select a billing cycle" />
                                                    </SelectTrigger>
                                                    <SelectContent className="dark:bg-[#333533] dark:text-[#f6fff8]">
                                                        <SelectGroup>
                                                            <SelectLabel className='dark:text-[#f6fff8]'>Billing cycles</SelectLabel>
                                                            {cycles?.map((x) => (
                                                                <SelectItem className="hover:dark:bg-[#212529] focus:dark:bg-[#212529]" key={x?.id} value={x?._name}>{x?._name}</SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className='mb-3'>
                                                <Label htmlFor='start_date' className='mb-2 text-gray-800 dark:text-[#f6fff8]'>Start date</Label>
                                                <Input type="date" name="start_date" className='focus-visible:shadow-none focus-visible:ring-0 focus-visible:outline-none focus-visible:border-[#eee] dark:border-[#333533]' value={start_date} onChange={(e) => setStartDate(e.target.value)} />
                                            </div>
                                            <div className='mb-3'>
                                                <Label htmlFor='next_billing_date' className='mb-2 text-gray-800 dark:text-[#f6fff8]'>Due date</Label>
                                                <Input type="date" name="next_billing_date" className='focus-visible:shadow-none focus-visible:ring-0 focus-visible:outline-none focus-visible:border-[#eee] dark:border-[#333533]' value={next_billing_date} onChange={(e) => setNextBillingDate(e.target.value)} />
                                            </div>
                                            <div className='mb-3'>
                                                <Label htmlFor="amount" className='mb-2 text-gray-800 dark:text-[#f6fff8]'>Amount</Label>
                                                <Input type="text" value={amount} className='focus-visible:shadow-none focus-visible:ring-0 focus-visible:outline-none focus-visible:border-[#eee] dark:border-[#333533]' onChange={(e) => setAmount(e.target.value)} />
                                            </div>
                                            <div className='mb-3'>
                                                <Select value={currency} onValueChange={(e) => setCurrency(e)}>
                                                    <SelectTrigger className="w-full cursor-pointer text-gray-800 dark:text-[#f6fff8] focus-visible:shadow-none focus-visible:ring-0 focus-visible:outline-none focus-visible:border-[#eee] dark:border-[#333533]">
                                                        <SelectValue placeholder="Select a currency" />
                                                    </SelectTrigger>
                                                    <SelectContent className="dark:bg-[#333533] dark:text-[#f6fff8]">
                                                        <SelectGroup>
                                                            <SelectLabel className='dark:text-[#f6fff8]'>Currencies</SelectLabel>
                                                            {currencies?.map((x) => (
                                                                <SelectItem className="hover:dark:bg-[#212529] focus:dark:bg-[#212529]" key={x?.symbol} value={x?.code}>{x?.name}</SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="flex items-center space-x-2 mb-3">
                                                <Checkbox id="terms" checked={auto_renew} onCheckedChange={toggleCheckbox} className='cursor-pointer' />
                                                <label
                                                    htmlFor="terms"
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-800 dark:text-[#f6fff8]"
                                                >
                                                    Auto renew?
                                                </label>
                                            </div>
                                        </>
                                }

                                <Button type="submit" disabled={addSubLoading} className='btn w-full shadow-none cursor-pointer'>{addSubLoading ? 'Adding...' : 'Add subscription'}</Button>
                            </form>
                        </div>
                    </main>

            }
        </>
    )
}