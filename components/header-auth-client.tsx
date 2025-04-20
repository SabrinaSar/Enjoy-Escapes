"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Menu } from "lucide-react";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { signOutAction } from "@/app/actions";

export default function HeaderAuthClient() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="h-9 w-9">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Admin Menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem asChild>
          <Link href="/admin" className="cursor-pointer">
            Admin Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <form action={signOutAction} className="w-full">
            <Button
              type="submit"
              variant="ghost"
              className="w-full h-auto justify-start p-0 font-normal text-sm"
            >
              Sign out
            </Button>
          </form>
        </DropdownMenuItem>
        <DropdownMenuItem asChild></DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="px-2 py-1">
          <ThemeSwitcher />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
