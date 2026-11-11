import * as React from "react";
import { UserPlus } from "lucide-react";
import { CodeInput } from "@/components/patterns/code-input";
import { PersonRow } from "@/components/patterns/person-row";
import { PhonePageHeader } from "@/components/patterns/phone-page-header";
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
