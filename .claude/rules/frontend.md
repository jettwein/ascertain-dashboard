---
paths:
  - "src/components/**"
  - "src/pages/**"
  - "src/app/**"
  - "**/*.tsx"
  - "**/*.jsx"
---

# Frontend Rules

- Use functional components with hooks — no class components
- Props must have TypeScript interfaces, not inline types or `any`
- Components over 100 lines should be split into smaller components
- Use `useCallback` and `useMemo` only when there's a measured performance issue, not preemptively
- Accessibility: all interactive elements need `aria-label` or visible label text, all images need `alt`
- Never use `dangerouslySetInnerHTML` without explicit sanitization
- CSS class naming: use the project's convention (Tailwind utilities, CSS modules, or styled-components)
- Test user behavior, not implementation details — prefer `getByRole` and `getByText` over `getByTestId`
