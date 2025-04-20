"use client"

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { usePathname } from 'next/navigation'
import Link from "next/link";

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
export default function Navbar() {
    const { user, logout } = useAuth()
    const pathname = usePathname()
    return (


        <nav className="hidden lg:flex h-[4rem] border items-center px-2">
            <div className="mx-auto flex gap-3 items-center">
                <Link href="/subscriptions" className={` ${pathname === "/subscriptions" ? 'text-[#e85d04] font-semibold' : 'text-gray-800'}`}>Subscriptions</Link>
                <Link href="/analytics" className={` ${pathname === "/analytics" ? 'text-[#e85d04] font-semibold' : 'text-gray-800'}`}>Analytics</Link>
                <Link href="/create_sub" className={` ${pathname === "/create_sub" ? 'text-[#e85d04] font-semibold' : 'text-gray-800'}`}>Create new</Link>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Avatar>
                        <AvatarImage src={user?.photoURL || ""} />
                        {/* <AvatarFallback>CN</AvatarFallback> */}
                    </Avatar>

                    {/* <Button variant="outline">{user?.photoURL}</Button> */}
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mr-2">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem>
                            {user?.displayName}
                            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            {user?.email}
                            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={logout}>
                        Log out
                        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </nav>

    )
}
