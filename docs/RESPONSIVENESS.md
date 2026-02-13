# Logic-Driven Responsiveness (Angular CDK)

The app uses **Angular CDK BreakpointObserver** for logic-driven responsiveness so layout and visibility can react to viewport changes in TypeScript, not only in CSS.

## Breakpoints (aligned with global SCSS)

Defined in **`shared/constants/breakpoints.ts`**:

| Name     | Media query           | Use        |
|----------|------------------------|------------|
| `MOBILE` | `(max-width: 768px)`   | Phones     |
| `TABLET` | `(max-width: 1200px)`  | Tablets    |
| `DESKTOP`| `(min-width: 1201px)` | Large screens |

These match the breakpoints in **`src/styles.scss`** so CSS and TS stay in sync.

## BreakpointService

**Location:** `core/services/breakpoint.service.ts`

- Uses CDK **BreakpointObserver** to observe the app breakpoints.
- Exposes **signals**: `mode()`, `isMobile()`, `isTablet()`, `isDesktop()`.
- Exposes **observable**: `mode$` for subscription-based usage.
- **`mode`** is one of: `'mobile' | 'tablet' | 'desktop'`.

**Usage in a component:**

```ts
import { BreakpointService } from '../../core/services/breakpoint.service';

export class MyComponent {
  readonly breakpoint = inject(BreakpointService);
}
```

Template:

```html
<div [class.my-grid--mobile]="breakpoint.isMobile()"
     [class.my-grid--tablet]="breakpoint.isTablet()"
     [class.my-grid--desktop]="breakpoint.isDesktop()">
  ...
</div>
```

Then in SCSS define `.my-grid--mobile`, `.my-grid--tablet`, `.my-grid--desktop` (e.g. different `grid-template-columns`).

## Structural directives

**Location:** `shared/directives/responsive.directive.ts`

- **`*appShowWhen="'mobile'"`** – show the host only on mobile.
- **`*appShowWhen="'tabletOrDesktop'"`** – show on tablet and desktop (hide on mobile).
- **`*appHideWhen="'mobile'"`** – hide on mobile (show on tablet and desktop).

Values: `'mobile' | 'tablet' | 'desktop' | 'tabletOrDesktop' | 'mobileOrTablet'`.

**Example:**

```html
<div class="page-header__search" *appHideWhen="'mobile'">
  <!-- Search bar hidden on mobile -->
</div>
```

## Where it’s used

- **PageHeader:** Search bar is hidden on mobile (`*appHideWhen="'mobile'"`); header gets `.page-header--mobile` for styling (e.g. hide user name).
- **Product Lab:** `.portfolio-grid` and `.templates-row` get `--mobile` / `--tablet` / `--desktop` classes; global SCSS sets column count from those classes.
- **Dashboard:** `.content-area` gets `--mobile` / `--tablet` / `--desktop`; dashboard SCSS changes grid areas and KPI columns from those classes.

## Adding new responsive behavior

1. Inject **BreakpointService** and bind `breakpoint.isMobile()`, `breakpoint.isTablet()`, or `breakpoint.isDesktop()` to `[class.xxx--mobile]` etc.
2. Or use **`*appShowWhen`** / **`*appHideWhen`** for show/hide by breakpoint.
3. Define the actual layout in SCSS using the same breakpoint names (and optionally keep CSS `@media` as fallback).
