# @krayavikrayam/ui

Shared UI primitives (Button, Card) for the Krayavikrayam apps.

Components use Tailwind utility class names and design-system CSS variables
(e.g. `--primary`, `--card`, `--border`). Consumers must include these tokens
in their global CSS and run Tailwind over `packages/ui/src/**/*.{ts,tsx}` via
the shared `tailwind-preset` from `@krayavikrayam/config`.

## Usage

```tsx
import { Button, Card, CardHeader, CardTitle, CardContent } from "@krayavikrayam/ui";

export function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hello</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="primary">Click</Button>
      </CardContent>
    </Card>
  );
}
```
