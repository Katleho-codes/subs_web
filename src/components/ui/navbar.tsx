"use client"

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";

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

    return (


        <nav className="hidden lg:flex h-[4rem] border items-center px-2">
            <div className="mx-auto flex gap-3 items-center">
                <Link href="/subscriptions">Subscriptions</Link>
                <Link href="/analytics">Analytics</Link>
                <Link href="/create_sub">Create new</Link>
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
