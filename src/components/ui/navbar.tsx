"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { Button } from "./button";
export default function Navbar() {
    const { user, logout } = useAuth()
    console.log(user)
    const pathname = usePathname()
    const { setTheme } = useTheme()

    return (


        <nav className="hidden lg:flex h-[4rem] border items-center px-2 lg:px-3 dark:bg-[#212529] ">
            <div className="mx-auto flex gap-3 items-center">
                <Link href="/subscriptions" className={` ${pathname === "/subscriptions" ? 'text-[#e85d04] font-semibold' : 'text-gray-800 dark:text-[#f6fff8]'}`}>Subscriptions</Link>
                <Link href="/analytics" className={` ${pathname === "/analytics" ? 'text-[#e85d04] font-semibold' : 'text-gray-800 dark:text-[#f6fff8]'}`}>Analytics</Link>
                <Link href="/create_sub" className={` ${pathname === "/create_sub" ? 'text-[#e85d04] font-semibold' : 'text-gray-800 dark:text-[#f6fff8]'}`}>Create new</Link>
            </div>
            <div className="flex items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild className="cursor-pointer text-gray-800 dark:text-[#f6fff8] focus-visible:shadow-none focus-visible:ring-0 focus-visible:outline-none focus-visible:border-[#eee] dark:border-[#333533]">
                        <Button variant="outline" size="icon" className="shadow-none outline-none border-none">
                            <SunIcon className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90 text-gray-800" />
                            <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0 text-[#f6fff8]" />
                            <span className="sr-only">Toggle theme</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="dark:bg-[#333533] dark:text-[#f6fff8]">
                        <DropdownMenuItem onClick={() => setTheme("light")} className="hover:dark:bg-[#212529] focus:dark:bg-[#212529] dark:text-[#f6fff8] cursor-pointer">
                            Light
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("dark")} className="hover:dark:bg-[#212529] focus:dark:bg-[#212529] dark:text-[#f6fff8] cursor-pointer">
                            Dark
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("system")} className="hover:dark:bg-[#212529] focus:dark:bg-[#212529] dark:text-[#f6fff8] cursor-pointer">
                            System
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild className="cursor-pointer text-gray-800 dark:text-[#f6fff8] focus-visible:shadow-none focus-visible:ring-0 focus-visible:outline-none focus-visible:border-[#eee] dark:border-[#333533]">
                        <div className="rounded-full h-8 w-8 overflow-hidden shadow">
                            <Image src={user?.photoURL || ""} alt="" width={50} height={50} />
                        </div>
                        {/* <Avatar>
                        <AvatarImage src={user?.photoURL || ""} />
                    </Avatar> */}

                        {/* <Button variant="outline">{user?.photoURL}</Button> */}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 lg:mr-4 mr-2 dark:bg-[#333533] dark:text-[#f6fff8]">
                        <DropdownMenuLabel className="dark:text-[#f6fff8]">My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem className=" cursor-pointer hover:dark:bg-[#212529] focus:dark:bg-[#212529] dark:text-[#f6fff8]">
                                {user?.displayName}
                                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuItem className=" cursor-pointer hover:dark:bg-[#212529] focus:dark:bg-[#212529] dark:text-[#f6fff8]">
                                {user?.email}
                                <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem onClick={logout} className=" cursor-pointer hover:dark:bg-[#212529] focus:dark:bg-[#212529] dark:text-[#f6fff8]">
                            Log out
                            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav>

    )
}
