import { MainLayout } from "@/app/layout/MainLayout";
import { Login } from "@/features/auth/LoginPage";
import { Navigate, Route, Routes } from "react-router-dom";
import { PATHS } from "./paths";
import { AuthLayout } from "@/app/layout/AuthLayout";
import { RegisterUser } from "@/features/auth/RegisterUserPage";
import { PrivateRoute } from "./PrivateRoute";
import { NotFound } from "@/features/notFound/NotFoundPage";
import { PlansPage } from "@/features/plans/PlansPage";
import { AcceptInvitationPage } from "@/features/plans/AcceptInvitationPage";
import { ForgotPassword } from "@/features/auth/ForgotPasswordPage";
import { ResetPassword } from "@/features/auth/ResetPasswordPage";
import { CategoriesPage } from "@/features/categories/CategoriesPage";
import { OverviewPage } from "@/features/overview/OverviewPage";
import { OVERVIEW_PARAM_KEYS } from "@/features/overview/filters/overviewParams";
import { TransactionsPage } from "@/features/transactions/TransactionsPage";
import { TRANSACTION_PARAM_KEYS } from "@/features/transactions/filters/transactionParams";
import { PlanFiltersGate } from "./PlanFiltersGate";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path={PATHS.login} element={<Login />} />
        <Route path={PATHS.registerUser} element={<RegisterUser />} />
        <Route path={PATHS.forgotPassword} element={<ForgotPassword />} />
        <Route path={PATHS.resetPassword} element={<ResetPassword />} />
      </Route>

      <Route
        path={PATHS.home}
        element={<Navigate replace to={PATHS.overview} />}
      />

      <Route element={<PrivateRoute />}>
        <Route element={<MainLayout />}>
          <Route
            path={PATHS.overview}
            element={
              <PlanFiltersGate screen="overview" paramKeys={OVERVIEW_PARAM_KEYS}>
                <OverviewPage />
              </PlanFiltersGate>
            }
          />
          <Route
            path={PATHS.transactions}
            element={
              <PlanFiltersGate
                screen="transactions"
                paramKeys={TRANSACTION_PARAM_KEYS}
              >
                <TransactionsPage />
              </PlanFiltersGate>
            }
          />
          <Route
            path={PATHS.categories}
            element={
              <PlanFiltersGate screen="categories" paramKeys={[]}>
                <CategoriesPage />
              </PlanFiltersGate>
            }
          />
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
