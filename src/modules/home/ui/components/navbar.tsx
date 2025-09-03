import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import UserControl from "@/components/user-control";

export default function Navbar() {
  return (
    <nav className="p-4 bg-transparent fixed top-0 left-0 right-0 z-50 transition-all duration-200 border-b border-transparent">
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between">
        <Link href={"/"} className="flex items-center gap-2">
          <Image src={"/logo.svg"} alt="Logo" width={24} height={24} />
          <span className="text-lg font-semibold">Genie</span>
        </Link>
        <SignedOut>
          <div className="flex gap-2">
            <SignUpButton>
              <Button variant="outline" size="sm">
                Sign up
              </Button>
            </SignUpButton>
            <SignInButton>
              <Button size="sm">Sign in</Button>
            </SignInButton>
          </div>
        </SignedOut>
        <SignedIn>
          <UserControl showName />
        </SignedIn>
      </div>
    </nav>
  );
}
