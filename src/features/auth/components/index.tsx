import type { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

export interface AuthCardProps {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function AuthCard({ title, description, children, footer, className }: AuthCardProps) {
  return (
    <Card className={cn("w-full max-w-md shadow-xl border-border/80 bg-card/80 backdrop-blur-md", className)}>
      <CardHeader className="space-y-1.5 text-center">
        <div className="mx-auto mb-2 flex justify-center">
          <Logo size="lg" showText={false} />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight text-foreground">{title}</CardTitle>
        <CardDescription className="text-xs sm:text-sm text-muted-foreground">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
        {footer && <div className="mt-4 pt-4 border-t border-border/60 text-center text-xs text-muted-foreground">{footer}</div>}
      </CardContent>
    </Card>
  );
}

export * from "./oauth-providers";
export * from "./password-strength-meter";
export * from "./demo-banner";
export * from "./rate-limit-alert";
