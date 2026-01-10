# Tally Integration Dashboard Design Guidelines

## Design Approach
**System**: Hybrid of Linear's data clarity + Stripe's professional restraint + Material Design components
**Rationale**: Financial dashboard requiring trust, clarity, and efficient data scanning. Premium feel through refined typography and generous spacing rather than decoration.

## Typography System
- **Primary Font**: Inter (via Google Fonts CDN)
- **Headings**: 
  - H1: 36px/2.5rem, Semi-bold (600), tight tracking (-0.02em)
  - H2: 28px/1.75rem, Semi-bold (600)
  - H3: 20px/1.25rem, Medium (500)
- **Body**: 
  - Large: 16px/1rem, Regular (400), line-height 1.6
  - Default: 14px/0.875rem, Regular (400), line-height 1.5
  - Small: 12px/0.75rem, Regular (400) for metadata
- **Numbers/Currency**: Tabular-nums feature, Medium weight (500) for emphasis

## Layout System
**Spacing Scale**: Tailwind units of 2, 4, 6, 8, 12, 16 (e.g., p-4, mb-8, gap-6)
**Container Strategy**: 
- Dashboard: Full-width with fixed sidebar (w-64), main content area with max-width constraints on cards
- Content padding: px-6 to px-8 on desktop, px-4 mobile
- Card spacing: p-6 for content cards, p-8 for feature sections

## Core Dashboard Layout
**Structure**: Persistent left sidebar navigation + top status bar + main content area

**Sidebar (Fixed, w-64)**:
- Company logo/name at top (h-16 with p-4)
- Navigation sections grouped: Overview, Ledger, Bills, Payments, Reports, Settings
- Active state: Subtle background treatment with font weight change
- Bottom: User profile card with avatar, name, role

**Top Bar (h-16)**:
- Search functionality (w-96 max on desktop)
- Notification bell icon
- Quick actions dropdown
- User avatar/menu

**Main Content Grid**:
- Dashboard view: 3-column grid on desktop (grid-cols-3), 1-column mobile
- Detail views: 2-column split (70/30) for content/sidebar on desktop
- Responsive breakpoints: Stack to single column below md

## Component Library

**Data Cards**:
- Elevated cards with subtle shadow (shadow-sm)
- Rounded corners (rounded-lg)
- Header with icon + title + action menu (h-14)
- Content area with generous padding (p-6)
- Footer for metadata/timestamps (border-top, pt-4)

**Tables (Ledger/Bills/Payments)**:
- Sticky header row with semi-bold labels
- Alternating row treatments for scannability
- Right-align numerical columns
- Row height: h-14 for comfortable clicking
- Action column (far right) with icon buttons
- Pagination below: centered, showing "Showing 1-20 of 500"

**Summary Widgets** (Dashboard Overview):
- Compact cards (min-h-32)
- Large number display (text-3xl, font-semibold, tabular-nums)
- Label below (text-sm, uppercase tracking)
- Trend indicator: Small icon + percentage change
- 4-column grid on desktop, 2-col tablet, 1-col mobile

**Bills Section Layout**:
- Filter bar: Date range picker + status dropdown + search
- Bill cards in list view: Left-aligned vendor name/invoice, center amount, right status badge + action button
- Quick view drawer: Slides from right (w-96), shows bill details without navigation

**Payment History**:
- Timeline view on left (date markers every h-12)
- Transaction cards with: Amount (large), description, payment method icon, timestamp
- Filter by: Date range, payment method, status

**Charts/Visualizations**:
- Cash flow chart: Line graph with dual-axis (h-80)
- Spending breakdown: Donut chart with legend (h-64)
- Use chart.js or recharts library
- Tooltips on hover with precise values

**Forms/Input Elements**:
- Input fields: h-10, rounded border
- Labels: text-sm, mb-2, font-medium
- Helper text: text-xs, mt-1
- Button heights: h-10 for primary actions, h-8 for secondary
- Consistent focus states across all inputs

**Navigation Tabs** (Sub-sections):
- Horizontal tabs for Ledger views (All, Receivables, Payables)
- Border-bottom treatment, active indicator below
- Height: h-12, evenly spaced

**Empty States**:
- Centered content with icon (w-16 h-16)
- Descriptive text (max-w-sm)
- Primary action button below
- Use for: No bills, no transactions, no search results

**Modals/Overlays**:
- Max-width: max-w-2xl for forms, max-w-4xl for detailed views
- Backdrop: Semi-transparent overlay
- Close button: top-right corner
- Actions: Bottom-aligned with Cancel (left) + Primary action (right)

## Icons
**Library**: Heroicons (via CDN)
- Navigation: 20px icons
- Action buttons: 16px icons
- Empty states/headers: 24px icons
- Financial indicators: Use outlined style for consistency

## Images
**Usage**: Minimal - dashboard is data-focused
- **No hero image** - immediate access to dashboard
- **Empty state illustrations**: Simple, line-art style SVG illustrations for "No data" states
- **User avatars**: Circular (w-10 h-10 in sidebar, w-8 h-8 in top bar)
- **Vendor/company logos**: Small squares (w-8 h-8) in transaction lists
- **Background patterns**: Subtle geometric pattern in sidebar only

## Animations
**Minimal Approach**:
- Page transitions: Simple fade (150ms)
- Dropdown menus: Slide-down (200ms)
- Loading states: Subtle pulse on skeleton screens
- No scroll animations, no parallax effects
- Hover: Subtle scale (1.02) on cards only

## Accessibility
- All interactive elements: min-h-10 touch targets
- Keyboard navigation: Visible focus rings throughout
- Screen reader labels on icon-only buttons
- ARIA labels for chart data points
- Color-independent status indicators (use icons + text)