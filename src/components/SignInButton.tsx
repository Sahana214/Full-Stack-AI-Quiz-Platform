"use client";

import { signIn } from "next-auth/react";
import React from "react";
import { Button } from "./ui/button";

type Props = {
  text: string;
  variant?: "default" | "outline" | "ghost" | "link" | "secondary" | "destructive"; // Add your variants here
  className?: string;
};

const SignInButton = ({ text, variant = "default", className }: Props) => {
  return (
    <Button
      onClick={() => signIn("google").catch(console.error)}
      variant={variant}
      className={className}
    >
      {text}
    </Button>
  );
};

export default SignInButton;
