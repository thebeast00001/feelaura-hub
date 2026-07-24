import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";
import AuthShell from "@/components/auth/AuthShell";

export const metadata: Metadata = { title: "Create account" };

export default function SignUpPage() {
  return (
    <AuthShell
      title="Join the club"
      subtitle="Create an account for faster checkout and occasion reminders."
    >
      <SignUp />
    </AuthShell>
  );
}
