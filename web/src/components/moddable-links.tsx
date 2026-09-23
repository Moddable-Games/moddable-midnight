import { ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SITE } from "@/lib/site";

/** Where to find the rest of Moddable, for visitors who arrive here first. */
export function ModdableLinks() {
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="font-display text-3xl font-semibold">Explore Moddable</h2>
        <p className="text-muted-foreground">The games and tools this experiment is for.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {SITE.moddable.map((link) => (
          <a key={link.href} href={link.href} target="_blank" rel="noopener" className="group block">
            <Card className="h-full transition-colors group-hover:border-primary/40">
              <CardContent className="space-y-1.5 p-5">
                <p className="flex items-center gap-2 font-semibold">
                  {link.title} <ExternalLink className="size-4 text-muted-foreground" />
                </p>
                <p className="text-sm text-muted-foreground">{link.summary}</p>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </section>
  );
}
