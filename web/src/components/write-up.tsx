import { ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const REPO = "https://github.com/Moddable-Games/moddable-midnight";

const DOCUMENTS = [
  {
    title: "Friction log",
    href: `${REPO}/blob/main/notes/FRICTION-LOG.md`,
    summary:
      "Every obstacle and pleasant surprise from building this with Midnight's AI tooling, each with evidence and a suggested fix.",
  },
  {
    title: "Timeline",
    href: `${REPO}/blob/main/notes/TIMELINE.md`,
    summary:
      "The clock from an empty repository to a contract deployed and used on a public network, with every transaction.",
  },
  {
    title: "Integration guide",
    href: `${REPO}/blob/main/docs/INTEGRATION.md`,
    summary:
      "What is public and what stays private, real indexer responses, CLI commands, pinned SDK versions and sourced caveats.",
  },
  {
    title: "Knowledge base queries",
    href: `${REPO}/blob/main/notes/KAPA-QUERIES.md`,
    summary:
      "Every question put to Midnight's Kapa knowledge server, what came back, and what it changed.",
  },
  {
    title: "Contract source",
    href: `${REPO}/blob/main/contracts/tournament_pass.compact`,
    summary:
      "The Compact contract: commitments in a Merkle tree, nullifiers against double claims, organiser checks in-circuit.",
  },
  {
    title: "Repository",
    href: REPO,
    summary: "Tests, witnesses, this front end and the README that ties it together.",
  },
];

/** Links to the notes behind the page, for readers who arrive here first. */
export function WriteUp() {
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="font-display text-2xl font-semibold">The write-up</h2>
        <p className="text-muted-foreground">
          This page is the visible end of an experiment in building on Midnight
          with its own AI developer tools. The notes are the point.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DOCUMENTS.map((doc) => (
          <a
            key={doc.title}
            href={doc.href}
            target="_blank"
            rel="noopener"
            className="group block rounded-2xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <Card className="h-full transition-colors group-hover:border-primary/40">
              <CardContent className="space-y-2 p-5">
                <p className="flex items-center gap-2 font-display text-lg font-semibold">
                  {doc.title}
                  <ExternalLink className="size-4 text-muted-foreground" />
                </p>
                <p className="text-sm text-muted-foreground">{doc.summary}</p>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </section>
  );
}
