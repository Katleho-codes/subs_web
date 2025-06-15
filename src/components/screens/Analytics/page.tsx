"use client"
import { Button } from '@/components/ui/button';
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import Sidebar from '@/components/ui/sidebar';
import useAddBudget from '@/hooks/useAddBudget';
import { useAuth } from '@/hooks/useAuth';
import useGetBudget from '@/hooks/useGetBudget';
import useGetSubscriptions from '@/hooks/useGetSubscriptions';
import { datetimestamp } from '@/lib/datetime';
import months from '@/lib/months';
import moment from 'moment';
import React, { useState } from 'react';
import NotLoggedIn from '../NotLoggedIn/page';

export default function AnalyticsScreen() {
    const { user, } = useAuth();
    const { subs } = useGetSubscriptions()
    const { budget } = useGetBudget()
    const { addBudget, addBudgetLoading } = useAddBudget()
    const [amount, setAmount] = useState<number | undefined>()
    const [month, setMonth] = useState("")
    const [year] = useState(moment(datetimestamp).format("YYYY"))
    const [openAddBudgetModal, setOpenAddBudgetModal] = useState(false)
    const [dateFrom, setDateFrom] = useState("")
    const [dateTo, setDateTo] = useState("")
    const [openSubListModal, setOpenSubListModal] = useState(false);
    const [selectedFilterType, setSelectedFilterType] = useState<null | string>(null);
    const handleResetFilters = () => {
        setDateTo("")
        setDateFrom("")
    }

    const sendData = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        const created_at = datetimestamp
        const payload = {
            amount, month, year, created_at
        }
        await addBudget(payload)
    }
    // const totalSubAmount = subs?.reduce((acc, item) => {
    //     return acc + Number(item?.amount || 0);
    // }, 0)
    // const budgetLeft = budget?.amount - totalSubAmount;


    const filteredSubs = subs?.filter(sub => {
        const taskDate = moment(sub?.created_at).format("YYYY-MM-DD");

        // Only filter if both dates are selected
        if (dateFrom && dateTo) {
            return taskDate >= dateFrom && taskDate <= dateTo;
        }

        // Otherwise, return all
        return true;
    });
    const getFilteredSubsByType = (type: string | undefined) => {
        switch (type) {
            case 'unpaid':
                return filteredSubs?.filter(sub => sub?.status?.toLowerCase() === "unpaid");
            case 'canceled':
                return filteredSubs?.filter(sub => sub?.status?.toLowerCase() === "canceled");
            case 'autoRenew':
                return filteredSubs?.filter(sub => sub?.auto_renew === true);
            case 'active':
                return filteredSubs?.filter(sub => sub?.status?.toLowerCase() !== "canceled");
            default:
                return filteredSubs;
        }
    };

    // Count how many subscriptions are unpaid
    const unpaidSubs = filteredSubs?.filter(sub => sub?.status?.toLowerCase() === "unpaid")?.length || 0;

    // Count how many subscriptions are canceled
    const canceledSubs = filteredSubs?.filter(sub => sub?.status?.toLowerCase() === "canceled")?.length || 0;

    // Count how many subscriptions are auto-renew
    const autoRenewSubs = filteredSubs?.filter(sub => sub?.auto_renew === true)?.length || 0;

    // Count how many subscriptions are active (not canceled)
    const activeSubs = filteredSubs?.filter(sub => sub?.status?.toLowerCase() !== "canceled")?.length || 0;

    // Group and calculate total amount by category
    const categoryTotals = filteredSubs?.reduce((acc, sub) => {
        const category = sub.category || "Uncategorized";
        const amount = Number(sub.amount || 0);
        acc[category] = (acc[category] || 0) + amount;
        return acc;
    }, {} as Record<string, number>);

    // Get highest and lowest spending categories
    const categoryEntries = Object.entries(categoryTotals || {}) as [string, number][];
    const highestCategory = [...categoryEntries].sort(
        (a: [string, number], b: [string, number]) => b[1] - a[1]
    )[0];

    const lowestCategory = [...categoryEntries].sort(
        (a: [string, number], b: [string, number]) => a[1] - b[1]
    )[0];


    return (
        <>
            {
                !user ?
                    <NotLoggedIn /> :
                    <main className="dark:bg-[#333533] h-screen">
                        <Sidebar />
                        <div className='min-w-80 max-w-5xl container p-2 mx-auto'>

                            <div className="flex lg:flex-row flex-col my-3 gap-2">
                                <div className="flex gap-2">
                                    <Input type="date" className='focus-visible:shadow-none focus-visible:ring-0 focus-visible:outline-none focus-visible:border-[#eee] dark:border-[#333533]' value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                                    <Input type="date" className='focus-visible:shadow-none focus-visible:ring-0 focus-visible:outline-none focus-visible:border-[#eee] dark:border-[#333533]' value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                                </div>
                                {/* <Input type="date" className='focus-visible:border-gray-100 focus-visible:outline-none focus-visible:ring-0 border-gray-200 dark:text-[#f6fff8]' value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                                <Input type="date" className='focus-visible:border-gray-100 focus-visible:outline-none focus-visible:ring-0 border-gray-200 dark:text-[#f6fff8]' value={dateTo} onChange={(e) => setDateTo(e.target.value)} /> */}
                                <Button type="button" className='bg-[#dc2f02] hover:bg-[#e85d04] cursor-pointer dark:text-[#f6fff8]' onClick={handleResetFilters}>Reset filters</Button>

                                <Button className='btn' onClick={() => setOpenAddBudgetModal(true)}>Add budget</Button>
                            </div>
                            <h1 className="text-gray-800 font-medium my-2 dark:text-[#f6fff8]">Your budget for {moment(datetimestamp).format("MMMM")} {budget?.amount}</h1>
                            {/* <h2>Used so far {totalSubAmount}</h2>
                            <h2>Left {budgetLeft}</h2> */}

                            {/* Dialog for displaying subscription details */}
                            <Dialog open={!!openAddBudgetModal} onOpenChange={(open: null | boolean) => !open && setOpenAddBudgetModal(false)}>
                                <DialogTrigger asChild>
                                    {/* Empty trigger, Dialog is opened manually by card click */}
                                </DialogTrigger>

                                <DialogContent className='dark:bg-[#212529]'>
                                    <DialogTitle className='text-gray-800 dark:text-[#6c757d]'>{"Create budget"}</DialogTitle>

                                    <>
                                        <form>
                                            <div className='mb-3'>
                                                <Label htmlFor="sub_name" className='mb-2 text-gray-800 dark:text-[#f6fff8]'>Type budget here</Label>
                                                <Input type="number" className='focus-visible:shadow-none focus-visible:ring-0 focus-visible:outline-none focus-visible:border-[#eee] dark:border-[#333533]' value={amount || ""} onChange={(e) => setAmount(Number(e.target.value))} />
                                            </div>
                                            <div className='mb-3'>
                                                <Select value={month || ""} onValueChange={(e) => setMonth(e)}>
                                                    <SelectTrigger className="w-full cursor-pointer text-gray-800 dark:text-[#f6fff8] focus-visible:shadow-none focus-visible:ring-0 focus-visible:outline-none focus-visible:border-[#eee] dark:border-[#333533]">
                                                        <SelectValue placeholder="Select a month" />
                                                    </SelectTrigger>
                                                    <SelectContent className="dark:bg-[#333533] dark:text-[#f6fff8]">
                                                        <SelectGroup>
                                                            <SelectLabel className='dark:text-[#f6fff8]'>Months</SelectLabel>
                                                            {months?.map((x) => (
                                                                <SelectItem className="hover:dark:bg-[#212529] focus:dark:bg-[#212529]" key={x?.id} value={x?.name}>{x?.name}</SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <Button type="button" className='btn w-full shadow-none cursor-pointer' disabled={addBudgetLoading} onClick={sendData}>{addBudgetLoading ? 'Adding...' : 'Create budget'}</Button>
                                        </form>
                                    </>




                                </DialogContent>
                            </Dialog>
                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
                                <Card className='dark:bg-[#333533]'>
                                    <CardHeader>
                                        <CardTitle className='text-gray-800 dark:text-[#f6fff8]'>Total Subscriptions</CardTitle>
                                        <CardDescription className="text-gray-500 dark:text-[#f6fff8]">{subs?.length || 0}</CardDescription>
                                    </CardHeader>
                                </Card>

                                <Card className="cursor-pointer dark:bg-[#333533]" onClick={() => {
                                    setSelectedFilterType('active');
                                    setOpenSubListModal(true);
                                }}>
                                    <CardHeader>
                                        <CardTitle className='text-gray-800 dark:text-[#f6fff8]'>Active Subscriptions</CardTitle>
                                        <CardDescription className="text-gray-500 dark:text-[#f6fff8]">{activeSubs}</CardDescription>
                                    </CardHeader>
                                </Card>

                                <Card className="cursor-pointer dark:bg-[#333533]" onClick={() => {
                                    setSelectedFilterType('unpaid');
                                    setOpenSubListModal(true);
                                }}>
                                    <CardHeader>
                                        <CardTitle className='text-gray-800 dark:text-[#f6fff8]'>Unpaid Subscriptions</CardTitle>
                                        <CardDescription className="text-gray-500 dark:text-[#f6fff8]">{unpaidSubs}</CardDescription>
                                    </CardHeader>
                                </Card>

                                <Card className="cursor-pointer dark:bg-[#333533]" onClick={() => {
                                    setSelectedFilterType('canceled');
                                    setOpenSubListModal(true);
                                }}>
                                    <CardHeader>
                                        <CardTitle className='text-gray-800 dark:text-[#f6fff8]'>Canceled Subscriptions</CardTitle>
                                        <CardDescription className="text-gray-500 dark:text-[#f6fff8]">{canceledSubs}</CardDescription>
                                    </CardHeader>
                                </Card>

                                <Card className="cursor-pointer dark:bg-[#333533]" onClick={() => {
                                    setSelectedFilterType('autoRenew');
                                    setOpenSubListModal(true);
                                }}>
                                    <CardHeader>
                                        <CardTitle className='text-gray-800 dark:text-[#f6fff8]'>Auto Renew Subscriptions</CardTitle>
                                        <CardDescription className="text-gray-500 dark:text-[#f6fff8]">{autoRenewSubs}</CardDescription>
                                    </CardHeader>
                                </Card>

                                {highestCategory && (
                                    <Card className="dark:bg-[#333533]">
                                        <CardHeader>
                                            <CardTitle className='text-gray-800 dark:text-[#f6fff8]'>Top Category</CardTitle>
                                            <CardDescription className="text-gray-500">{highestCategory[0]} — {highestCategory[1]}</CardDescription>
                                        </CardHeader>
                                    </Card>
                                )}

                                {lowestCategory && (
                                    <Card className="dark:bg-[#333533]">
                                        <CardHeader>
                                            <CardTitle className='text-gray-800 dark:text-[#f6fff8]'>Lowest Category</CardTitle>
                                            <CardDescription className="text-gray-500">{lowestCategory[0]} — {lowestCategory[1]}</CardDescription>
                                        </CardHeader>
                                    </Card>
                                )}
                            </div>
                            <Dialog open={openSubListModal} onOpenChange={(open) => !open && setOpenSubListModal(false)}>
                                <DialogContent className='max-w-2xl dark:bg-[#212529] border-[#212529]'>
                                    <DialogTitle className='text-gray-800  dark:text-[#6c757d]'>
                                        {selectedFilterType === 'unpaid' && "Unpaid Subscriptions"}
                                        {selectedFilterType === 'canceled' && "Canceled Subscriptions"}
                                        {selectedFilterType === 'autoRenew' && "Auto Renew Subscriptions"}
                                        {selectedFilterType === 'active' && "Active Subscriptions"}
                                    </DialogTitle>

                                    <div className='grid gap-3 max-h-[60vh] overflow-auto'>
                                        {getFilteredSubsByType(selectedFilterType || "")?.map((sub, index) => (
                                            <Card key={index} className='dark:bg-[#333533] border-[#333533]'>
                                                <CardHeader>
                                                    <CardTitle className='text-gray-800 dark:text-[#f6fff8]'>{sub.sub_name}</CardTitle>
                                                    <CardDescription className="text-gray-500 dark:text-[#f6fff8]">Status: {sub.status} | Amount: {sub.amount} | Category: {sub.category}</CardDescription>
                                                </CardHeader>
                                            </Card>
                                        ))}
                                        {getFilteredSubsByType(selectedFilterType || "")?.length === 0 && (
                                            <p className='text-gray-500'>No subscriptions found.</p>
                                        )}
                                    </div>
                                </DialogContent>
                            </Dialog>

                        </div>
                    </main >
            }


        </>
    )
}
