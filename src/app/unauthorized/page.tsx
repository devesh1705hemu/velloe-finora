import Link from "next/link";
import { Lock, LogIn, Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center p-6 text-center bg-background text-foreground">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 mb-5 border border-amber-500/20 shadow-sm">
        <Lock className="h-8 w-8" />
      </div>

      <div className="flex items-center gap-2 mb-2">
        <Badge variant="warning" className="font-mono text-xs uppercase tracking-wider">
          401 Unauthorized
        </Badge>
      </div>

      <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        Authentication Required
      </h1>

      <p className="mt-3 max-w-md text-sm text-muted-foreground leading-relaxed">
        Your active session token has expired, been invalidated, or you have not yet authenticated into Velloe-Finora.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button asChild variant="default" size="sm" className="gap-2">
          <Link href="/login">
            <LogIn className="h-4 w-4" /> Sign In to Velloe-Finora
          </Link>
        </Button>

        <Button asChild variant="outline" size="sm" className="gap-2">
          <Link href="/login?demo=true">
            <Sparkles className="h-4 w-4 text-primary" /> Explore Guest Demo
          </Link>
        </Button>
      </div>

      <div className="mt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Return to Homepage
        </Link>
      </div>
    </div>
  );
}
