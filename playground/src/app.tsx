import * as React from "react";
import { Logo } from "@/components/brand/logo";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ComponentsPage, type Density } from "./pages/components";
import { PatternsPage } from "./pages/patterns";

type Theme = "light" | "dark";

// Two pages, chosen by the URL hash (#/components, #/patterns), so the dev server and the static
// build need no router or server config.
const ROUTES = [
  { path: "/components", label: "Components" },
  { path: "/patterns", label: "Patterns" },
] as const;
type Route = (typeof ROUTES)[number]["path"];

function currentRoute(): Route {
  const hash = window.location.hash.replace(/^#/, "");
  return ROUTES.some((r) => r.path === hash) ? (hash as Route) : "/components";
}

function useRoute(): Route {
  const [route, setRoute] = React.useState<Route>(currentRoute);
  React.useEffect(() => {
    const onHash = () => {
      setRoute(currentRoute());
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return route;
}

// Theme and density live on <html> so portalled layers (dialogs, menus, tooltips) follow them too.
function useDocumentSetting(theme: Theme, density: Density) {
  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.dataset.density = density;
  }, [theme, density]);
}

export function App() {
  const [theme, setTheme] = React.useState<Theme>("light");
  const [density, setDensity] = React.useState<Density>("comfortable");
  const route = useRoute();
  useDocumentSetting(theme, density);

  return (
    <TooltipProvider>
      <header
        data-surface="chrome"
        className="sticky top-0 z-50 flex h-topbar items-center gap-6 bg-chrome px-6 text-chrome-foreground"
      >
        <Logo tone="reverse" variant="mark" className="h-6" />
        <span className="text-section">Playground</span>
        <nav aria-label="Playground pages" className="flex items-center gap-1">
          {ROUTES.map((r) => (
            <a
              key={r.path}
              href={`#${r.path}`}
              aria-current={route === r.path ? "page" : undefined}
              className={cn(
                "rounded-md px-3 py-1.5 text-body no-underline",
                route === r.path
                  ? "bg-chrome-hover text-chrome-foreground"
                  : "text-chrome-muted hover:bg-chrome-hover hover:text-chrome-foreground"
              )}
            >
              {r.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <ToggleGroup
            type="single"
            value={theme}
            onValueChange={(v) => v && setTheme(v as Theme)}
            aria-label="Theme"
            className="rounded-md bg-chrome-hover p-0.5"
          >
            <ToggleGroupItem value="light" className="text-chrome-muted hover:text-chrome-foreground">
              Light
            </ToggleGroupItem>
            <ToggleGroupItem value="dark" className="text-chrome-muted hover:text-chrome-foreground">
              Dark
            </ToggleGroupItem>
          </ToggleGroup>
          <ToggleGroup
            type="single"
            value={density}
            onValueChange={(v) => v && setDensity(v as Density)}
            aria-label="Density"
            className="rounded-md bg-chrome-hover p-0.5"
          >
            {(["compact", "comfortable", "touch"] as const).map((d) => (
              <ToggleGroupItem key={d} value={d} className="text-chrome-muted capitalize hover:text-chrome-foreground">
                {d}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </header>

      {route === "/patterns" ? <PatternsPage /> : <ComponentsPage density={density} />}
    </TooltipProvider>
  );
}
