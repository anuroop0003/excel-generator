import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuthFooter } from "./components/AuthFooter";
import { AuthHeader } from "./components/AuthHeader";
import { ForgotPasswordForm } from "./components/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans antialiased text-slate-900 selection:bg-green-100 selection:text-green-900">
      <AuthHeader />

      <Card className="w-full max-w-sm shadow-sm border-slate-200">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-800">
            Reset Password
          </CardTitle>
          <CardDescription className="text-slate-500">
            Enter your email and we'll send you a reset link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ForgotPasswordForm />
        </CardContent>
        <CardFooter className="flex flex-col gap-4 border-t border-slate-100 pt-6">
          <AuthFooter />
        </CardFooter>
      </Card>
    </div>
  );
}
