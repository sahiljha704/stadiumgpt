# AI Architecture Document: StadiumGPT – AI Stadium Copilot

## 1. AI Architecture Overview

StadiumGPT is designed as an **AI Copilot**, moving beyond conversational interfaces to become an active reasoning engine. The architecture leverages **Google Gemini (1.5 Pro & Flash)** for multimodal reasoning, grounded entirely in real-time telemetry from stadium sensors, cameras, and backend systems.

### 1.1 Core AI Layers
1. **Context Layer:** Ingests live telemetry (Computer Vision, IoT, ticketing, weather) and maintains the current state of the stadium.
2. **Memory Layer:** Manages short-term conversation context, user preferences (e.g., accessibility needs), and active incident states.
3. **Reasoning Layer:** Evaluates constraints, compares alternatives, and formulates a logical action plan based on the injected context.
4. **Decision & Recommendation Layer:** Synthesizes the reasoning into actionable UI events (e.g., highlighting a map, drawing a route) and natural language explanations.
5. **Safety & Moderation Layer:** Enforces guardrails, preventing hallucinated emergency advice or unverified claims.
6. **Notification Layer:** Autonomously generates personalized and broadcast announcements based on Operator-approved AI insights.

---

## 2. Context Engineering

Gemini acts as a function of its context. Rather than answering blindly, every request is enriched with a **Context Payload** before hitting the API.

### 2.1 Context Payload Structure
When a query is made, the backend retrieves real-time data and injects it into a structured JSON envelope:
*   **User Context:** Role (Fan/Operator), Exact Location (Sector/Seat), Preferences (e.g., wheelchair access, language).
*   **Stadium State:** Active incidents, global queue wait times, crowd density heatmaps.
*   **Temporal Context:** Match status (pre-game, half-time, egress), weather, time of day.
*   **Visual Context:** Relevant computer vision detections (e.g., density metrics at the user's nearest gate).

---

## 3. Prompt Pipeline & Injection

### 3.1 Dynamic System Prompts
The System Prompt is not static. It is a compiled template injected with live variables.

**Structure:**
1. **Persona & Guardrails:** "You are StadiumGPT. You must prioritize safety. Do not hallucinate."
2. **Live Telemetry:** "Current Wait Times: Gate A (12m), Gate C (25m - HIGH). Active Incidents: Medical issue at Block 104."
3. **Task Definition:** "Analyze the user's request. Compare available options. Respond in strict JSON containing 'reply' and 'uiAction'."

### 3.2 Optimization & Management
*   **Token Efficiency:** Context is compressed. Instead of passing raw camera data, CV models push aggregated integers (e.g., `density_score: 85`).
*   **RAG (Retrieval-Augmented Generation):** Static policies (emergency evacuation plans, restricted items) are embedded and retrieved only when relevant using Vector Search.

---

## 4. Reasoning Engine

Gemini does not map "Question -> Answer". It maps "Question + Context -> Analysis -> Decision -> Output".

### 4.1 The Reasoning Loop
1.  **Collect:** Parse user intent and gather relevant context.
2.  **Evaluate:** Generate candidate solutions (e.g., Route 1 vs. Route 2).
3.  **Simulate:** Check constraints (e.g., Is Route 1 blocked by an active incident?).
4.  **Decide:** Select the optimal solution.
5.  **Explain:** Formulate the response ("I suggest Gate A instead of Gate C because...").

### 4.2 Confidence System
If Gemini encounters conflicting data or ambiguous intent, it calculates a confidence score. If confidence is low, it triggers a **Fallback**: "I'm seeing conflicting crowd data for Gate C. Please consult a steward nearby."

---

## 5. Computer Vision Integration

Gemini acts as the "brain", while Computer Vision (CV) acts as the "eyes".
1.  **Detection:** Edge YOLO models process RTSP streams.
2.  **Aggregation:** Edge nodes aggregate bounding box counts into discrete events (e.g., `event_type: "queue_overflow", location: "Gate C", severity: "high"`).
3.  **Ingestion:** The backend receives the event and updates the Firestore state.
4.  **Reaction:** Gemini detects the state change and can proactively generate a notification to the Operator Dashboard, suggesting a gate closure.

---

## 6. Emergency AI & Safety

### 6.1 Emergency Workflow
1.  **Trigger:** A fan reports an issue, or CV detects an anomaly (e.g., Person Down).
2.  **Classification:** Gemini immediately classifies the severity (Low, Medium, Critical).
3.  **Operator Alert:** Critical alerts bypass normal chat queues and flash immediately on the Operator Dashboard.
4.  **Containment Guidance:** Gemini generates localized instructions for fans in the affected zone (e.g., "Please clear aisle 4, medical teams are en route").
5.  **Strict Guardrails:** Gemini is hardcoded *never* to offer medical advice, only to route assistance.

---

## 7. AI Workflows (Examples)

### Workflow 1: The Food Run
*   **Input:** Fan asks, "Where should I get a burger?"
*   **Context Injected:** Fan is at Sector 10. Burger Stand North wait is 20m. Burger Stand South wait is 5m.
*   **Reasoning:** Stand North is closer, but wait time negates the proximity advantage.
*   **Output:** "Burger Stand South is slightly further, but has a much shorter line (5 mins). I've highlighted the route for you." (Triggers `uiAction` to highlight map).

### Workflow 2: Proactive Operator Alert
*   **Event:** CV detects crowd density at Gate C rising 40% over 5 minutes.
*   **Context:** Pre-match rush is beginning. Gate D is currently underutilized.
*   **Reasoning:** A crush hazard is forming. Load balancing is required.
*   **Output (To Operator):** "Warning: Gate C density critical. Recommendation: Reroute Sector 1 & 2 ticket holders to Gate D." (Provides 1-click execution button).

---

## 8. AI Dashboard & Analytics

The Operator Dashboard includes an "AI Insights" panel:
*   **Predictive Analytics:** "Based on current egress patterns, the North Metro Station will hit capacity in 15 minutes."
*   **Sentiment Analysis:** Aggregated insights from fan queries to identify hidden friction points.
*   **Automated After-Action Reports:** Generated post-match, summarizing incidents, average response times, and AI resolution rates.
