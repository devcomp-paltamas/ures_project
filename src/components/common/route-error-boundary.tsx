import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function RouteErrorBoundary() {
  const error = useRouteError();

  const title = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : "Váratlan alkalmazáshiba";

  const description =
    error instanceof Error
      ? error.message
      : "A route betöltése közben hiba történt. Frissítés után újra próbálható.";

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-16">
      <Card className="w-full max-w-2xl border-border/70 bg-background/88">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Button asChild>
            <Link to="/">Vissza a landingre</Link>
          </Button>
          <Button
            onClick={() => {
              window.location.reload();
            }}
            variant="outline"
          >
            Oldal frissítése
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
