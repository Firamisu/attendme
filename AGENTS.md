# AGENTS.md

Last updated: 2026-02

## Project DNA – Quick Rules for AI agents & contributors

### Core stack
- Vue 3 (Composition API + `<script setup lang="ts">`)
- TypeScript (strict mode)
- Tailwind CSS (mobile-first by default)
- Auto-generated API client → `backend/`
- Brutalist design language

### Design & UX guidelines (Brutalist + mobile-first)

1. Mobile first – always
   - Start writing classes from smallest screen
   - Use `min-[size]:` only when you need to **change** something bigger

2. Brutalist rules we follow
   - No rounded corners (or very large ones ≥ 12px only when functionally needed)
   - No shadows (except maybe very hard 1–2px black border inset/outset)
   - No gradients (solid colors only)
   - High contrast, mostly black / white / raw brand colors
   - Monospace font stack is allowed and often preferred
   - Asymmetric / "ugly on purpose" layouts are okay
   - Big, bold typography – generous line-height (1.4–1.6)
   - Very visible focus states (outline-4 outline-black outline-offset-2)
   - Buttons look like buttons (thick borders, large padding, no hover fluff)
   - Almost no transitions (instant or ≤ 80ms)
