'use client'
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Sidebar from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/useAuth';
import useGetSubscriptions from '@/hooks/useGetSubscriptions';
import { TGetubs } from '@/lib/types';
import moment from 'moment';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from "@/components/ui/calendar";
import { cn } from '@/lib/utils';
import { CalendarIcon } from '@heroicons/react/24/outline';

import { useEffect, useMemo, useState } from 'react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import categories from '@/lib/subscription_categories';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import cycles from '@/lib/billing_cycles';
import currencies from '@/lib/currencies';
import useUpdateSubscription from '@/hooks/useUpdateSubscriptions';
const SubscriptionScreen = () => {
    const { user, googleLogin } = useAuth();
    const { subs, subsLoading } = useGetSubscriptions()
    const [selectedSub, setSelectedSub] = useState<TGetubs | null>(null); // Store selected subscription
    const [isEditing, setIsEditing] = useState(false);
    const [sub_name, setSubName] = useState("")
    const [plan_name, setPlanName] = useState("")
    const [amount, setAmount] = useState<number | undefined>()
    const [category, setCategory] = useState("")
    const [billing_cycle, setBillingCycle] = useState<string | undefined>("")
    const [start_date, setStartDate] = useState<Date>()
    const [next_billing_date, setNextBillingDate] = useState<Date>()
    const [currency, setCurrency] = useState("")
    const [is_trial, setIsTrial] = useState(false)
    const [trial_start_date, setTrialStartDate] = useState<Date>()
    const [trial_end_date, setTrialEndDate] = useState<Date>()
    const [auto_renew, setAutoRenew] = useState(false)
    const { updateSubscription, updateSubscriptionLoading } = useUpdateSubscription()
    const toggleCheckbox = () => setAutoRenew(previousState => !previousState);
    const toggleTrialCheckbox = () => {
        setIsTrial(previousState => !previousState);
    }
    const handleCardView = (sub: TGetubs) => {
        setSelectedSub(sub); setIsEditing(false)
    };
    const handleCardEdit = (sub: TGetubs) => {
        setSelectedSub(sub)
        setIsEditing(false)
    };
    const memoizedSelectedSub = useMemo(() => selectedSub, [selectedSub]);

    useEffect(() => {
        if (memoizedSelectedSub) {
            setSubName(memoizedSelectedSub.sub_name);
            setPlanName(memoizedSelectedSub.plan_name);
            setAmount(memoizedSelectedSub.amount);
            setCategory(memoizedSelectedSub.categories);
            setBillingCycle(memoizedSelectedSub.billing_cycle);
            setCurrency(memoizedSelectedSub.currency);
        }
    }, [memoizedSelectedSub]);
    const updateData = async () => {
        const payload = {};

        await updateSubscription("subscriptions", selectedSub?.id, payload)
    }

    return (
        <>

            {
                !user ?
                    <Button onClick={googleLogin}>Sign in with Google</Button> :

                    <main>
                        <Sidebar />
                        <div className='container max-w-full lg:w-6xl lg:min-w-w-6xl mx-auto p-2'>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                                {
                                    subsLoading ? <p className='text-gray-800 font-semibold'>Loading subs...</p> :
                                        <>
                                            {
                                                subs && subs?.length > 0 ?

                                                    <>
                                                        {
                                                            subs?.map((x) => (
                                                                <div className="border p-4 rounded-md shadow-lg cursor-pointer" key={x.id}>
                                                                    <h3 className="text-lg font-bold">{x.sub_name}</h3>
                                                                    <p>{x.plan_name}</p>
                                                                    <Button className='cursor-pointer' onClick={() => handleCardView(x)} variant="outline">View</Button>
                                                                    <Button className='cursor-pointer' onClick={() => handleCardEdit(x)} variant="default">Edit</Button>
                                                                </div>
                                                            ))
                                                        }

                                                    </>
                                                    : null
                                            }
                                        </>
                                }
                            </div>
                            {/* Dialog for displaying subscription details */}
                            <Dialog open={!!selectedSub} onOpenChange={(open) => !open && setSelectedSub(null)}>
                                <DialogTrigger asChild>
                                    {/* Empty trigger, Dialog is opened manually by card click */}
                                </DialogTrigger>

                                <DialogContent>
                                    <DialogTitle>{isEditing ? "Edit subscription" : "Subscription Details"}</DialogTitle>
                                    {
                                        !isEditing ? (<div>
                                            <p><strong>Name:</strong> {selectedSub?.sub_name}</p>
                                            <p><strong>Plan:</strong> {selectedSub?.plan_name}</p>
                                            <p><strong>Amount:</strong> {selectedSub?.amount}</p>
                                            <p>
                                                <strong>Start Date:</strong>
                                                {selectedSub?.start_date ?
                                                    moment(selectedSub?.start_date.seconds * 1000).format('MMMM Do YYYY, h:mm:ss a')
                                                    : 'Date not available'}
                                            </p>

                                            <p><strong>Next Billing Date:</strong> {selectedSub?.next_billing_date ?
                                                moment(selectedSub?.next_billing_date.seconds * 1000).format('MMMM Do YYYY, h:mm:ss a')
                                                : 'Date not available'}</p>
                                            {/* Add more fields as necessary */}
                                        </div>) :

                                            (
                                                <>
                                                    <form>
                                                        <div className='mb-3'>
                                                            <Label htmlFor="sub_name" className='mb-2 text-gray-800'>Subscription name</Label>
                                                            <Input type="text" className='focus-visible:shadow-none focus-visible:ring-0 focus-visible:outline-none focus-visible:border-[#eee]' value={sub_name} onChange={(e) => setSubName(e.target.value)} />
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
                                                                        <Label htmlFor="plan_name" className='mb-2 text-gray-800'>Plan name e.g. Premium</Label>
                                                                        <Input type="text" value={plan_name} className='focus-visible:shadow-none focus-visible:ring-0 focus-visible:outline-none focus-visible:border-[#eee]' onChange={(e) => setPlanName(e.target.value)} />
                                                                    </div>
                                                                    <div className='mb-3'>
                                                                        <Select value={billing_cycle} onValueChange={(e) => setBillingCycle(e)}>
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
                                                                                        !start_date && "text-muted-foreground"
                                                                                    )}
                                                                                >
                                                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                                                    {start_date ? moment(start_date).format("LL") : <span>Start date</span>}
                                                                                </Button>
                                                                            </PopoverTrigger>
                                                                            <PopoverContent className="w-auto p-0">
                                                                                <Calendar
                                                                                    mode="single"
                                                                                    selected={start_date}
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
                                                                                        !next_billing_date && "text-muted-foreground"
                                                                                    )}
                                                                                >
                                                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                                                    {next_billing_date ? moment(next_billing_date).format("LL") : <span>Next billing date</span>}
                                                                                </Button>
                                                                            </PopoverTrigger>
                                                                            <PopoverContent className="w-auto p-0">
                                                                                <Calendar
                                                                                    mode="single"
                                                                                    selected={next_billing_date}
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
                                                                        <Checkbox id="terms" checked={auto_renew} onCheckedChange={toggleCheckbox} className='cursor-pointer' />
                                                                        <label
                                                                            htmlFor="terms"
                                                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                                        >
                                                                            Auto renew?
                                                                        </label>
                                                                    </div>
                                                                </>
                                                        }

                                                        <Button type="submit" className='bg-gray-800 w-full shadow-none cursor-pointer'>Add subscription</Button>
                                                    </form>
                                                </>

                                            )}
                                    <DialogClose asChild>
                                        <Button variant="outline">Close</Button>
                                    </DialogClose>
                                    {/* Show Edit button in View Mode */}
                                    {!isEditing && (
                                        <Button className='cursor-pointer' onClick={() => setIsEditing(true)} variant="default">
                                            Edit details
                                        </Button>
                                    )}
                                </DialogContent>
                            </Dialog>
                        </div>
                    </main>
            }
        </>
    )
}

export default SubscriptionScreen