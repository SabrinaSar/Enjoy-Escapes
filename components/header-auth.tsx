import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import HeaderAuthClient from "./header-auth-client";
import { Instagram } from "lucide-react";
import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { createClient } from "@/utils/supabase/server";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { signOutAction } from "@/app/actions";

export default async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!hasEnvVars) {
    return (
      <>
        <div className="flex gap-4 items-center">
          <div>
            <Badge
              variant={"default"}
              className="font-normal pointer-events-none"
            >
              Please update .env.local file with anon key and url
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button
              asChild
              size="sm"
              variant={"outline"}
              disabled
              className="opacity-75 cursor-none pointer-events-none"
            >
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button
              asChild
              size="sm"
              variant={"default"}
              disabled
              className="opacity-75 cursor-none pointer-events-none"
            >
              <Link href="/sign-up">Sign up</Link>
            </Button>
          </div>
        </div>
      </>
    );
  }

  // For logged in users
  if (user) {
    return (
      <>
        {/* Mobile view - Dropdown Menu */}
        <div className="sm:hidden">
          <HeaderAuthClient />
        </div>

        {/* Desktop view - Normal buttons */}
        <form action={signOutAction} className="hidden sm:flex">
          <Link className="mr-2" href="/about">
            <Button variant={"outline"}>About Us</Button>
          </Link>
          <Link className="mr-2" href="/admin">
            <Button variant={"outline"}>Admin</Button>
          </Link>
          <Button type="submit" variant={"outline"}>
            Sign out
          </Button>
          <div className="ml-2">
            <ThemeSwitcher />
          </div>
        </form>
      </>
    );
  }

  // For non-logged in users, show social media links
  return (
    <div className="flex items-center gap-2">
      {/* About Us Link */}
      <Link href="/about" className="mr-1">
        <Button variant="outline" size="sm">
          About Us
        </Button>
      </Link>
      
      {/* Social Media Links */}
      <a
        href="https://tiktok.com/@sabrinaescapes"
        target="_blank"
        rel="noreferrer"
        aria-label="TikTok"
      >
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 448 512"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z" />
          </svg>
        </Button>
      </a>
      <a
        href="https://instagram.com/sabrinaescapes"
        target="_blank"
        rel="noreferrer"
        aria-label="Instagram"
      >
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Instagram className="h-5 w-5" />
        </Button>
      </a>
      {/* Theme Switcher */}
      <ThemeSwitcher />
    </div>
  );
}
