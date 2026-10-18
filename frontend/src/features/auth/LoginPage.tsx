import { useLogin } from "@/api/services/useAuthService";
import { PATHS } from "@/app/routing/paths";
import { Button } from "@/components/button/Button";
import { Field, FieldError, FieldLabel } from "@/components/input/base/Field";
import { Input } from "@/components/input/base/Input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/input/base/InputGroup";
import { useAuth } from "@/app/providers/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, type Location } from "react-router-dom";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().min(1, "Please enter your email").email("Invalid email"),
  password: z.string().min(1, "Please enter your password"),
});

type LoginSchema = z.infer<typeof loginSchema>;

type LoginLocationState = {
  from?: Location;
};

export const Login = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { signIn } = useAuth();
  const { mutateAsync: login, isPending: isLoggingIn } = useLogin();

  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as LoginLocationState | null)?.from;

  const onSubmit = handleSubmit(async (credentials: LoginSchema) => {
    // useLogin already shows the failure as a toast.
    const res = await login({ body: credentials }).catch(() => null);
    if (!res) return;

    await signIn(res.token);
    navigate(from ? `${from.pathname}${from.search}` : PATHS.home, {
      replace: true,
    });
  });

  return (
    <>

      <form
        id="login-form"
        className="bg-card border-border flex w-full max-w-xl flex-col items-center gap-5 rounded-lg border p-5 shadow-md"
        onSubmit={onSubmit}
      >
        <h1 className="text-foreground text-2xl font-bold">Sign in</h1>

        <div className="flex w-full flex-col gap-3">
          <Field>
            <FieldLabel htmlFor="email-login">Email</FieldLabel>
            <Input
              id="email-login"
              placeholder="you@example.com"
              className="bg-card/70"
              {...register("email")}
            />
            {errors.email && <FieldError>{errors.email.message}</FieldError>}
          </Field>
          <Field>
            <FieldLabel htmlFor="password-login">Password</FieldLabel>
            <InputGroup className="bg-card/70">
              <InputGroupInput
                id="password-login"
                type={isPasswordVisible ? "text" : "password"}
                {...register("password")}
              />
              <InputGroupAddon align="inline-end">
                <Button
                  className="h-8 w-8 rounded-full p-0"
                  variant="ghost"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  type="button"
                >
                  {isPasswordVisible ? (
                    <Eye className="h-5 w-5" />
                  ) : (
                    <EyeClosed className="h-5 w-5" />
                  )}
                </Button>
              </InputGroupAddon>
            </InputGroup>
            {errors.password && (
              <FieldError>{errors.password.message}</FieldError>
            )}
          </Field>
          <Button
            type="button"
            variant="link"
            className="h-fit self-end p-0 text-sm"
            onClick={() => navigate(PATHS.forgotPassword)}
          >
            Forgot password?
          </Button>
        </div>

        <div className="w-full">
          <Button className="w-full" type="submit" isLoading={isLoggingIn}>
            <p className="text-sm font-semibold">Sign in</p>
          </Button>
        </div>

        <div className="flex flex-col items-center">
          <p className="text-muted-foreground text-sm">
            Don’t have an account?
          </p>
          <Button
            type="button"
            variant="link"
            className="h-fit p-0 font-bold"
            onClick={() => navigate(PATHS.registerUser, { state: { from } })}
          >
            Create one now
          </Button>
        </div>
      </form>
    </>
  );
};
