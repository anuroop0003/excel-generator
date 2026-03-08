import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  signUpSchema,
  type SignUpFormValues,
} from "@/validations/sign-up.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function SignUpForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: SignUpFormValues) => {
    toast.success("Account created successfully!", {
      description: `Welcome, ${values.name}`,
    });
    setTimeout(() => navigate("/"), 1000);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700 font-semibold text-xs uppercase tracking-wide">
                Name
              </FormLabel>
              <FormControl>
                <InputGroup className="border-slate-200 focus-within:ring-[#107C41] bg-white h-10 overflow-hidden">
                  <InputGroupAddon className="pl-3 pr-0">
                    <User className="size-4 text-slate-400" />
                  </InputGroupAddon>
                  <InputGroupInput
                    placeholder="John Doe"
                    className="pl-2 border-0"
                    {...field}
                  />
                </InputGroup>
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700 font-semibold text-xs uppercase tracking-wide">
                Email
              </FormLabel>
              <FormControl>
                <InputGroup className="border-slate-200 focus-within:ring-[#107C41] bg-white h-10 overflow-hidden">
                  <InputGroupAddon className="pl-3 pr-0">
                    <Mail className="size-4 text-slate-400" />
                  </InputGroupAddon>
                  <InputGroupInput
                    placeholder="name@example.com"
                    className="pl-2 border-0"
                    {...field}
                  />
                </InputGroup>
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
              <FormLabel className="text-slate-700 font-semibold text-xs uppercase tracking-wide">
                Password
              </FormLabel>
              <FormControl>
                <InputGroup className="border-slate-200 focus-within:ring-[#107C41] bg-white h-10 overflow-hidden">
                  <InputGroupAddon className="pl-3 pr-0">
                    <Lock className="size-4 text-slate-400" />
                  </InputGroupAddon>
                  <InputGroupInput
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-2 pr-1 border-0"
                    {...field}
                  />
                  <InputGroupAddon className="px-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="h-8 w-8 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer p-0"
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700 font-semibold text-xs uppercase tracking-wide">
                Confirm
              </FormLabel>
              <FormControl>
                <InputGroup className="border-slate-200 focus-within:ring-[#107C41] bg-white h-10 overflow-hidden">
                  <InputGroupAddon className="pl-3 pr-0">
                    <Lock className="size-4 text-slate-400" />
                  </InputGroupAddon>
                  <InputGroupInput
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-2 pr-1 border-0"
                    {...field}
                  />
                  <InputGroupAddon className="px-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="h-8 w-8 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer p-0"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full h-10 bg-[#107C41] hover:bg-[#0c6132] text-white font-bold shadow-sm transition-all mt-4 cursor-pointer"
          disabled={form.formState.isSubmitting}
        >
          Sign Up
        </Button>
      </form>
    </Form>
  );
}
