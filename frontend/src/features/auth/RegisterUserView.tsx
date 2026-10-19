import { Button } from "@/components/button/base/Button";
import { FormField } from "@/components/form/FormField";
import { Input } from "@/components/input/base/Input";
import { Text } from "@/components/typography/base/Text";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  registerUserSchema,
  type RegisterUserFormOutput,
  type RegisterUserFormValues,
} from "./authForms";
import { AuthCard } from "./components/AuthCard";
import { PasswordInput } from "./components/PasswordInput";

type RegisterUserViewProps = {
  isSubmitting: boolean;
  onSubmit: (credentials: RegisterUserFormOutput) => Promise<void>;
  onSignIn: () => void;
};

export function RegisterUserView({
  isSubmitting,
  onSubmit,
  onSignIn,
}: RegisterUserViewProps) {
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

  return (
    <AuthCard title="Create your account">
      <form
        id="register-user-form"
        className="flex flex-col items-center gap-5"
        onSubmit={handleSubmit(onSubmit)}
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

        <Button className="w-full" type="submit" isLoading={isSubmitting}>
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
            onClick={onSignIn}
          >
            Sign in
          </Button>
        </div>
      </form>
    </AuthCard>
  );
}
