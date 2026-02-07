# Scalable Real-Time Data Processor - Technical Assessment

## Overview
A high-performance monitoring dashboard utilizing **React Virtualization** to handle large datasets (5000+ records) without UI lag, coupled with a secure **Node.js/Express** backend featuring a custom-built Rate Limiter.

## Tech Stack
*   **Frontend:** React, TypeScript, Vite, TanStack Query, TanStack
Virtual, Tailwind CSS.
*   **Backend:** Node.js, Express, TypeScript, MongoDB, Mongoose.
*   **Key Features:** 
    *   Virtual Scroll (Infinite List Performance)
    *   Custom In-Memory Sliding Window Rate Limiter
    *   Compound Database Indexing

## Architectural Decisions

### 1. Frontend Performance (Virtualization)
**Problem:** Rendering 5000+ DOM nodes simultaneously causes significant browser lag and a poor user experience.
**Solution:** Implemented `@tanstack/react-virtual`. This headless, hook-based utility (`useVirtualizer`) calculates which items should be visible and provides the necessary styles to apply to your own components. This approach offers maximum control and performance by only rendering items in the viewport, keeping the DOM lightweight regardless of dataset size.

### 2. State Management & Real-time
**Decision:** Used `TanStack Query` (React Query).
**Reasoning:** It handles caching, background updates, and "stale-while-revalidate" logic out of the box. I enabled polling (`refetchInterval`) to simulate real-time data streams without the complexity of setting up a WebSocket server for this specific scope.

### 3. Backend Rate Limiter (Custom Implementation)
**Constraint:** No third-party libraries for rate limiting.
**Implementation:** Created a Sliding Window algorithm using a TypeScript `Map`.
*   Key: IP Address
*   Value: Object containing request count and window start timestamp.
*   Logic: If the current time exceeds the window, reset the counter. If within the window and limit is exceeded, return 429.
*   **Optimization:** Added a `setInterval` cleanup job to remove stale IP keys from the Map to prevent memory leaks.

### 4. Database Schema
**Optimization:** Created a Compound Index on `{ severity: 1, timestamp: -1 }`.
**Reasoning:** Dashboard queries typically filter by severity and always sort by most recent. This index allows MongoDB to fulfill these queries efficiently without in-memory sorting.

## Setup Instructions

### Backend
1. `cd RTDP_Backend`
2. `npm install`
3. `.env` file is added on github as it does not contain sensitive information.
4. `npm run dev`
*   Server runs on http://localhost:3000

### Frontend
1. `cd RTDP_Frontend`
2. `npm install`
3. `npm run dev`
*   App runs on http://localhost:5173

### Testing the Project
1. Open the Frontend.
2. Click the **"Seed 5k Records"** button. This triggers a backend script to populate MongoDB.
3. Observe the list scrolling smoothly despite containing 5000+ items, demonstrating the effectiveness of `@tanstack/react-virtual`.
4. To test Rate Limiting: Refresh the page rapidly or use a script to hit the API > 10 times in 15 mins.