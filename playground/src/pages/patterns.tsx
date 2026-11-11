import * as React from "react";
import { Clock, FileText, LayoutGrid, Menu, ScanLine, ScanSearch, Settings, Table2, UserPlus } from "lucide-react";
import { CodeInput } from "@/components/patterns/code-input";
import { PersonRow } from "@/components/patterns/person-row";
import { PhonePageHeader } from "@/components/patterns/phone-page-header";
import { PreviewBar } from "@/components/patterns/preview-bar";
import { ShellActivityItem } from "@/components/patterns/shell-activity-item";
import { ShellAvatar } from "@/components/patterns/shell-avatar";
import { ShellChromeButton } from "@/components/patterns/shell-chrome-button";
import { ShellMenuTab } from "@/components/patterns/shell-menu-tab";
import { ShellPanelRow } from "@/components/patterns/shell-panel-row";
import { ShellRailItem } from "@/components/patterns/shell-rail-item";
import { Phone, Row, Section } from "../parts";

// A live code input: any code but 48219376 is treated as wrong, to show the invalid state.
function LiveCodeInput() {
  const [code, setCode] = React.useState("");
  const [wrong, setWrong] = React.useState(false);
  return (
    <div className="flex flex-col gap-2">
      <CodeInput
        value={code}
        invalid={wrong}
        onChange={(next) => {
          setCode(next);
          setWrong(false);
        }}
        onComplete={(full) => setWrong(full !== "48219376")}
      />
      <span className="text-caption text-muted-foreground">
        {wrong ? "Wrong code (try 48219376)" : code.length === 8 ? "Signed in" : `${code.length} of 8`}
      </span>
    </div>
  );
}

// A live set of panel rows: pick one, pin any.
function LivePanelRows() {
  const [active, setActive] = React.useState("wip");
  const [pinned, setPinned] = React.useState<Set<string>>(new Set(["first"]));
  const rows = [
    { id: "first", label: "Andrew first view" },
    { id: "wip", label: "WIP" },
    { id: "long", label: "Andrew: production and claims for every stage this month" },
  ];
  return (
    <>
      {rows.map((r) => (
        <ShellPanelRow
          key={r.id}
          icon={Table2}
          label={r.label}
          active={active === r.id}
          onSelect={() => setActive(r.id)}
          pin={{
            pinned: pinned.has(r.id),
            onToggle: () =>
              setPinned((prev) => {
                const next = new Set(prev);
                if (next.has(r.id)) next.delete(r.id);
                else next.add(r.id);
                return next;
              }),
          }}
        />
      ))}
    </>
  );
}

