import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";
import AuthShell from "@/components/auth/AuthShell";

export const metadata: Metadata = { title: "Sign in" };

export default function SignInPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to track orders, save favourites and check out faster."
    >
      <SignIn />
    </AuthShell>
  );
}
