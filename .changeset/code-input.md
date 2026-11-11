---
"ama-ui": minor
---

- `code-input`: Pattern/Code input, the 8-digit email sign-in code with one digit per box. Digits only (`inputmode="numeric"`, the first box offers `autocomplete="one-time-code"`). Typing moves to the next box and backspace to the previous one; a pasted or autofilled code fills every box; `onComplete` fires when the last box is filled. `invalid` draws destructive borders and sets `aria-invalid`; `disabled`; `length` (default 8). It never checks the code. Built from Input.
