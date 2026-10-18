import { useRegisterUser } from "@/api/services/useAuthService";
import { PATHS } from "@/app/routing/paths";
import { Button } from "@/components/button/Button";
import { Field, FieldError, FieldLabel } from "@/components/input/base/Field";
import { Input } from "@/components/input/base/Input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/input/base/InputGroup";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, type Location } from "react-router-dom";
import { z } from "zod";

const registerUserSchema = z.object({
  name: z.string().min(1, "Please enter your full name"),
  email: z.string().min(1, "Please enter your email").email("Invalid email"),
  password: z.string().min(1, "Please enter your password"),
});

type RegisterUserSchema = z.infer<typeof registerUserSchema>;

type RegisterUserLocationState = {
  from?: Location;
};

export const RegisterUser = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: zodResolver(registerUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const { mutateAsync: registerUser, isPending: isRegisteringUser } =
    useRegisterUser();

  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as RegisterUserLocationState | null)?.from;

  const onSubmit = handleSubmit(async (credentials: RegisterUserSchema) => {
    try {
      await registerUser({ body: credentials });
      navigate(PATHS.login, { state: { from } });
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <>

      <form
        id="register-user-form"
        className="bg-card border-border flex w-full max-w-xl flex-col items-center gap-5 rounded-lg border p-5 shadow-md"
        onSubmit={onSubmit}
        autoComplete="off"
      >
        <h1 className="text-foreground text-2xl font-bold">Create your account</h1>

        <div className="flex w-full flex-col gap-3">
          <Field>
            <FieldLabel htmlFor="name-register-user">Name</FieldLabel>
            <Input
              id="name-register-user"
              placeholder="Full name"
              className="bg-card/70"
              autoComplete="off"
              {...register("name")}
            />
            {errors.name && <FieldError>{errors.name.message}</FieldError>}
          </Field>
          <Field>
            <FieldLabel htmlFor="email-register-user">Email</FieldLabel>
            <Input
              id="email-register-user"
              placeholder="you@example.com"
              className="bg-card/70"
              autoComplete="off"
              {...register("email")}
            />
            {errors.email && <FieldError>{errors.email.message}</FieldError>}
          </Field>
          <Field>
            <FieldLabel htmlFor="password-register-user">Password</FieldLabel>
            <InputGroup className="bg-card/70">
              <InputGroupInput
                id="password-register-user"
                type={isPasswordVisible ? "text" : "password"}
                autoComplete="new-password"
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
        </div>

        <div className="w-full">
          <p className="text-muted-foreground text-center text-sm">
            By clicking Sign up, you agree to findraco’s{" "}
            <strong>Terms of Service</strong> and acknowledge that you are
            subject to our <strong>Privacy Policy</strong>.
          </p>
        </div>

        <div className="w-full">
          <Button
            className="w-full"
            type="submit"
            isLoading={isRegisteringUser}
          >
            <p className="text-sm font-semibold">Sign up</p>
          </Button>
        </div>

        <div className="flex flex-col items-center">
          <p className="text-muted-foreground text-sm">
            Already have an account?
          </p>
          <Button
            type="button"
            variant="link"
            className="h-fit p-0 font-bold"
            onClick={() => navigate(PATHS.login, { state: { from } })}
          >
            Sign in
          </Button>
        </div>
      </form>
    </>
  );
};
