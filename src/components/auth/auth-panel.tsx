import { startTransition, useActionState, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FormSubmitButton } from "@/components/common/form-submit-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAuthErrorKey, isUsingMockAuth } from "@/features/auth/auth-service";
import { useAuth } from "@/providers/use-auth";
import { useI18n } from "@/providers/use-i18n";

type AuthMode = "signin" | "signup";

interface AuthFormState {
  status: "idle" | "success" | "error";
  message: string | null;
}

const initialState: AuthFormState = {
  status: "idle",
  message: null
};

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export function AuthPanel() {
  const navigate = useNavigate();
  const { signIn, signInGoogle, signUp } = useAuth();
  const { t } = useI18n();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [googlePending, setGooglePending] = useState(false);
  const isMockAuth = isUsingMockAuth();

  const [state, submitAction] = useActionState<AuthFormState, FormData>(
    async (_, formData) => {
      const email = getStringValue(formData, "email").trim();
      const password = getStringValue(formData, "password");
      const displayName = getStringValue(formData, "displayName").trim();

      try {
        if (mode === "signin") {
          await signIn(email, password);
        } else {
          await signUp(email, password, displayName);
        }

        toast.success(t("auth.success"));
        startTransition(() => {
          void navigate("/app");
        });

        return {
          status: "success",
          message: t("auth.success")
        };
      } catch (error) {
        const errorKey = getAuthErrorKey(error);
        return {
          status: "error",
          message: t(errorKey)
        };
      }
    },
    initialState
  );

  async function handleGoogleLogin() {
    setGooglePending(true);

    try {
      await signInGoogle();
      toast.success(t("auth.success"));
      startTransition(() => {
        void navigate("/app");
      });
    } catch (error) {
      toast.error(t(getAuthErrorKey(error)));
    } finally {
      setGooglePending(false);
    }
  }

  return (
    <Card id="auth-panel" className="glass-surface border-border/70">
      <CardHeader>
        <Badge variant="accent" className="w-fit">
          {mode === "signin" ? t("auth.signInTitle") : t("auth.signUpTitle")}
        </Badge>
        <CardTitle>
          {mode === "signin" ? t("auth.signInTitle") : t("auth.signUpTitle")}
        </CardTitle>
        <CardDescription>
          {mode === "signin" ? t("auth.signInBody") : t("auth.signUpBody")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form action={submitAction} className="space-y-4">
          {mode === "signup" ? (
            <div className="space-y-2">
              <Label htmlFor="displayName">{t("auth.displayNameLabel")}</Label>
              <Input
                id="displayName"
                name="displayName"
                placeholder={t("auth.displayNamePlaceholder")}
                required
              />
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="email">{t("auth.emailLabel")}</Label>
            <Input
              id="email"
              name="email"
              placeholder={t("auth.emailPlaceholder")}
              required
              type="email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t("auth.passwordLabel")}</Label>
            <Input id="password" name="password" required type="password" />
          </div>

          {state.message ? (
            <p
              className={
                state.status === "error"
                  ? "text-sm text-destructive"
                  : "text-sm text-primary"
              }
            >
              {state.message}
            </p>
          ) : null}

          <FormSubmitButton
            className="w-full"
            pendingLabel={t("common.saving")}
          >
            {mode === "signin"
              ? t("auth.submitSignIn")
              : t("auth.submitSignUp")}
          </FormSubmitButton>
        </form>

        <Button
          className="w-full"
          disabled={googlePending}
          onClick={() => {
            void handleGoogleLogin();
          }}
          variant="secondary"
        >
          {googlePending ? t("common.loading") : t("auth.submitGoogle")}
        </Button>

        <div className="rounded-[1.5rem] border border-border/80 bg-background/60 p-4">
          <p className="text-sm font-semibold text-foreground">
            {isMockAuth ? t("auth.demoAccountsTitle") : t("auth.realAuthTitle")}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {isMockAuth ? t("auth.demoAccountsBody") : t("auth.realAuthBody")}
          </p>

          {isMockAuth ? (
            <div className="mt-3 space-y-2 text-sm text-muted-foreground">
              <div>`alma@example.com` / `Demo1234!`</div>
              <div>`noah@example.com` / `Demo1234!`</div>
            </div>
          ) : null}

          {!isMockAuth ? (
            <div className="mt-3 text-sm text-muted-foreground">
              {t("auth.deviceSessionsHint")}
            </div>
          ) : null}
        </div>

        {isMockAuth ? (
          <div className="rounded-[1.5rem] border border-dashed border-border/80 bg-secondary/40 p-4 text-sm text-muted-foreground">
            {t("auth.mockModeHint")}
          </div>
        ) : null}

        <button
          className="text-sm text-muted-foreground transition hover:text-foreground"
          onClick={() => {
            setMode((current) => (current === "signin" ? "signup" : "signin"));
          }}
          type="button"
        >
          {mode === "signin"
            ? t("auth.switchToSignUp")
            : t("auth.switchToSignIn")}{" "}
          <span className="font-semibold text-foreground">
            {mode === "signin"
              ? t("auth.switchActionSignUp")
              : t("auth.switchActionSignIn")}
          </span>
        </button>
      </CardContent>
    </Card>
  );
}
