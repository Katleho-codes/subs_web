"use client"
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useAuth } from "@/hooks/useAuth";
import { Bars4Icon } from "@heroicons/react/24/outline";
import Navbar from "./navbar";


const Sidebar = () => {
    const { user, logout } = useAuth()
    console.log(user)
    const pathname = usePathname()
    return (
        <div>
            <Sheet>
                <SheetTrigger asChild className="mb-2">
                    <Button className="outline-none bg-transparent border shadow-none active:bg-transparent focus:bg-transparent border-none lg:hidden">
                        <Bars4Icon className="h-8 w-8 text-slate-800 dark:text-[#f6fff8]" />
                    </Button>
                </SheetTrigger>
                <SheetContent className="flex flex-col h-full dark:bg-[#212529]">
                    <SheetHeader>
                        <SheetTitle className="overflow-hidden w-full text-sm text-left">
                            {user?.displayName}
                        </SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col gap-3 items-center">
                        <Link href="/subscriptions" className={` ${pathname === "/subscriptions" ? 'text-[#e85d04] active:text-[#e85d04] focus:text-[#e85d04] font-semibold w-full px-4 py-2' : ' font-semibold text-gray-800 dark:text-[#f6fff8] w-full px-4 py-2'}`}>Subscriptions</Link>
                        <Link href="/analytics" className={` ${pathname === "/analytics" ? 'text-[#e85d04] active:text-[#e85d04] focus:text-[#e85d04] font-semibold w-full px-4 py-2' : ' font-semibold text-gray-800 dark:text-[#f6fff8]  w-full px-4 py-2'}`}>Analytics</Link>
                        <Link href="/create_sub" className={` ${pathname === "/create_sub" ? 'text-[#e85d04] active:text-[#e85d04] focus:text-[#e85d04] font-semibold w-full px-4 py-2' : ' font-semibold text-gray-800 dark:text-[#f6fff8]  w-full px-4 py-2'}`}>Create new</Link>
                    </div>

                    <SheetFooter>
                        <SheetClose asChild>
                            <Button onClick={logout}>
                                Logout
                            </Button>
                        </SheetClose>
                    </SheetFooter>
                </SheetContent>
            </Sheet>


            <Navbar />

        </div>
    );
};

export default Sidebar;