// The Figma Pattern/... components, each in every state it is drawn in. ama-ui draws, ama-os decides:
// every state here comes from props alone.
export function PatternsPage() {
  return (
    <main className="mx-auto grid max-w-7xl gap-6 p-6 lg:grid-cols-2">
      <Section
        title="Person row"
        note="Settings, Users and roles. Photo or initials, name, email and company, role, and Invited until the invite is accepted. With onSelect the row is one 64px button."
      >
        <Phone>
          <PersonRow name="Ben Ryan" detail="ben@hutchinson.com.au · Hutchinson" role="Builder" onSelect={() => {}} />
          <PersonRow name="Maria Thompson" detail="maria@amaprecast.com.au" role="QA" avatarUrl="/missing.jpg" onSelect={() => {}} />
          <PersonRow name="Sam Lee" detail="sam@hutchinson.com.au · Hutchinson" role="Builder" invited onSelect={() => {}} />
          <PersonRow
            name="A person with a very long name that does not fit"
            detail="a.very.long.email.address@a-long-company-name.com.au · A long company name"
            role="Other external"
            onSelect={() => {}}
          />
          <PersonRow name="Jacob Marschke" detail="Not interactive (no onSelect)" role="Admin" />
        </Phone>
      </Section>

      <Section
        title="Phone page header"
        note="Phone pages that are not a panel. Back, title on one line, one optional icon action; 44px targets, 56px tall, sticky."
      >
        <Phone>
          <PhonePageHeader title="Users and roles" onBack={() => {}} />
        </Phone>
        <Phone>
          <PhonePageHeader title="People" onBack={() => {}} action={{ icon: UserPlus, label: "Invite person", onClick: () => {} }} />
        </Phone>
        <Phone>
          <PhonePageHeader title="Settings" />
        </Phone>
        <Phone>
          <PhonePageHeader title="A page title that is far too long to fit on one line" onBack={() => {}} action={{ icon: UserPlus, label: "Invite person", onClick: () => {} }} />
        </Phone>
      </Section>

      <Section
        title="Shell rail item"
        note="App rail on navy chrome. Active has the yellow indicator and aria-current; focus (tab to it) is the yellow ring. asChild wraps the app's link."
      >
        <Row label="Rail">
          <nav data-surface="chrome" className="flex flex-col gap-1 rounded-md bg-chrome py-2">
            <ShellRailItem icon={LayoutGrid} label="Views" active />
            <ShellRailItem icon={FileText} label="Documents" />
            <ShellRailItem icon={Clock} label="Activity" />
            <ShellRailItem icon={Settings} label="Settings" />
            <ShellRailItem asChild icon={ScanSearch} label="Reader">
              <a href="#/patterns" />
            </ShellRailItem>
            <div className="flex justify-center pt-4">
              <ShellAvatar name="jacob@sentir.com.au" />
            </div>
          </nav>
        </Row>
      </Section>

      <Section
        title="Shell chrome button and avatar"
        note="Buttons on navy chrome: icon only (needs a label) or with the label shown. The avatar is the account button at the foot of the rail."
      >
        <Row label="On chrome">
          <div data-surface="chrome" className="flex items-center gap-2 rounded-md bg-chrome p-2">
            <ShellChromeButton icon={Menu} label="Open menu" />
            <ShellChromeButton icon={ScanLine} label="Scan" />
            <ShellChromeButton icon={ScanLine} label="Scan" showLabel />
            <ShellAvatar name="Jacob Marschke" />
          </div>
        </Row>
      </Section>

      <Section
        title="Shell panel row"
        note="Rows in the side panel and the menu sheet. Icon, label, meta, pin. The row height follows the density: compact here, touch in the phone frame."
      >
        <Row label="Compact">
          <div className="w-72 rounded-md border border-border bg-card py-2">
            <LivePanelRows />
            <ShellPanelRow label="Stage 17" meta="3/12" icon={FileText} />
            <ShellPanelRow label="No icon, no pin" />
          </div>
        </Row>
        <Phone>
          <div data-density="touch">
            <ShellPanelRow icon={Table2} label="Andrew first view" pin={{ pinned: true, onToggle: () => {} }} />
            <ShellPanelRow icon={Table2} label="WIP" active />
            <ShellPanelRow icon={Settings} label="Settings" />
          </div>
        </Phone>
      </Section>

      <Section
        title="Shell menu tab and activity item"
        note="The tabs across the top of the menu sheet (inside role=tablist), and an entry in its Activity tab."
      >
        <Phone>
          <div role="tablist" aria-label="Menu" className="flex border-b border-border">
            <ShellMenuTab icon={LayoutGrid} label="Views" active />
            <ShellMenuTab icon={FileText} label="Documents" />
            <ShellMenuTab icon={Clock} label="Activity" />
          </div>
          <ShellActivityItem comment="Comment: Split from L2-2." trail="AMA237 · A-2P068" age="3d" onSelect={() => {}} />
          <ShellActivityItem
            comment="Cast date changed from 3 Nov to 5 Nov because the crane was booked elsewhere on the day."
            trail="AMA210 · NEL Bulleen · L4-P117"
            age="2h"
          />
        </Phone>
      </Section>

      <Section
        title="Preview bar"
        note="While Admin or IT preview another shell as someone, read only. Under the page header; Exit returns to Staff."
      >
        <Phone>
          <PhonePageHeader title="L2-P005" onBack={() => {}} />
          <PreviewBar shell="Builder" person="Ben Ryan" onExit={() => {}} />
        </Phone>
        <Phone>
          <PreviewBar shell="Other external" person="A person with a long name from a long company" onExit={() => {}} />
        </Phone>
      </Section>

      <Section
        title="Code input"
        note="The 8-digit email sign-in code. Type, paste or autofill; backspace moves back; the last digit completes. The app checks the code and sets invalid."
      >
        <Row label="Live">
          <LiveCodeInput />
        </Row>
        <Row label="Empty">
          <CodeInput value="" onChange={() => {}} />
        </Row>
        <Row label="Typing">
          <CodeInput value="4821" onChange={() => {}} />
        </Row>
        <Row label="Filled">
          <CodeInput value="48219376" onChange={() => {}} />
        </Row>
        <Row label="Invalid">
          <CodeInput value="48219370" onChange={() => {}} invalid />
        </Row>
        <Row label="Disabled">
          <CodeInput value="4821" onChange={() => {}} disabled />
        </Row>
      </Section>
    </main>
  );
}
