/**
 * Browserbase Integration Readiness Card
 *
 * Displays Browserbase status in the Integration Readiness section of the dashboard.
 * In static preview (GitHub Pages), shows account-setup instructions.
 * In hosted runtime, would connect to actual session if available.
 */

import { integrationProviders } from "@/integrations/provider-registry";
import type { IntegrationProvider } from "@/integrations/contracts";
import { StatusPill } from "@/components/ui/StatusPill";
import { Surface } from "@/components/ui/Surface";

function getBrowserbaseProvider(): IntegrationProvider | undefined {
  return integrationProviders.find((p) => p.id === "browserbase");
}

export function BrowserbaseCard() {
  const provider = getBrowserbaseProvider();

  if (!provider) {
    return null;
  }

  return (
    <Surface className="rounded-2xl">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-ink">{provider.name}</h3>
          <p className="mt-1 text-sm leading-relaxed text-ink-muted">
            {provider.appUse}
          </p>
        </div>
        <StatusPill tone="butter">
          {provider.readiness.replace("-", " ")}
        </StatusPill>
      </div>

      <div className="mt-4 space-y-2">
        <div className="text-sm">
          <span className="font-medium text-ink">CI Use:</span>
          <p className="text-ink-muted">{provider.ciUse}</p>
        </div>

        <div className="text-sm">
          <span className="font-medium text-ink">Next Step:</span>
          <p className="text-ink-muted">{provider.nextStep}</p>
        </div>

        {provider.requiredSecretNames.length > 0 && (
          <div className="mt-3 rounded-2xl bg-cream-dark/80 p-3">
            <p className="text-xs font-medium text-ink">
              Required Environment Variables:
            </p>
            <ul className="mt-2 space-y-1">
              {provider.requiredSecretNames.map((secret) => (
                <li
                  key={secret}
                  className="font-mono text-xs text-ink-muted"
                >
                  {secret}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-3 rounded-2xl bg-lavender-light p-3">
          <p className="text-xs text-purple-deep">
            <strong>Direct consumer:</strong>{" "}
            {provider.directConsumer ? "Yes" : "No"}
          </p>
          <p className="mt-1 text-xs text-purple-deep">
            <strong>{provider.plaiAdapterStatus}:</strong> PLAI event substrate
            integration is queued for later.
          </p>
        </div>
      </div>

      {/* Static Preview Info */}
      <div className="mt-4 border-t border-lavender-deep/30 pt-4">
        <p className="text-xs leading-relaxed text-ink-muted">
          <strong>Static Preview:</strong> Browserbase requires a hosted CI
          environment and API credentials. The smoke workflow triggers after
          each GitHub Pages deployment when{" "}
          <code className="font-mono">BROWSERBASE_API_KEY</code> and{" "}
          <code className="font-mono">BROWSERBASE_PROJECT_ID</code> are
          configured in GitHub repository secrets.
        </p>
      </div>
    </Surface>
  );
}
