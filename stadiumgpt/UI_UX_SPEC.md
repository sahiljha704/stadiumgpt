# UI/UX Specification Document: StadiumGPT – AI Stadium Copilot

## 1. Design Philosophy

StadiumGPT follows **Material Design 3 (M3)** principles, tailored to feel like a premium, professional Google product. The interface prioritizes clarity, speed, and contextual awareness. It avoids unnecessary visual noise, employing generous negative space, sophisticated typography, and purposeful micro-interactions. The design must inspire trust in chaotic environments (like a stadium) while remaining highly accessible.

## 2. Design System

### 2.1 Typography
*   **Primary Font:** `Inter` (Sans-serif) for all UI text, offering excellent legibility at small sizes.
*   **Display Font:** `Space Grotesk` for headings, large metrics, and branding to provide a modern, technical, yet approachable feel.
*   **Hierarchy:**
    *   Display Large: 57px, Space Grotesk, Light
    *   Headline Medium: 28px, Space Grotesk, Regular
    *   Title Medium: 16px, Inter, Medium
    *   Body Medium: 14px, Inter, Regular
    *   Label Small: 11px, Inter, Medium (All Caps)

### 2.2 Color Palette
*   **Primary (Brand):** Google Blue (`#1A73E8`). Used for primary actions, active states, and AI highlights.
*   **Secondary:** Stadium Slate (`#3C4043`). Used for secondary text, borders, and subdued icons.
*   **Surface / Background:**
    *   Light Mode: White (`#FFFFFF`) cards on Off-White (`#F8F9FA`) background.
    *   Dark Mode: Dark Slate (`#202124`) cards on True Black (`#000000`) background.
*   **Semantic / Status:**
    *   Success/Safe: Green (`#1E8E3E`)
    *   Warning/Congested: Orange (`#F29900`)
    *   Critical/Emergency: Red (`#D93025`)
    *   Info/AI: Purple (`#A142F4`) (Differentiates AI-generated insights from standard data)

### 2.3 Grid & Spacing
*   **Base Unit:** 8px. All padding, margins, and heights are multiples of 8 (e.g., 8, 16, 24, 32, 64).
*   **Grid:** 12-column responsive grid with 24px gutters for desktop, 4-column with 16px gutters for mobile.

### 2.4 Components
*   **Cards:** 16px padding, 12px border radius, subtle drop shadow (`0 1px 2px rgba(0,0,0,0.05)`). No borders in light mode unless separating flat surfaces.
*   **Buttons:** Fully rounded (pill shape) for primary actions. 44px minimum height for touch targets.
*   **Inputs:** Filled style (light gray background, no border) with an underline that animates on focus.
*   **Snackbars / Toasts:** Used for real-time notifications (e.g., "Gate C is now congested"). Placed bottom-center on mobile, bottom-left on desktop. Black background with white text, highly elevated.
*   **Loading Skeletons:** Shimmering gray blocks mirroring the final content layout to reduce perceived wait times.

## 3. Web Pages & Application Structure

### 3.1 Fan Experience (Mobile-First)

**A. Fan Dashboard & AI Assistant (The Copilot)**
*   **Purpose:** The central hub for the fan. Combines conversational AI with quick contextual actions.
*   **Layout:** Vertical stack. Sticky header (Location/Match Status) -> Scrollable Chat History -> Fixed bottom input area.
*   **Components:** 
    *   **Interactive SVG Stadium Map:** A collapsible card at the top. Fans can pan/zoom to see highlighted paths, restrooms, or their seat.
    *   **Chat Interface:** Clean message bubbles. AI responses include rich UI cards (e.g., a "Food Menu" card, not just text).
    *   **Toast Notifications:** Real-time alerts drop down from the top (e.g., "Goal! Argentina 1 - 0 France").
*   **AI Interactions:** Typing indicators, streaming text. AI can trigger map overlays (e.g., "Show me the route" highlights the SVG map).

