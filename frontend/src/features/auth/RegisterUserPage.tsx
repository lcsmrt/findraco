import { useRegisterUser } from "@/api/services/useAuthService";
import { PATHS } from "@/app/routing/paths";
import { useLocation, useNavigate } from "react-router-dom";
import type { RegisterUserFormOutput } from "./authForms";
import { RegisterUserView } from "./RegisterUserView";
import { readReturnLocation } from "./utils/returnLocation";

export function RegisterUser() {
  const { mutateAsync: registerUser, isPending: isRegisteringUser } =
    useRegisterUser();

  const navigate = useNavigate();
  const location = useLocation();
  const from = readReturnLocation(location.state);

  async function handleSubmit(credentials: RegisterUserFormOutput) {
    try {
      await registerUser({ body: credentials });
      navigate(PATHS.login, { state: { from } });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <RegisterUserView
      isSubmitting={isRegisteringUser}
      onSubmit={handleSubmit}
      onSignIn={() => navigate(PATHS.login, { state: { from } })}
    />
  );
}
