import { Routes } from "@angular/router";
import { authGuard } from "./core/guards/auth.guard";
import { guestGuard } from "./core/guards/guest.guard";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./features/auth/home.component").then((m) => m.HomeComponent),
  },
  {
    path: "login",
    canActivate: [guestGuard],
    loadComponent: () =>
      import("./features/auth/login/login.component").then(
        (m) => m.LoginComponent,
      ),
  },
  {
    path: "register",
    canActivate: [guestGuard],
    loadComponent: () =>
      import("./features/auth/register/register.component").then(
        (m) => m.RegisterComponent,
      ),
  },
  {
    path: "forgot-password",
    loadComponent: () =>
      import("./features/auth/forgot-password/forgot-password.component").then(
        (m) => m.ForgotPasswordComponent,
      ),
  },
  {
    path: "reset-password",
    loadComponent: () =>
      import("./features/auth/reset-password/reset-password.component").then(
        (m) => m.ResetPasswordComponent,
      ),
  },
  {
    path: "verify-email",
    loadComponent: () =>
      import("./features/auth/verify-email/verify-email.component").then(
        (m) => m.VerifyEmailComponent,
      ),
  },
  {
    path: "verify-otp",
    loadComponent: () =>
      import("./features/auth/verify-otp/verify-otp.component").then(
        (m) => m.VerifyOtpComponent,
      ),
  },
  {
    path: "auth/callback",
    loadComponent: () =>
      import("./features/auth/oauth-callback/oauth-callback.component").then(
        (m) => m.OauthCallbackComponent,
      ),
  },
  {
    path: "",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./shared/layout/layout.component").then((m) => m.LayoutComponent),
    children: [
      {
        path: "dashboard",
        loadComponent: () =>
          import("./features/dashboard/dashboard.component").then(
            (m) => m.DashboardComponent,
          ),
      },
      {
        path: "expenses",
        loadComponent: () =>
          import("./features/expenses/expenses.component").then(
            (m) => m.ExpensesComponent,
          ),
      },
      {
        path: "income",
        loadComponent: () =>
          import("./features/income/income.component").then(
            (m) => m.IncomeComponent,
          ),
      },
      {
        path: "budgets",
        loadComponent: () =>
          import("./features/budgets/budgets.component").then(
            (m) => m.BudgetsComponent,
          ),
      },
      {
        path: "categories",
        loadComponent: () =>
          import("./features/categories/categories.component").then(
            (m) => m.CategoriesComponent,
          ),
      },
      {
        path: "analytics",
        loadComponent: () =>
          import("./features/analytics/analytics.component").then(
            (m) => m.AnalyticsComponent,
          ),
      },
      {
        path: "recurring",
        loadComponent: () =>
          import("./features/recurring/recurring.component").then(
            (m) => m.RecurringComponent,
          ),
      },
      {
        path: "notifications",
        loadComponent: () =>
          import("./features/notifications/notifications.component").then(
            (m) => m.NotificationsComponent,
          ),
      },
      // Premium payments route removed
      {
        path: "settings",
        loadComponent: () =>
          import("./features/settings/settings.component").then(
            (m) => m.SettingsComponent,
          ),
      },
    ],
  },
  {
    path: "**",
    redirectTo: "",
  },
];
