import AuthButton from "@/components/header-auth";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
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
        <AuthButton />
      </div>
    </nav>
  );
}
