import { useRegisterUser } from "@/api/services/useAuthService";
import { PATHS } from "@/app/routing/paths";
import { Button } from "@/components/button/base/Button";
import { FormField } from "@/components/form/FormField";
import { Input } from "@/components/input/base/Input";
import { Text } from "@/components/typography/base/Text";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, type Location } from "react-router-dom";
import {
  registerUserSchema,
  type RegisterUserFormOutput,
  type RegisterUserFormValues,
} from "./authForms";
import { AuthCard } from "./components/AuthCard";
import { PasswordInput } from "./components/PasswordInput";

type RegisterUserLocationState = {
  from?: Location;
};

export const RegisterUser = () => {
  const { control, handleSubmit } = useForm<
    RegisterUserFormValues,
    unknown,
    RegisterUserFormOutput
  >({
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

  const onSubmit = handleSubmit(async (credentials: RegisterUserFormOutput) => {
    try {
      await registerUser({ body: credentials });
      navigate(PATHS.login, { state: { from } });
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <AuthCard title="Create your account">
      <form
        id="register-user-form"
        className="flex flex-col items-center gap-5"
        onSubmit={onSubmit}
        autoComplete="off"
      >
        <div className="flex w-full flex-col gap-3">
          <FormField control={control} name="name" label="Name">
            {(field) => (
              <Input
                {...field}
                placeholder="Full name"
                className="bg-card/70"
                autoComplete="off"
              />
            )}
          </FormField>
          <FormField control={control} name="email" label="Email">
            {(field) => (
              <Input
                {...field}
                placeholder="you@example.com"
                className="bg-card/70"
                autoComplete="off"
              />
            )}
          </FormField>
          <FormField control={control} name="password" label="Password">
            {(field) => (
              <PasswordInput
                {...field}
                className="bg-card/70"
                autoComplete="new-password"
              />
            )}
          </FormField>
        </div>

        <Text as="p" variant="secondary" className="text-center">
          By clicking Sign up, you agree to findraco’s{" "}
          <strong>Terms of Service</strong> and acknowledge that you are subject
          to our <strong>Privacy Policy</strong>.
        </Text>

        <Button className="w-full" type="submit" isLoading={isRegisteringUser}>
          Sign up
        </Button>

        <div className="flex flex-col items-center">
          <Text as="p" variant="secondary">
            Already have an account?
          </Text>
          <Button
            type="button"
            variant="link"
            className="h-fit p-0"
            onClick={() => navigate(PATHS.login, { state: { from } })}
          >
            Sign in
          </Button>
        </div>
      </form>
    </AuthCard>
  );
};
