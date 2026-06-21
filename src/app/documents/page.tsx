import { DocumentVaultPreview } from "@/components/documents/DocumentVaultPreview";
import { NotificationWorkflowPreview } from "@/components/workflows/NotificationWorkflowPreview";
import { PageShell } from "@/components/PageShell";

export default function DocumentsPage() {
  return (
    <PageShell maxWidth="full">
      <h1 className="text-3xl font-semibold text-ink sm:text-4xl">
        Documents & Forms
      </h1>
      <p className="mt-2 max-w-2xl text-ink-muted">
        Organize family documents, understand court form options, and prepare for guided form support.
      </p>
      <DocumentVaultPreview />
      <NotificationWorkflowPreview />
    </PageShell>
  );
}
