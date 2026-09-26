import Link from "next/link";
import { Compass, ArrowLeft, LayoutDashboard, ArrowLeftRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function NotFound() {
  return (
    <div className="flex min-h-[75vh] w-full flex-col items-center justify-center p-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-5 border border-primary/20 shadow-inner">
        <Compass className="h-8 w-8 text-primary" />
      </div>

      <div className="flex items-center gap-2 mb-2">
        <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
          404 Not Found
        </Badge>
      </div>

      <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        Ledger Resource Not Located
      </h1>

      <p className="mt-3 max-w-md text-sm text-muted-foreground leading-relaxed">
        The financial page, account statement, or entity you requested does not exist or has been relocated within the Velloe-Finora workspace.
      </p>

      {/* Suggested Fast Links */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button asChild variant="default" size="sm" className="gap-2">
          <Link href="/dashboard">
            <LayoutDashboard className="h-4 w-4" /> Go to Dashboard
          </Link>
        </Button>

        <Button asChild variant="outline" size="sm" className="gap-2">
          <Link href="/transactions">
            <ArrowLeftRight className="h-4 w-4" /> View Transactions
          </Link>
        </Button>

        <Button asChild variant="outline" size="sm" className="gap-2">
          <Link href="/ai">
            <Sparkles className="h-4 w-4 text-intelligence" /> Ask Finora AI
          </Link>
        </Button>
      </div>

      <div className="mt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Return to Public Homepage
        </Link>
      </div>
    </div>
  );
}
