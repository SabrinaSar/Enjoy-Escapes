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
    <div className="flex items-center gap-1">
      {/* About Us Link */}
      <Link href="/about" className="mr-1">
        <Button variant="outline" size="sm">
          About Us
        </Button>
      </Link>
      {/* Theme Switcher */}
      <ThemeSwitcher />
    </div>
  );
}
