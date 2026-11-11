---
"ama-ui": minor
---

Patterns: a new registry section (`registry/ama/patterns/`, installed as `@ama/<name>` into `components/patterns/`) for the Figma `Pattern/...` components. ama-ui draws, ama-os decides (ADR-0020): props and events only.

- `person-row`: Pattern/Person row for Settings, Users and roles. Avatar (photo or initials), name, email and company, the role badge, and Invited until the invite is accepted. With `onSelect` the whole row is one 64px button with a chevron.
