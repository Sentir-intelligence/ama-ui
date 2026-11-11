import * as React from "react";
import { MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { StageCloud } from "@/components/icons/stage-cloud";
import { Alert } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ColourSwatch, ColourSwatchGroup } from "@/components/ui/colour-swatch";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PromptDialog } from "@/components/ui/prompt-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { StatusChip } from "@/components/ui/status-chip";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableCheckboxCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { STATUS_KEYS } from "@/lib/status";

import { Row, Section } from "../parts";

export type Density = "compact" | "comfortable" | "touch";

const BUTTON_VARIANTS = ["default", "destructive", "outline", "secondary", "ghost", "link"] as const;
const SWATCH_NAMES = { 1: "Chart 1", 2: "Chart 2", 3: "Chart 3", 4: "Chart 4", 5: "Chart 5" } as const;

// Every component in the registry, in its main states. The page density comes from the shell.
export function ComponentsPage({ density }: { density: Density }) {
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [promptOpen, setPromptOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Record<string, boolean>>({ "PCS-P180-014": true });

  return (
    <main className="mx-auto grid max-w-7xl gap-6 p-6 lg:grid-cols-2">
      <Section title="Button" note="Every variant at rest and disabled, then the sizes. Hover them to check hover states.">
        <Row label="Default">
          {BUTTON_VARIANTS.map((v) => (
            <Button key={v} variant={v}>
              {v}
            </Button>
          ))}
        </Row>
        <Row label="Disabled">
          {BUTTON_VARIANTS.map((v) => (
            <Button key={v} variant={v} disabled>
              {v}
            </Button>
          ))}
        </Row>
        <Row label="Sizes">
          <Button size="sm">Small</Button>
          <Button>Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon" variant="outline" aria-label="Add">
            <Plus />
          </Button>
        </Row>
      </Section>

      <Section title="Badge" note="Counts and tags only. Never a status.">
        <Row label="Variants">
          <Badge>12</Badge>
          <Badge variant="secondary">Draft</Badge>
          <Badge variant="destructive">3</Badge>
          <Badge variant="outline">Level 4</Badge>
        </Row>
      </Section>

      <Section title="Tabs" note="Active is the label plus the primary indicator. Count, mention and unread are props.">
        <Tabs defaultValue="activity">
          <TabsList aria-label="Element">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="files" count={4}>
              Files
            </TabsTrigger>
            <TabsTrigger value="activity" count={3} mention unread>
              Activity
            </TabsTrigger>
            <TabsTrigger value="history" disabled>
              History
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="text-body">Overview panel</TabsContent>
          <TabsContent value="files" className="text-body">Files panel</TabsContent>
          <TabsContent value="activity" className="text-body">Activity panel</TabsContent>
        </Tabs>
      </Section>

      <Section title="Toggle Group" note="Segmented control for 2 to 4 peer options inside a panel.">
        <Row label="Single">
          <ToggleGroup type="single" defaultValue="shop" aria-label="Drawing">
            <ToggleGroupItem value="shop">Shop drawing</ToggleGroupItem>
            <ToggleGroupItem value="floor">Floor plan</ToggleGroupItem>
            <ToggleGroupItem value="3d" disabled>
              3D
            </ToggleGroupItem>
          </ToggleGroup>
        </Row>
      </Section>

      <Section title="Avatar" note="Photo or initials, always next to the person's name.">
        <Row label="Initials, photo that fails to load, resized">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarFallback>MT</AvatarFallback>
            </Avatar>
            <span className="text-body">Mia Tran</span>
          </div>
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src="/missing.jpg" />
              <AvatarFallback>JL</AvatarFallback>
            </Avatar>
            <span className="text-body">Jo Lee</span>
          </div>
          <Avatar className="size-16">
            <AvatarFallback>MT</AvatarFallback>
          </Avatar>
        </Row>
      </Section>

      <Section title="Tooltip" note="Hover or focus the triggers.">
        <Row label="Triggers">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="More">
                <MoreHorizontal />
              </Button>
            </TooltipTrigger>
            <TooltipContent>More actions</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">Rev B</Button>
            </TooltipTrigger>
            <TooltipContent>Shop drawing · Rev B · 02 Oct 2026</TooltipContent>
          </Tooltip>
        </Row>
      </Section>

      <Section title="Colour Swatch" note="Stage cloud colour picker. Selected shows the ring.">
        <Row label="Chart 1 to 5">
          <ColourSwatchGroup defaultValue="1" aria-label="Stage colour">
            {([1, 2, 3, 4, 5] as const).map((c) => (
              <ColourSwatch key={c} value={String(c)} colour={c} aria-label={SWATCH_NAMES[c]} disabled={c === 5} />
            ))}
          </ColourSwatchGroup>
        </Row>
        <Row label="Icon">
          <StageCloud className="text-foreground" />
          <StageCloud size={20} className="text-muted-foreground" />
        </Row>
      </Section>

      <Section title="Form controls" note="Input, Textarea and Select at rest, invalid and disabled.">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="pg-mark">Default</Label>
            <Input id="pg-mark" defaultValue="P180-014" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="pg-invalid">Invalid</Label>
            <Input id="pg-invalid" defaultValue="P180" aria-invalid />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="pg-disabled">Disabled</Label>
            <Input id="pg-disabled" placeholder="Locked" disabled />
          </div>
        </div>
        <Textarea placeholder="Add a note for the drafter" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Select defaultValue="p180">
            <SelectTrigger aria-label="Project">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="p180">P180 Collins St</SelectItem>
              <SelectItem value="p211">P211 Docklands</SelectItem>
              <SelectItem value="p305" disabled>
                P305 Archived
              </SelectItem>
            </SelectContent>
          </Select>
          <Select disabled>
            <SelectTrigger aria-label="Disabled select">
              <SelectValue placeholder="Disabled" />
            </SelectTrigger>
            <SelectContent />
          </Select>
        </div>
        <Row label="Checkbox and Switch">
          <Checkbox aria-label="Unchecked" />
          <Checkbox aria-label="Checked" defaultChecked />
          <Checkbox aria-label="Disabled" disabled />
          <Checkbox aria-label="Disabled checked" disabled defaultChecked />
          <Switch aria-label="Off" />
          <Switch aria-label="On" defaultChecked />
          <Switch aria-label="Disabled" disabled />
        </Row>
      </Section>

      <Section title="Status Chip" note="Every lifecycle status, from the tokens.">
        <div className="flex flex-wrap gap-2">
          {STATUS_KEYS.map((s) => (
            <StatusChip key={s} status={s} />
          ))}
        </div>
      </Section>

      <Section title="Alert">
        <Alert variant="success" title="Saved">The schedule is up to date.</Alert>
        <Alert variant="warning" title="Check dimensions">Two panels exceed the truck limit.</Alert>
        <Alert variant="info" title="Read only">This project is archived.</Alert>
        <Alert variant="destructive" title="Upload failed">The drawing could not be read.</Alert>
      </Section>

      <Section title="Overlays" note="Dialogs and sheets z-100, menus and tooltips z-110.">
        <Row label="Open">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Rename element</DialogTitle>
                <DialogDescription>Shop numbers must be unique within a project.</DialogDescription>
              </DialogHeader>
              <Input defaultValue="P180-014" aria-label="Shop number" />
              <DialogFooter>
                <Button>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={() => setConfirmOpen(true)}>
            Confirm dialog
          </Button>
          <Button variant="outline" onClick={() => setPromptOpen(true)}>
            Prompt dialog
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Sheet</Button>
            </SheetTrigger>
            <SheetContent>
              <span className="text-section">P180-014</span>
              <StatusChip status="ifc" />
            </SheetContent>
          </Sheet>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Popover</Button>
            </PopoverTrigger>
            <PopoverContent className="text-body">Floating layer, opens above dialogs.</PopoverContent>
          </Popover>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Dropdown</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Columns</DropdownMenuLabel>
              <DropdownMenuCheckboxItem checked>Shop number</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Area m²</DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Reset</DropdownMenuItem>
              <DropdownMenuItem disabled>Export</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Row>
        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title="Delete element?"
          description="P180-014 and its drawings will be removed."
          confirmLabel="Delete"
          destructive
          onConfirm={() => setConfirmOpen(false)}
        />
        <PromptDialog
          open={promptOpen}
          onOpenChange={setPromptOpen}
          title="New view"
          label="Name"
          placeholder="Level 4 panels"
          onConfirm={() => setPromptOpen(false)}
        />
      </Section>

      <Section title="Card">
        <Card>
          <CardHeader>
            <CardTitle>P180 Collins St</CardTitle>
            <CardDescription>214 elements · 08 Oct 2026</CardDescription>
          </CardHeader>
          <CardContent className="text-body">Card content uses the body role.</CardContent>
          <CardFooter>
            <Button variant="outline" size="sm">
              <Trash2 /> Archive
            </Button>
          </CardFooter>
        </Card>
      </Section>

      <div className="lg:col-span-2">
        <Section title="Table" note="Uses the page density. Hover a row; the first row is selected.">
          <Table density={density}>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10" />
                <TableHead>Shop number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Area m²</TableHead>
                <TableHead className="text-right">Due</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { id: "PCS-P180-014", status: "ifc", area: "12.40", due: "08 Oct 2026" },
                { id: "PCS-P180-015", status: "scheduled", area: "9.75", due: "10 Oct 2026" },
                { id: "PCS-P180-016", status: "ifa", area: "", due: "14 Oct 2026" },
              ].map((r) => (
                <TableRow key={r.id} data-state={selected[r.id] ? "selected" : undefined}>
                  <TableCheckboxCell>
                    <Checkbox
                      aria-label={`Select ${r.id}`}
                      checked={!!selected[r.id]}
                      onCheckedChange={(c) => setSelected((s) => ({ ...s, [r.id]: c === true }))}
                    />
                  </TableCheckboxCell>
                  <TableCell className="text-id">{r.id}</TableCell>
                  <TableCell>
                    <StatusChip status={r.status as (typeof STATUS_KEYS)[number]} />
                  </TableCell>
                  <TableCell className="text-right">
                    {r.area || <span className="text-muted-foreground">–</span>}
                  </TableCell>
                  <TableCell className="text-right">{r.due}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Section>
      </div>

      <Section title="Logo">
        <Row label="Default">
          <Logo />
          <Logo variant="mark" className="h-6" />
        </Row>
        <div data-surface="chrome" className="flex items-center gap-6 rounded-md bg-chrome p-4">
          <Logo tone="reverse" />
          <Logo tone="reverse" variant="mark" className="h-6" />
        </div>
      </Section>
    </main>
  );
}
