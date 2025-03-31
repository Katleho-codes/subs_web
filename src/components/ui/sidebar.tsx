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


import { useAuth } from "@/hooks/useAuth";
import { Bars4Icon } from "@heroicons/react/24/outline";
import Navbar from "./navbar";


const Sidebar = () => {
    const { user, loading, googleLogin, logout } = useAuth()
    return (
        <div>
            <Sheet>
                <SheetTrigger asChild>
                    <Button className="outline-none bg-white border shadow-none hover:bg-white active:bg-white focus:bg-white border-none lg:hidden">
                        <Bars4Icon className="h-6 w-6 text-slate-800" />
                    </Button>
                </SheetTrigger>
                <SheetContent className="flex flex-col h-full">
                    <SheetHeader>
                        <SheetTitle className="overflow-hidden w-full text-sm text-left">
                            {user?.displayName}
                        </SheetTitle>
                    </SheetHeader>

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
            {/* <Link href="/" className="no-underline hover:no-underline cursor-pointer">
                <Image
                    src={"/church_logo.jpeg"}
                    alt="Jubilee Harvest International logo"
                    width={60}
                    height={60}
                />
            </Link> */}

        </div>
    );
};

export default Sidebar;