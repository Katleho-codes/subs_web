"use client"
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import Sidebar from '@/components/ui/sidebar';
import useAddBudget from '@/hooks/useAddSusbcription';
import { useAuth } from '@/hooks/useAuth';
import { datetimestamp } from '@/lib/datetime';
import months from '@/lib/months';
import moment from 'moment';
import React, { useState } from 'react'

export default function AnalyticsScreen() {
    const { user, googleLogin, logout } = useAuth();
    const { addBudget, addBudgetLoading } = useAddBudget()
    const [budget, setBudget] = useState<number | undefined>()
    const [month, setMonth] = useState("")
    const [year] = useState(moment(datetimestamp).format("YYYY"))
    const [openAddBudgetModal, setOpenAddBudgetModal] = useState(false)


    const sendData = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        const created_at = datetimestamp
        const payload = {
            budget, month, year, created_at
        }
        // await addBudget(payload)
        console.log(payload)
    }
    return (
        <>
            {
                !user ?
                    <Button onClick={googleLogin}>Sign in with Google</Button> :
                    <main>
                        <Sidebar />
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
                                            <Input type="number" className='focus-visible:shadow-none focus-visible:ring-0 focus-visible:outline-none focus-visible:border-[#eee]' value={budget || ""} onChange={(e) => setBudget(Number(e.target.value))} />
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
