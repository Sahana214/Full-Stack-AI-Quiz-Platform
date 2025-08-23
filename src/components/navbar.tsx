import Link from "next/link";
import React from "react";
import SignInButton from "./SignInButton";
import { getAuthSession } from "@/lib/nextauth";
import UserAccountNav from "./UserAccountNav";
import { ThemeToggle } from "./ThemeToggle";

type Props = {}

const Navbar = async () => {
  const session = await getAuthSession();

  return (
    <div className="fixed inset-x-0 top-0 z-50 bg-background border-b border-border py-2">
      <div className="flex items-center justify-between h-16 px-6 mx-auto max-w-7xl">
        <Link href="/" className="flex items-center gap-2">
          <p className="rounded-lg border-2 border-b-4 border-r-4 border-black dark:border-white px-3 py-1.5 text-lg font-bold transition-all hover:-translate-y-[2px] text-foreground">
            QUIZZY
          </p>
        </Link>
        <div className="flex items-center">
          <ThemeToggle className="mr-3" />
          <div>
            {session?.user ? (
              <UserAccountNav user={session.user} />
            ) : (
              <SignInButton className="bg-black font-bold text-white" text="Sign In" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
