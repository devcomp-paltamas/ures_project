import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function RouteState({
  title,
  body,
  ctaLabel,
  ctaTo
}: {
  title: string;
  body: string;
  ctaLabel: string;
  ctaTo: string;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-16">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{body}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link to={ctaTo}>{ctaLabel}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
