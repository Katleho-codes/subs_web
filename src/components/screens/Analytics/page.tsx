"use client"
import { Button } from '@/components/ui/button';
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
import React, { useState } from 'react'

export default function AnalyticsScreen() {
    const { user, googleLogin } = useAuth();
    const { subs, subsLoading } = useGetSubscriptions()
    const { budget, budgetLoading, getData } = useGetBudget()
    const { addBudget, addBudgetLoading } = useAddBudget()
    const [amount, setAmount] = useState<number | undefined>()
    const [month, setMonth] = useState("")
    const [year] = useState(moment(datetimestamp).format("YYYY"))
    const [openAddBudgetModal, setOpenAddBudgetModal] = useState(false)


    const sendData = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        const created_at = datetimestamp
        const payload = {
            amount, month, year, created_at
        }
        await addBudget(payload)
        // console.log(payload)
    }
    const totalSubAmount = subs?.reduce((acc, item) => {
        return acc + Number(item?.amount || 0);
    }, 0)
    const budgetLeft = budget?.amount - totalSubAmount;

    // show amount spend in the whole calendar year
    // show highest categories spent on
    // show lowest categories spent on
    // show how many subs are unpaid
    // how many canceled subs
    // how many subs are auto renew
    // how many active subscriptions (not canceled)
    return (
        <>
            {
                !user ?
                    <Button onClick={googleLogin}>Sign in with Google</Button> :
                    <main>
                        <Sidebar />
                        <h1>Your budget for {moment(datetimestamp).format("MMMM")} {budget?.amount}</h1>
                        <h2>Used so far {totalSubAmount}</h2>
                        <h2>Left {budgetLeft}</h2>
                        <Button onClick={() => setOpenAddBudgetModal(true)}>Open modal</Button>
                        {/* Dialog for displaying subscription details */}
                        <Dialog open={!!openAddBudgetModal} onOpenChange={(open: null | boolean) => !open && setOpenAddBudgetModal(false)}>
                            <DialogTrigger asChild>
                                {/* Empty trigger, Dialog is opened manually by card click */}
                            </DialogTrigger>

                            <DialogContent>
                                <DialogTitle>{"Create budget"}</DialogTitle>

                                <>
                                    <form>
                                        <div className='mb-3'>
                                            <Label htmlFor="sub_name" className='mb-2 text-gray-800'>Type budget here</Label>
                                            <Input type="number" className='focus-visible:shadow-none focus-visible:ring-0 focus-visible:outline-none focus-visible:border-[#eee]' value={amount || ""} onChange={(e) => setAmount(Number(e.target.value))} />
                                        </div>
                                        <div className='mb-3'>
                                            <Select value={month || ""} onValueChange={(e) => setMonth(e)}>
                                                <SelectTrigger className="w-full cursor-pointer text-gray-800 focus-visible:shadow-none focus-visible:ring-0 focus-visible:outline-none focus-visible:border-[#eee]">
                                                    <SelectValue placeholder="Select a month" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Months</SelectLabel>
                                                        {months?.map((x) => (
                                                            <SelectItem key={x?.id} value={x?.name}>{x?.name}</SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <Button type="button" className='bg-gray-800 w-full shadow-none cursor-pointer' disabled={addBudgetLoading} onClick={sendData}>{addBudgetLoading ? 'Adding...' : 'Create budget'}</Button>
                                    </form>
                                </>




                            </DialogContent>
                        </Dialog>
                    </main >
            }


        </>
    )
}
