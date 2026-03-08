import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/validations/forgot-password.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function ForgotPasswordForm() {
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
  );
}
