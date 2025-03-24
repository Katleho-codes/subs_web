'use client'
import Container from '@/components/ui/container';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useAddSubscription from '@/hooks/useAddSusbcription';

import { datetimestamp } from '@/lib/datetime';
import React, { useState } from 'react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import moment from 'moment';
import categories from '@/lib/subscription_categories';
import cycles from '@/lib/billing_cycles';
import currencies from '@/lib/currencies';
import { useAuth } from '@/hooks/useAuth';

export default function CreateSubscriptionScreen() {
    const { user, googleLogin, logout } = useAuth();
    const { addSub, addSubLoading } = useAddSubscription()
    const [subName, setSubName] = useState("")
    const [planName, setPlanName] = useState("")
    const [amount, setAmount] = useState("")
    const [category, setCategory] = useState("")
    const [billingCycle, setBillingCycle] = useState("")
    const [startDate, setStartDate] = useState<Date>()
    const [nextBillingDate, setNextBillingDate] = useState<Date>()
    const [currency, setCurrency] = useState("")
    const [is_trial, setIsTrial] = useState(false)
    const [trial_start_date, setTrialStartDate] = useState<Date>()
    const [trial_end_date, setTrialEndDate] = useState<Date>()
    const [autoRenew, setAutoRenew] = useState(false)
    const toggleCheckbox = () => setAutoRenew(previousState => !previousState);
    const toggleTrialCheckbox = () => {
        setIsTrial(previousState => !previousState);
    }
    const created_at = datetimestamp
    const createSub = async (values: React.SyntheticEvent) => {
        values.preventDefault()
        const formatStartDate = moment(startDate).format("YYYY-MM-DD")
        const formatNextDate = moment(nextBillingDate).format("YYYY-MM-DD")
        const payload = {
            subName, category, planName, amount, userId: user?.uid,
            startDate: formatStartDate, nextBillingDate: formatNextDate, currency, autoRenew, created_at
        }
        await addSub(payload)

    }
    return (
        <>

            {
                !user ?
                    <Button onClick={googleLogin}>Sign in with Google</Button> :
                    <div className='container max-w-full lg:w-md lg:min-w-md mx-auto p-2'>
                        <form onSubmit={createSub}>
                            <div className='mb-3'>
                                <Label htmlFor="subName" className='mb-2 text-gray-800'>Subscription name</Label>
                                <Input type="text" className='focus-visible:shadow-none focus-visible:ring-0 focus-visible:outline-none focus-visible:border-[#eee]' value={subName} onChange={(e) => setSubName(e.target.value)} />
                            </div>
                            <div className='mb-3'>
                                <Select value={category} onValueChange={(e) => setCategory(e)}>
                                    <SelectTrigger className="w-full cursor-pointer text-gray-800 focus-visible:shadow-none focus-visible:ring-0 focus-visible:outline-none focus-visible:border-[#eee]">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Categories</SelectLabel>
                                            {categories?.map((x) => (
                                                <SelectItem key={x?.id} value={x?._name}>{x?._name}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center space-x-2 mb-3">
                                <Checkbox id="is_trial" checked={is_trial} onCheckedChange={toggleTrialCheckbox} className='cursor-pointer' />
                                <label
                                    htmlFor="is_trial"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Trial subscription? (Check for yes, leave blank for no)
                                </label>
                            </div>
                            {/* if trial */}
                            {
                                is_trial === true ?

                                    <>

                                        <div className='mb-3'>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full justify-start text-left font-normal cursor-pointer",
                                                            !trial_start_date && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {trial_start_date ? moment(trial_start_date).format("LL") : <span>Trial start date</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={trial_start_date}
                                                        onSelect={setTrialStartDate}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                        <div className='mb-3'>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full justify-start text-left font-normal cursor-pointer",
                                                            !trial_end_date && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {trial_end_date ? moment(trial_end_date).format("LL") : <span>Trial end date</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={trial_end_date}
                                                        onSelect={setTrialEndDate}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </>
                                    :
                                    <>

                                        <div className='mb-3'>
                                            <Label htmlFor="planName" className='mb-2 text-gray-800'>Plan name e.g. Premium</Label>
                                            <Input type="text" value={planName} className='focus-visible:shadow-none focus-visible:ring-0 focus-visible:outline-none focus-visible:border-[#eee]' onChange={(e) => setPlanName(e.target.value)} />
                                        </div>
                                        <div className='mb-3'>
                                            <Select value={billingCycle} onValueChange={(e) => setBillingCycle(e)}>
                                                <SelectTrigger className="w-full cursor-pointer text-gray-800 focus-visible:shadow-none focus-visible:ring-0 focus-visible:outline-none focus-visible:border-[#eee]">
                                                    <SelectValue placeholder="Select a billing cycle" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Billing cycles</SelectLabel>
                                                        {cycles?.map((x) => (
                                                            <SelectItem key={x?.id} value={x?._name}>{x?._name}</SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className='mb-3'>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full justify-start text-left font-normal cursor-pointer",
                                                            !startDate && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {startDate ? moment(startDate).format("LL") : <span>Start date</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={startDate}
                                                        onSelect={setStartDate}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                        <div className='mb-3'>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full justify-start text-left font-normal cursor-pointer",
                                                            !nextBillingDate && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {nextBillingDate ? moment(nextBillingDate).format("LL") : <span>Next billing date</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={nextBillingDate}
                                                        onSelect={setNextBillingDate}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                        <div className='mb-3'>
                                            <Label htmlFor="amount" className='mb-2 text-gray-800'>Amount</Label>
                                            <Input type="text" value={amount} className='focus-visible:shadow-none focus-visible:ring-0 focus-visible:outline-none focus-visible:border-[#eee]' onChange={(e) => setAmount(e.target.value)} />
                                        </div>
                                        <div className='mb-3'>
                                            <Select value={currency} onValueChange={(e) => setCurrency(e)}>
                                                <SelectTrigger className="w-full cursor-pointer focus-visible:shadow-none focus-visible:ring-0 focus-visible:outline-none focus-visible:border-[#eee]">
                                                    <SelectValue placeholder="Select a currency" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Currencies</SelectLabel>
                                                        {currencies?.map((x) => (
                                                            <SelectItem key={x?.symbol} value={x?.code}>{x?.name}</SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="flex items-center space-x-2 mb-3">
                                            <Checkbox id="terms" checked={autoRenew} onCheckedChange={toggleCheckbox} className='cursor-pointer' />
                                            <label
                                                htmlFor="terms"
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                Auto renew?
                                            </label>
                                        </div>
                                    </>
                            }

                            <Button type="submit" disabled={addSubLoading} className='bg-gray-800 w-full shadow-none cursor-pointer'>{addSubLoading ? 'Adding...' : 'Add subscription'}</Button>
                        </form>
                    </div>
            }
        </>
    )
}