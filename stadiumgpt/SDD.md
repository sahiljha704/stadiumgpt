# Software Design Document (SDD): StadiumGPT – AI Stadium Copilot

## 1. System Architecture

**Overall Architecture Pattern: Event-Driven Modular Monolith transitioning to Microservices**
*   **Why selected:** Provides the rapid iteration speed required for a hackathon while establishing clear domain boundaries that allow seamless scaling into microservices for production.
*   **Advantages:** Lower initial operational overhead, simplified deployment, strong consistency for core features.
*   **Alternatives:** Pure Serverless (too high latency for continuous CV streams), Pure Microservices (too complex to orchestrate in a hackathon timeframe).
*   **Limitations:** Scaling specific highly-loaded components (like the CV pipeline) requires decoupling early.

**Component Breakdown:**
*   **Frontend Layer:** React.js (Vite) + Tailwind CSS + PWA Support.
*   **Backend Layer:** FastAPI (Python) for core business logic, real-time WebSockets, and AI orchestration.
*   **AI Layer:** Google Vertex AI (Gemini 1.5 Pro/Flash) for multimodal reasoning.
*   **Computer Vision Layer:** OpenCV + PyTorch running on dedicated edge/cloud instances analyzing RTSP streams.
*   **Database Layer:** Firebase (Firestore) for real-time document sync and state management. Cloud SQL (PostgreSQL) for structured historical data.
*   **Authentication Layer:** Firebase Authentication with RBAC (Role-Based Access Control).

## 2. Frontend Architecture

**Framework:** React 18+ with Vite and TypeScript.
*   **Why:** Blazing fast compilation, strict type safety, and massive ecosystem.
*   **Alternatives:** Next.js (SSR is overkill for a highly dynamic, authenticated dashboard app).
*   **State Management:** Zustand for global state (lightweight, zero-boilerplate), React Query for server state caching.
*   **Styling:** Tailwind CSS + shadcn/ui. Ensures Google-like Material design aesthetics without writing boilerplate CSS.

**Core Principles:**
*   **Responsive:** Desktop-first for Operator Dashboard; Mobile-first for Fan Experience.
*   **Offline Strategy (PWA):** Service workers cache static assets and the core stadium map. If connectivity drops, users can still view static maps and emergency protocols.
*   **Error Handling:** React Error Boundaries at the route level. Graceful degradation (if WebSockets fail, fallback to HTTP polling).

## 3. Web Pages

### 3.1 Fan Experience
*   **Landing/Auth Page:**
    *   *Purpose:* Onboarding and secure login.
    *   *AI Features:* None.
*   **Fan Dashboard (The Copilot):**
    *   *Purpose:* Primary interface for attendees.
    *   *Components:* Conversational chat UI, Quick action chips (Food, Washroom, Exit), Live match widget.
    *   *API:* WebSocket to FastAPI, Firestore listeners.
*   **Live Stadium Map:**
    *   *Purpose:* Visual navigation.
    *   *Components:* Interactive SVG/Canvas map, dynamic routing lines, POI markers.
    *   *Loading:* Progressive loading of map layers.

### 3.2 Operator Experience
*   **Operator Dashboard (Control Room):**
    *   *Purpose:* Real-time situational awareness.
    *   *Components:* Density heatmaps, active incident queue, timeline charts.
    *   *AI Features:* Proactive alerts (e.g., "Queue at Gate C exceeding threshold").
*   **Incident Management Panel:**
    *   *Purpose:* Triage and dispatch.
    *   *Actions:* Assign security, resolve medical alerts.

## 4. Backend Architecture

**Framework:** FastAPI (Python 3.11+)
*   **Why:** Native async support makes it ideal for handling hundreds of concurrent WebSocket connections and I/O bound Gemini API calls. Python is the industry standard for integrating Computer Vision (PyTorch/OpenCV).
*   **Advantages:** Automatic OpenAPI documentation, strict Pydantic validation, blazing fast execution.
*   **Alternatives:** Node.js/Express (Lacks native integration for heavy data science/CV libraries).

