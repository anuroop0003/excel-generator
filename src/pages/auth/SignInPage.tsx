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
import { Eye, EyeOff, FileSpreadsheet, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { signInSchema, type SignInFormValues } from "./schemas";

export default function SignInPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: SignInFormValues) => {
    console.log("Sign-in values:", values);
    toast.success("Signed in successfully!", {
      description: `Welcome back, ${values.email}`,
    });
    setTimeout(() => navigate("/"), 1000);
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

      <Card className="w-full max-w-md shadow-sm border-slate-200">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-800">
            Sign in
          </CardTitle>
          <CardDescription className="text-slate-500">
            Enter your credentials to access your templates.
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
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-slate-700 font-semibold text-xs uppercase tracking-wide">
                        Password
                      </FormLabel>
                      <Link
                        to="/forgot-password"
                        className="text-xs font-medium text-[#107C41] hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-9 pr-10 h-10 border-slate-200 focus-visible:ring-[#107C41] bg-white"
                          {...field}
                        />
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                        >
                          {showPassword ? (
                            <EyeOff className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                        </Button>
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
                Sign In
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 border-t border-slate-100 pt-6">
          <div className="text-sm text-center text-slate-500">
            Don't have an account?{" "}
            <Link
              to="/sign-up"
              className="text-[#107C41] font-bold hover:underline"
            >
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
