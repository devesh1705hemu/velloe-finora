import { ForbiddenState } from "@/features/tenant";

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-background text-foreground">
      <ForbiddenState
        title="403 — Organization Access Restricted"
        description="Your current role does not possess the permissions required to view this financial view or execute this action. You may switch to another authorized workspace or request an escalated role from your organization administrator."
      />
    </div>
  );
}