**Structure:**
*   **API Gateway:** NGINX or Cloud Run routing to handle SSL termination and rate limiting.
*   **Real-Time Communication:** FastAPI WebSockets. Redis Pub/Sub backplane to scale WebSocket instances across multiple workers.
*   **Background Jobs:** Celery + Redis for asynchronous tasks (e.g., generating end-of-match analytics reports).

## 5. Database Design (Conceptual)

**Primary Datastore:** Cloud Firestore (NoSQL)
*   **Why:** Unbeatable real-time synchronization capabilities to client devices without managing complex WebSocket payloads manually.

**Collections:**
1.  `users`: ID, Role (Fan/Operator), Preferences.
2.  `incidents`: ID, Type, Location, Status, AssignedTo, Timestamps, AI_Summary.
3.  `locations`: POI data (Gates, Washrooms, Food). Includes `current_wait_time` (updated by CV layer).
4.  `chat_sessions`: User ID, Message History, Context Payload.

## 6. Gemini AI Architecture

**Flow:**
1.  **Context Injection:** When a fan asks a question, the frontend sends the message + the fan's geolocated coordinates + current match time.
2.  **State Retrieval:** FastAPI queries Firestore for real-time state (e.g., "Wait time at Washroom A is 15 mins, Washroom B is 2 mins").
3.  **Prompt Assembly:** A dynamic system prompt is constructed combining the user's request, the live stadium state, and safety guardrails.
4.  **Reasoning:** Gemini processes the data. It recognizes Washroom A is closer but congested, so it recommends Washroom B.
5.  **Function Calling / Tools:** Gemini can output structured JSON to trigger UI events on the frontend (e.g., `{"action": "draw_route", "destination": "washroom_b"}`).

## 7. Computer Vision System

**Pipeline:**
1.  **Ingestion:** RTSP streams from stadium CCTV (or pre-recorded `.mp4` for the hackathon).
2.  **Detection (YOLOv8):** Analyzes frames every 1 second (1 FPS is sufficient for crowd dynamics and saves compute). Detects `person`, `bag`.
3.  **Tracking & Analytics (DeepSORT):** Tracks objects across frames to determine directional flow (ingress vs. egress) and count queue lines.
4.  **Aggregation:** Edge node calculates "Queue Wait Time" based on person count / service rate.
5.  **Emission:** Pushes aggregated metrics to FastAPI via gRPC or REST, which then updates Firestore.

## 8. Live Data Flow

1.  **Camera** captures crowd -> **Vision Service** extracts density integer -> **FastAPI** validates -> **Firestore** updates document.
2.  **Firestore** triggers real-time snapshot listener on **Operator Dashboard** (Frontend).
3.  **Gemini AI** queries **Firestore** on the next Fan request to provide routing based on the new density.

## 9. API Design

*   **Auth APIs:** `POST /api/auth/verify`
*   **AI APIs:** `POST /api/ai/chat` (Accepts message, location, context; Returns AI text + UI actions)
*   **Vision APIs:** `POST /api/vision/ingest` (Internal API for CV worker to push metrics)
*   **Dashboard APIs:** `GET /api/operator/stats`, `GET /api/operator/incidents`
*   **Emergency APIs:** `POST /api/emergency/trigger` (Creates high-priority incident, alerts WebSockets)

## 10. Authentication & Security

*   **Provider:** Firebase Authentication.
*   **Flow:** User authenticates via Google/Email on client -> Client gets JWT -> Client sends JWT in `Authorization: Bearer` header to FastAPI.
*   **Validation:** FastAPI uses Firebase Admin SDK to verify the token signature and extract the user's UID and custom claims (Roles).
*   **RBAC:** Routes prefixed with `/api/operator/` strictly require the `operator` custom claim.
*   **Prompt Security:** All inputs to Gemini are sanitized. System prompts are hardcoded server-side to prevent prompt injection.

