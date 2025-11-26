# Design Guidelines: To-Do List App

## Design Approach
**Reference-Based:** Maintaining the existing UI design provided in the mockup, with modern task management apps like Todoist and TickTick as secondary inspiration for interaction patterns.

## Core Design Principles
1. **Mobile-First:** Optimized for mobile with responsive desktop support
2. **Action-Oriented:** Quick task creation and editing with minimal friction
3. **Visual Progress:** Clear weekly completion tracking at a glance
4. **Clean Minimalism:** Focused interface without visual clutter

## Color Palette
- **Primary Blue:** #4461F2 (buttons, active states, accents)
- **Gradient Background:** Blue gradient for onboarding (lighter blue to #4461F2)
- **Background:** Light neutral (off-white/very light gray)
- **Text:** Dark gray for primary text, medium gray for secondary
- **Success:** Green for completed tasks
- **Surface:** White cards with subtle shadows

## Typography
- **Font Family:** Inter or similar modern sans-serif via Google Fonts
- **Headings:** 24-28px semibold for screen titles
- **Task Titles:** 16px medium weight
- **Body/Meta:** 14px regular for descriptions, timestamps
- **Small Text:** 12px for labels and helper text

## Layout System
- **Spacing Units:** Tailwind units of 2, 4, 6, and 8 (p-2, m-4, gap-6, py-8)
- **Container:** max-w-md for mobile-first, max-w-2xl for desktop
- **Card Padding:** p-4 to p-6
- **Section Gaps:** space-y-4 to space-y-6

## Screen-Specific Guidelines

### Onboarding Screen
- Full-height gradient background (blue gradient top to bottom)
- Zigzag/wave pattern overlay as decorative element
- Centered welcome content with app icon/illustration
- Bold headline and brief description
- Primary CTA button to get started
- Skip option if returning users

### Home Screen Layout
**Header:**
- App title/logo on left
- Search icon and settings/gear icon on right
- Clean, minimal header with light bottom border

**Weekly Calendar:**
- Horizontal scrollable week view
- Current week displayed by default
- Each date clickable with distinct active/selected state
- Date circles showing day number, weekday label below
- Visual indicator for dates with tasks
- Selected date highlighted with primary blue background

**Task List Section:**
- "Today's Tasks" heading with task count badge
- Each task card contains:
  - Checkbox (left) - large touch target for marking complete/incomplete
  - Task title (bold, 16px)
  - Time range display (start - end time)
  - Description text (if present, 14px, gray)
  - Edit and delete icons (right side)
- Completed tasks show strikethrough text and green checkbox
- Empty state with friendly illustration when no tasks

**Weekly Progress Widget:**
- Compact card showing week overview
- "This Week" heading
- Two columns: Completed count vs Pending count
- Visual progress bar or circular progress indicator
- Subtle background differentiation from main content

**Floating Action Button (FAB):**
- Fixed bottom-right position
- Large circular button with + icon
- Primary blue background
- Subtle shadow for depth
- Opens task creation modal

### Task Creation/Edit Modal
- Slides up from bottom (mobile) or centered modal (desktop)
- White background with rounded top corners
- Close/back button top-left
- Form fields with clear labels:
  - Task title input (large, prominent)
  - Date selector (clickable, opens calendar picker)
  - Start time picker
  - End time picker
  - Description textarea (optional, expandable)
- Save button at bottom (full-width, primary blue)
- Cancel/discard option

### Search Interface
- Search icon triggers search input overlay
- Real-time filtering as user types
- Highlight matching text in results
- Easy dismiss to return to main view

## Component Library

### Buttons
- **Primary:** Solid blue background (#4461F2), white text, rounded-lg
- **Secondary:** Outlined with blue border, blue text
- **Icon Buttons:** Circular or square, subtle hover states
- **Floating Action:** Large, circular, primary blue with white icon

### Form Inputs
- Rounded borders (rounded-md)
- Clear labels above inputs
- Focus state with blue outline
- Adequate padding for touch targets (p-3)

### Cards
- White background
- Subtle shadow (shadow-sm)
- Rounded corners (rounded-lg)
- Padding p-4 to p-6
- Proper spacing between elements

### Interactive Elements
- **Checkboxes:** Large custom checkboxes (20px minimum)
- **Date Pills:** Clickable date selectors with active states
- **Time Pickers:** Native or custom time selection
- **Edit/Delete Icons:** Small, subtle icons with clear tap targets

### Progress Indicators
- Clean progress bars or circular progress
- Color-coded (blue for progress, green for complete)
- Percentage or count display

## Interactions & Animations
- **Minimal, Purposeful Animations:**
  - Checkbox check/uncheck: subtle scale animation
  - Task completion: smooth strikethrough animation
  - Modal slide-in/out: 200-300ms ease transitions
  - FAB: gentle pulse or shadow lift on hover
- **Avoid:** Excessive scroll animations, distracting transitions

## Accessibility
- Minimum touch target: 44x44px for all interactive elements
- High contrast text (WCAG AA minimum)
- Clear focus indicators for keyboard navigation
- Semantic HTML for screen readers
- Descriptive aria-labels for icon-only buttons

## Responsive Behavior
- **Mobile (base):** Single column, full-width cards, bottom navigation
- **Tablet (md:):** Increased padding, max-width containers
- **Desktop (lg:):** Centered layout (max-w-2xl), side-by-side modals when appropriate

## Images
No hero images required. This is a utility-focused app prioritizing functionality over imagery. Use simple illustrations or icons for empty states and onboarding only.