'use client'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import Sidebar from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/useAuth';
import useGetSubscriptions from '@/hooks/useGetSubscriptions';
import { TGetubs } from '@/lib/types';
import { TrashIcon } from '@heroicons/react/24/outline';
// import moment from 'moment';
import moment from 'moment-timezone';

import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import useDeleteSubscription from '@/hooks/useDeleteSubscription';
import useUpdateSubscription from '@/hooks/useUpdateSubscriptions';
import cycles from '@/lib/billing_cycles';
import currencies from '@/lib/currencies';
import calculateDaysBetweenDates from "@/lib/date_difference";
import { datetimestamp } from "@/lib/datetime";
import categories from '@/lib/subscription_categories';
import { Timestamp } from "firebase/firestore";
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';


const SubscriptionScreen = () => {
    const { user, googleLogin } = useAuth();
    const { subs, subsLoading } = useGetSubscriptions()
    const [selectedSub, setSelectedSub] = useState<TGetubs | null>(null); // Store selected subscription
    const [isEditing, setIsEditing] = useState(false);
    const [sub_name, setSubName] = useState<string | null | undefined>("")
    const [plan_name, setPlanName] = useState<string | null | undefined>("")
    const [amount, setAmount] = useState<string | null | undefined>()
    const [category, setCategory] = useState<string | null | undefined>("")
    const [billing_cycle, setBillingCycle] = useState<string | undefined>("")
    const [start_date, setStartDate] = useState<string | null | undefined>("")
    const [next_billing_date, setNextBillingDate] = useState<string | null | undefined>("")
    const [currency, setCurrency] = useState<string | null | undefined>("")
    const [auto_renew, setAutoRenew] = useState<boolean | null | undefined>(false)
    const { updateSubscription, updateSubscriptionLoading } = useUpdateSubscription()
    const { deleteSubscription } = useDeleteSubscription();
    const [deleteSubAlert, setDeleteSubAlert] = useState(false)
    const toggleCheckbox = () => setAutoRenew(previousState => !previousState);
    const [subToDelete, setSubToDelete] = useState<string | null>(null);
    const [dateFrom, setDateFrom] = useState("")
    const [dateTo, setDateTo] = useState("")

    // const { token, notification } = useSubscriptionNotifications();

    // useEffect(() => {
    //     if (notification) {
    //         new Notification(notification.notification.title, {
    //             body: notification.notification.body,
    //             icon: notification.notification.image || /logo192.png,
    //         });
    //     }
    // }, [notification]);
    // Function to show notification if subscription is due in less than 5 days
    const showNotificationIfLessThanFiveDays = async () => {
        const sentNotifications = JSON.parse(localStorage.getItem("sentNotifications") || "{}");

        if (subs && subs?.length > 0) {
            for (const sub of subs) {
                const next_billing_date = moment(sub?.next_billing_date);

                // Calculate days until next billing date
                const daysUntilNextBilling = calculateDaysBetweenDates(datetimestamp, next_billing_date);

                const today = moment(datetimestamp).format("YYYY-MM-DD");
                if (sentNotifications[sub?.sub_name] === today) {
                    continue; // Skip if the notification for today has already been sent
                }

                let message = null;
                if (daysUntilNextBilling < 0) {
                    message = `Your ${sub?.sub_name} subscription has passed.`;
                } else if (daysUntilNextBilling === 0) {
                    message = `Your ${sub?.sub_name} subscription is due today.`;
                } else if (daysUntilNextBilling <= 5) {
                    message = `Your ${sub?.sub_name} subscription is due in ${daysUntilNextBilling} days.`;
                }

                if (message) {
                    // Send the notification
                    if (document.visibilityState === "visible") {
                        // Show Sonner notification if in the app
                        toast("Subscription Reminder", {
                            description: message,
                        });
                    } else {
                        // Show browser notification if app is in the background
                        if (Notification.permission === "granted") {
                            new Notification("Subscription Reminder", {
                                body: message,
                                icon: "/globe.png", // Customize the icon
                            });
                        }
                    }

                    // Mark this notification as sent for today
                    sentNotifications[sub?.sub_name] = today;
                    localStorage.setItem("sentNotifications", JSON.stringify(sentNotifications));
                }

                // Handle auto-renew logic (if needed)
                if (sub?.auto_renew) {
                    if (sub?.billing_cycle === "monthly") {
                        next_billing_date.add(1, "month");
                        // Send the notification for when subscription renews
                        if (document.visibilityState === "visible") {
                            // Show Sonner notification if in the app
                            toast("Subscription renewal", {
                                description: 'Subscription will now renew for the next month',
                            });
                        } else {
                            // Show browser notification if app is in the background
                            if (Notification.permission === "granted") {
                                new Notification("Subscription Reminder", {
                                    body: 'Subscription will now renew for the next month',
                                    icon: "/globe.png", // Customize the icon
                                });
                            }
                        }
                    } else if (sub?.billing_cycle === "weekly") {
                        next_billing_date.add(1, "week");
                        // Send the notification for when subscription renews
                        if (document.visibilityState === "visible") {
                            // Show Sonner notification if in the app
                            toast("Subscription renewal", {
                                description: 'Subscription will now renew for the next week',
                            });
                        } else {
                            // Show browser notification if app is in the background
                            if (Notification.permission === "granted") {
                                new Notification("Subscription Reminder", {
                                    body: 'Subscription will now renew for the next week',
                                    icon: "/globe.png", // Customize the icon
                                });
                            }
                        }
                    } else if (sub?.billing_cycle === "yearly") {
                        next_billing_date.add(1, "year");
                        // Send the notification for when subscription renews
                        if (document.visibilityState === "visible") {
                            // Show Sonner notification if in the app
                            toast("Subscription renewal", {
                                description: 'Subscription will now renew for the next year',
                            });
                        } else {
                            // Show browser notification if app is in the background
                            if (Notification.permission === "granted") {
                                new Notification("Subscription Reminder", {
                                    body: 'Subscription will now renew for the next year',
                                    icon: "/globe.png", // Customize the icon
                                });
                            }
                        }
                    }
                    sub.next_billing_date = Timestamp.fromDate(next_billing_date.toDate()); // Save the updated next billing date as Firebase Timestamp
                }
            }
        }
    };

    // Call the showNotificationIfLessThanFiveDays function when the component mounts or subscriptions change
    useEffect(() => {
        showNotificationIfLessThanFiveDays();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [subs]); // Re-run this logic whenever the subs change


    // console.log(moment(datetimestamp).format('MMMM'))
    const handleCardView = (sub: TGetubs) => {
        setSelectedSub(sub); setIsEditing(false)
    };
    const handleCardEdit = (sub: TGetubs) => {
        setSelectedSub(sub);
        setIsEditing(true); // Enable editing mode
    };
    const handleCardDelete = async () => {
        if (!subToDelete) return;
        try {
            await deleteSubscription("subscriptions", subToDelete); // Call Firebase delete function
            toast.success("Subscription deleted!");
        } catch (error) {
            console.error("Error deleting subscription:", error);
            toast.error("Failed to delete subscription.");
        } finally {
            setDeleteSubAlert(false); // Close dialog
            setSubToDelete(null); // Reset state
        }
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
            // Convert the Firebase Timestamp to a JavaScript Date when setting state

            setStartDate(memoizedSelectedSub?.start_date);
            // const secondsNextBillDate = memoizedSelectedSub?.next_billing_date?.seconds ?? 0;
            // const nextBillDate = moment(secondsNextBillDate * 1000).format('YYYY-MM-DD');
            setNextBillingDate(memoizedSelectedSub?.next_billing_date);
            setAutoRenew(memoizedSelectedSub.auto_renew);
        }
    }, [memoizedSelectedSub]);

    const updateData = async () => {
        const payload = {
            sub_name,
            plan_name,
            amount,
            category,
            billing_cycle,
            // ✅ Convert Date back to Firebase Timestamp Before Updating
            // start_date: start_date ? { seconds: Math.floor(start_date.getTime() / 1000), nanoseconds: 0 } : null,
            // next_billing_date: next_billing_date ? { seconds: Math.floor(next_billing_date.getTime() / 1000), nanoseconds: 0 } : null,
            start_date,
            next_billing_date,
            currency,
            auto_renew
        };

        await updateSubscription("subscriptions", selectedSub?.id, payload)
    }

    const filteredData = useMemo(() => {
        if (!subs) return [];

        
    }, [second])

    // allow filter by due soon, hight to low, or low to high
    // filter by date from to date to
    // filter by category
    // reset filters
    // search bar
    // Sort by

    return (
        <>

            {
                !user ?
                    <Button onClick={googleLogin}>Sign in with Google</Button> :

                    <main>
                        <Sidebar />
                        <div className='container max-w-full lg:w-6xl lg:min-w-w-6xl mx-auto p-2'>
                            <div className="flex gap-2">
                                <div className="flex gap-2">
                                    <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                                    <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                                </div>
                                <Select>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Filter by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Filters</SelectLabel>
                                            <SelectItem value="apple">Due soon</SelectItem>
                                            <SelectItem value="banana">Banana</SelectItem>
                                            <SelectItem value="blueberry">Blueberry</SelectItem>
                                            <SelectItem value="grapes">Grapes</SelectItem>
                                            <SelectItem value="pineapple">Pineapple</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <Button>Reset filters</Button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                                {/* {token && <p>Your FCM Token: {token}</p>} */}
                                {
                                    subsLoading ? <p className='text-gray-800 font-semibold'>Loading subs...</p> :
                                        <>
                                            {
                                                subs && subs?.length > 0 ?

                                                    <>
                                                        {
                                                            subs?.map((x) => (
                                                                <div className="border p-4 rounded-md shadow-lg cursor-pointer" key={x.id}>
                                                                    <div className='flex items-center justify-between'>
                                                                        <div>
                                                                            <h3 className="text-lg font-bold mb-2">{x.sub_name}</h3>
                                                                            <p className="leading-2 mb-2">Due: {x?.next_billing_date}</p>
                                                                        </div>
                                                                        <Button className='cursor-pointer' onClick={() => {
                                                                            setSubToDelete(x.id); // Set the subscription ID BEFORE opening the dialog
                                                                            setDeleteSubAlert(true);
                                                                        }} variant="outline"><TrashIcon className="h-4 w-4" /></Button>
                                                                    </div>

                                                                    <p className="mb-2">{x.plan_name}</p>
                                                                    <div className='flex gap-3'>
                                                                        <Button className='cursor-pointer' onClick={() => handleCardView(x)} variant="outline">View</Button>
                                                                        <Button className='cursor-pointer' onClick={() => handleCardEdit(x)} variant="default">Edit</Button>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        }

                                                    </>
                                                    : null
                                            }
                                        </>
                                }
                            </div>
                            {/* alert dialog  */}
                            <AlertDialog open={!!deleteSubAlert} onOpenChange={(open) => !open && setDeleteSubAlert(false)}>
                                {/* <AlertDialogTrigger>Open</AlertDialogTrigger> */}
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete your account
                                            and remove your data from our servers.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleCardDelete}>Continue</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

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
                                                {selectedSub?.start_date ? selectedSub?.start_date
                                                    : moment(selectedSub?.start_date.seconds * 1000).format('MMMM Do YYYY, h:mm:ss a')
                                                }
                                            </p>

                                            <p><strong>Next Billing Date:</strong>
                                                {selectedSub?.next_billing_date ? selectedSub?.next_billing_date :
                                                    moment(selectedSub?.next_billing_date?.seconds * 1000).format('MMMM Do YYYY, h:mm:ss a')
                                                }
                                            </p>
                                            {/* Add more fields as necessary */}
                                        </div>) :

                                            (
                                                <>
                                                    <form>
                                                        <div className='mb-3'>
                                                            <Label htmlFor="sub_name" className='mb-2 text-gray-800'>Subscription name</Label>
                                                            <Input type="text" className='focus-visible:shadow-none focus-visible:ring-0 focus-visible:outline-none focus-visible:border-[#eee]' value={sub_name || ""} onChange={(e) => setSubName(e.target.value)} />
                                                        </div>
                                                        <div className='mb-3'>
                                                            <Select value={category || ""} onValueChange={(e) => setCategory(e)}>
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


                                                        <>

                                                            <div className='mb-3'>
                                                                <Label htmlFor="plan_name" className='mb-2 text-gray-800'>Plan name e.g. Premium</Label>
                                                                <Input type="text" value={plan_name || ""} className='focus-visible:shadow-none focus-visible:ring-0 focus-visible:outline-none focus-visible:border-[#eee]' onChange={(e) => setPlanName(e.target.value)} />
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
                                                            {/* <div className='mb-3'>
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
                                                            </div> */}
                                                            <div className='mb-3'>
                                                                <Label htmlFor='start_date'>Start date</Label>
                                                                <Input type="date" name="start_date" value={start_date || ""} onChange={(e) => setStartDate(e.target.value)} />
                                                            </div>
                                                            <div className='mb-3'>
                                                                <Label htmlFor='next_billing_date'>Due date</Label>
                                                                <Input type="date" name="next_billing_date" value={next_billing_date || ""} onChange={(e) => setNextBillingDate(e.target.value)} />
                                                            </div>
                                                            <div className='mb-3'>
                                                                <Label htmlFor="amount" className='mb-2 text-gray-800'>Amount</Label>
                                                                <Input type="text" value={amount || ""} className='focus-visible:shadow-none focus-visible:ring-0 focus-visible:outline-none focus-visible:border-[#eee]' onChange={(e) => setAmount(e.target.value)} />
                                                            </div>
                                                            <div className='mb-3'>
                                                                <Select value={currency || ""} onValueChange={(e) => setCurrency(e)}>
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
                                                                <Checkbox id="terms" checked={auto_renew || false} onCheckedChange={toggleCheckbox} className='cursor-pointer' />
                                                                <label
                                                                    htmlFor="terms"
                                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                                >
                                                                    Auto renew?
                                                                </label>
                                                            </div>
                                                        </>


                                                        <Button type="button" className='bg-gray-800 w-full shadow-none cursor-pointer' disabled={updateSubscriptionLoading} onClick={updateData}>{updateSubscriptionLoading ? 'Updating...' : 'Update subscription'}</Button>
                                                    </form>
                                                </>

                                            )}
                                    {/* <DialogClose asChild>
                                        <Button variant="outline">Close</Button>
                                    </DialogClose> */}
                                    {/* Show Edit button in View Mode */}
                                    {!isEditing && (
                                        <Button className='cursor-pointer' onClick={() => setIsEditing(true)} variant="default">
                                            Edit details
                                        </Button>
                                    )}
                                </DialogContent>
                            </Dialog>
                        </div >
                    </main >
            }
        </>
    )
}

export default SubscriptionScreen