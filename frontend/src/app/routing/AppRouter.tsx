import { MainLayout } from "@/app/layout/MainLayout";
import { Home } from "@/app/home/HomePage";
import { Login } from "@/features/auth/LoginPage";
import { Route, Routes } from "react-router-dom";
import { PATHS } from "./paths";
import { AuthLayout } from "@/app/layout/AuthLayout";
import { RegisterUser } from "@/features/auth/RegisterUserPage";
import { PrivateRoute } from "./PrivateRoute";
import { NotFound } from "@/features/notFound/NotFoundPage";
import { PlansPage } from "@/features/plans/PlansPage";
import { AcceptInvitationPage } from "@/features/plans/AcceptInvitationPage";
import { ForgotPassword } from "@/features/auth/ForgotPasswordPage";
import { ResetPassword } from "@/features/auth/ResetPasswordPage";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path={PATHS.login} element={<Login />} />
        <Route path={PATHS.registerUser} element={<RegisterUser />} />
        <Route path={PATHS.forgotPassword} element={<ForgotPassword />} />
        <Route path={PATHS.resetPassword} element={<ResetPassword />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route element={<MainLayout />}>
          <Route path={PATHS.home} element={<Home />} />
          <Route path={PATHS.plans} element={<PlansPage />} />
          <Route
            path={PATHS.acceptInvitation}
            element={<AcceptInvitationPage />}
          />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
