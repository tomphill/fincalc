# UI Components

All components must use shadcn UI. No custom UI components should be created.

1. Before building any UI element, check `src/components/ui/` for an existing shadcn component.
2. If none exists, search the shadcn registry at `https://ui.shadcn.com/docs/components` for an appropriate component. Install it with:
   ```
   npx shadcn@latest add <component-name>
   ```
3. Never write raw HTML elements for UI (e.g., bare `<button>`, `<input>` tags). Use the shadcn component equivalent.
4. Maintain the existing shadcn component's API and styling — do not inline custom variants or styles.
