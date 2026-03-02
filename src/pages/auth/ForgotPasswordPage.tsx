import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileSpreadsheet, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "./schemas";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: ForgotPasswordFormValues) => {
    toast.success("Reset link sent!", {
      description: `Check your inbox (${values.email}) for instructions.`,
    });
    setTimeout(() => navigate("/sign-in"), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans antialiased text-slate-900 selection:bg-green-100 selection:text-green-900">
      <Link
        to="/"
        className="flex items-center gap-3 mb-8 group transition-all"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded bg-[#107C41] text-white shadow-sm border border-[#0d6635] group-hover:scale-105 transition-transform">
          <FileSpreadsheet className="size-6" />
        </div>
        <span className="text-2xl font-bold tracking-tight text-[#107C41]">
          Excel Builder
        </span>
      </Link>

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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-semibold text-xs uppercase tracking-wide">
                      Email
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                        <Input
                          placeholder="name@example.com"
                          className="pl-9 h-10 border-slate-200 focus-visible:ring-[#107C41] bg-white"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full h-10 bg-[#107C41] hover:bg-[#0c6132] text-white font-bold shadow-sm transition-all mt-2 cursor-pointer"
                disabled={form.formState.isSubmitting}
              >
                Send Reset Link
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 border-t border-slate-100 pt-6">
          <div className="text-sm text-center text-slate-500">
            Remember your password?{" "}
            <Link
              to="/sign-in"
              className="text-[#107C41] font-bold hover:underline"
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
