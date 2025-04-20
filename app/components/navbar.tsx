import AuthButton from "@/components/header-auth";
import Image from "next/image";
import Link from "next/link";
import NavbarSearchForm from "@/app/components/NavbarSearchForm";
import { cookies } from "next/headers";

export default function Navbar() {
  // Using cookies.get to retrieve the search query from headers is not reliable
  // Instead, we'll let the NavbarSearchForm component handle the search parameter client-side

  return (
    <div>
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
          <Link href={"/"} className="flex items-center gap-2 font-semibold">
            <Image
              src="/logo.png"
              alt="Enjoy Escapes Logo"
              width={40}
              height={40}
              className="h-8 w-auto"
            />
            <span>Enjoy Escapes</span>
          </Link>

          {/* Search bar */}
          <div className="flex-grow mx-4 max-w-md">
            <NavbarSearchForm />
          </div>

          <AuthButton />
        </div>
      </nav>

      {/* Promotional banner */}
      <div className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground py-2 px-4 flex justify-center items-center text-sm font-medium shadow-md">
        <div className="max-w-5xl w-full flex items-center justify-center gap-2">
          <span className="hidden sm:inline">✈️</span>
          <p className="text-center">
            <span className="font-bold">Book with as low as £0 deposit</span> •
            ATOL protected packages •
            <span className="text-accent underline ml-1 font-semibold">
              Book now pay later
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