**B. Emergency Mode**
*   **Purpose:** Instant access to help.
*   **Layout:** Triggered via a persistent red SOS icon. Opens a full-screen modal.
*   **Components:** Large one-touch buttons for Medical or Security. Auto-sends GPS/indoor location to the Operator Dashboard.

### 3.2 Operator Experience (Desktop-First)

**A. Operator Dashboard**
*   **Purpose:** Global overview of stadium health.
*   **Layout:** Responsive bento-box grid.
*   **Components:**
    *   **KPI Banner:** Top row showing Attendance, Active Incidents, Avg Wait Time.
    *   **Live Heatmap:** A massive, dark-themed SVG map of the stadium overlaying real-time crowd density (Blue -> Yellow -> Red).
    *   **Timeline Chart:** Recharts area graph showing ingress/egress velocity.
    *   **Incident Feed:** A side panel listing real-time alerts.
*   **AI Interactions:** Predictive Alerts ("AI Warning: Sector 4 likely to crush in 10 mins").

**B. Analytics & Reporting**
*   **Purpose:** Post-match review and forecasting.
*   **Layout:** Standard data table and charting layouts.
*   **Components:** Date pickers, export buttons, complex data grids.

## 4. User Experience & Micro-Interactions

### 4.1 Onboarding & Authentication
*   **Flow:** Frictionless. Single Sign-On (Google/Apple) -> Ticket Scan (QR/NFC) -> Instant access. No lengthy profile setup required to get emergency help.

### 4.2 Micro-Interactions
*   **Hover States:** Slight upward translation (`translate-y-[-2px]`) and increased shadow on desktop cards.
*   **Chat Animations:** New messages slide up and fade in (`duration: 300ms, ease-out`).
*   **Map Transitions:** Smooth camera panning when the AI focuses on a specific stadium sector.
*   **Button Ripples:** Material Design standard ripple effect on click/tap to confirm registration of touch.

## 5. Accessibility (A11Y)

*   **WCAG 2.1 AA Compliance:** Minimum contrast ratio of 4.5:1 for all text.
*   **Keyboard Navigation:** Visible focus rings (`ring-2 ring-blue-500`) on all interactive elements. Semantic HTML structure for screen readers.
*   **Color Blindness:** Status indicators never rely on color alone. (e.g., An error uses the color red AND a warning icon `!`).
*   **Touch Targets:** Minimum 44x44px hit areas on mobile devices.

## 6. User Flows

### Fan Journey Example (Food Run)
1. Fan opens app. Default view is the AI Chat.
2. Fan types or speaks: "Where is the shortest line for a hot dog?"
3. Gemini processes location and queries Firestore for queue lengths.
4. Gemini responds with text ("Stand 14 has a 2-min wait") AND injects a Map Card into the chat.
5. Fan taps "Show Route" on the card. The Interactive SVG map expands, highlighting the path from their current seat to Stand 14.

### Operator Journey Example (Crowd Management)
1. Operator monitors the desktop Dashboard.
2. The UI flashes a yellow Toast Notification: "Anomaly detected: Gate A density rising rapidly."
3. Operator clicks the toast. The main view shifts to focus on Gate A's camera feed and data metrics.
4. Gemini side-panel suggests: "Recommendation: Open Overflow Gate B and send push notification to Sector 1."
5. Operator clicks "Execute".

## 7. Hackathon Polish Priorities
To impress judges with UI/UX:
1.  **Nail the Chat Interface:** It must feel exactly like the native Gemini web app. Smooth streaming text, markdown support, and rich interactive cards mixed with text.
2.  **The Interactive SVG:** A static image is boring. Use a scalable SVG where individual sections can be highlighted via state changes (e.g., `fill-blue-500`).
3.  **Skeleton Loaders:** Never show a blank white screen or a generic spinner. Use shimmering placeholders.
4.  **Toast System:** Build a global context for toasts. Seeing system alerts pop up across different views proves real-time capability.