## 11. Performance Optimization

*   **Lazy Loading:** React components (e.g., Heavy mapping libraries or charting tools) are imported dynamically using `React.lazy`.
*   **Virtualization:** Long chat histories and incident logs use windowing/virtualization to maintain 60fps scrolling.
*   **CV Quantization:** The YOLO model is quantized (INT8) to run on CPU/Edge TPU for cost-efficiency during the hackathon.

## 12. Cloud Architecture (Google Cloud Platform)

*   **Frontend Host:** Firebase Hosting (global CDN).
*   **Backend Host:** Google Cloud Run (Serverless containers, scales to zero, handles high concurrency).
*   **AI Layer:** Vertex AI (Enterprise-grade endpoint for Gemini API, ensuring data privacy).
*   **Database:** Firebase Firestore (Realtime DB).
*   **Storage:** Google Cloud Storage (For storing incident images or recorded anomaly clips).
*   **CI/CD:** Google Cloud Build (Triggers on GitHub push).

## 13. Development Roadmap (Hackathon Execution)

*   **Phase 1: Foundation (Day 1 - Morning)**
    *   Goal: Repo setup, Firebase Auth, CI/CD pipeline, dummy data models.
*   **Phase 2: The Core Loop (Day 1 - Afternoon)**
    *   Goal: Connect React Frontend -> FastAPI -> Gemini API. Establish basic conversational UI.
*   **Phase 3: The Wow Factor (Day 2 - Morning)**
    *   Goal: Integrate Computer Vision scripts (running on a pre-recorded video of a crowd). Send live density data to Firestore. Have Gemini reason over this live data.
*   **Phase 4: Operator & Polish (Day 2 - Afternoon)**
    *   Goal: Build the Operator Dashboard using Recharts. Ensure the UI looks like a polished Google product.

## 14. Folder Structure

```text
/stadiumgpt-monorepo
├── /frontend               # React/Vite/Tailwind
│   ├── /src
│   │   ├── /components     # UI components (Buttons, Cards)
│   │   ├── /features       # Domain logic (Chat, Map, Dashboard)
│   │   └── /store          # Zustand state
├── /backend                # FastAPI
│   ├── /api                # Route handlers
│   ├── /core               # Config, Auth, Security
│   ├── /services           # Gemini integration, DB access
│   └── main.py             # Entry point
├── /cv-pipeline            # Python/OpenCV
│   ├── /models             # YOLO weights
│   ├── /streams            # Video processing scripts
│   └── ingest.py           # Script to push data to Backend
└── /infra                  # Terraform / Deployment configs
```

## 15. Testing Strategy

*   **Unit Testing:** `pytest` for Python backend logic (especially prompt construction). `Vitest` for React components.
*   **AI Testing:** Automated scripts that feed Gemini 50 diverse questions (e.g., "Where is the bathroom?", "My chest hurts") to ensure consistent intent classification and safety.
*   **Vision Testing:** Run CV models against known baseline videos to calculate accuracy of crowd counting.

## 16. Hackathon Strategy for Winning

1.  **Fake the Hardware, Build the Software:** Do not waste time setting up physical IP cameras. Use loopable MP4 videos of crowds and process them locally, streaming the data to the cloud to simulate real cameras.
2.  **Focus on the AI "Reasoning", not just "Chat":** Judges see a million chatbots. StadiumGPT will stand out because the AI *changes its answer* based on the CV data (e.g., routing fans away from a bottleneck). This proves contextual awareness.
3.  **Impeccable UI:** Use the Shadcn/UI and Tailwind defaults. A polished, Material-inspired dashboard screams "Production Ready".
4.  **The Live Demo:** Side-by-side screens. Screen 1: Fan app asking for food. Screen 2: Operator dashboard showing a sudden surge at Food Stand A. Screen 1: The AI dynamically tells the fan to go to Food Stand B instead. This is the winning narrative.
