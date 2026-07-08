# Corporate Asset Management System

A production-ready, secure, and mobile-optimized full-stack asset tracking and inventory management dashboard. Engineered with a highly responsive design, live Firebase synchronization, and real-time CODE-128 barcode generation.

---

## 📱 Visual Concept & Responsive Mobile Design

The user interface has been optimized for high-density information display across both desktop screens and mobile viewports:

*   **Responsive Multi-Mode Layout**: Adapts gracefully from a rich multi-pane desktop view with interactive sidebars to a unified single-screen mobile layout.
*   **Mobile Bottom Navigation Tab Rail**: Seamlessly switch between the **Dashboard** analytics and the interactive **Inventory Registry** using native-feeling bottom navigation bars.
*   **Floating Action Button (FAB)**: Rapidly trigger the Asset Registration modal on smaller touchscreens via an elevated bottom-right action icon.
*   **Responsive Mobile Catalog List**: Automatically switches from high-density tables on desktop to a touch-optimized, card-based infinite list on small screens.
*   **Responsive Filter Sheet Drawer**: Filter controls collapse dynamically into a compact drawer format for clutter-free tracking on smartphones.

---

## 🛠️ Technology Stack

*   **Frontend Library**: [React 19](https://react.dev/) (Functional components, custom hooks, and dynamic context state).
*   **Build System**: [Vite](https://vite.dev/) (Ultra-fast developer server and optimized static asset packaging).
*   **Styling & Theme**: [Tailwind CSS v4](https://tailwindcss.com/) (Sophisticated off-whites, modern indigo accent paths, and deep slate grays).
*   **Icons**: [Lucide React](https://lucide.dev/) (Clean, minimalist stroke vector representations).
*   **Animations**: [Motion](https://motion.dev/) (Smooth entry, card shifts, and toggle actions).
*   **Durable Cloud Storage**: [Firebase Firestore](https://firebase.google.com/docs/firestore) (Persistent live document streams and collection pipelines).
*   **Security & Auth**: [Firebase Authentication](https://firebase.google.com/docs/auth) (Google Company Account SSO + persistent email/password authentication sheets).
*   **Barcode Encoding**: [JsBarcode](https://github.com/lindell/JsBarcode) (Instantly generates clean, vector-rendered CODE-128 linear barcodes on-demand).

---

## ⚙️ Architecture & Technology Decision

### Node.js + React vs. C# / Flutter
This application is strictly configured and optimized to run in a containerized **Node.js/Vite/TypeScript/React** environment behind an Nginx reverse-proxy on **Port 3000**:
*   Vite and Node.js serve as the platform's core runtime.
*   Because the cloud run-container requires a standardized JS/TS ecosystem to perform secure live compilation, standard **C# (ASP.NET)** or **Flutter (Dart)** native deployments are not supported by the hosting platform.
*   To deliver the native feel of a Flutter mobile application, we have implemented custom touch-target gestures, bottom navigation rails, and a single-screen responsive canvas that replicates a high-quality app experience inside any web frame.

---

## 📂 Core Folder Structure

```bash
├── firebase-blueprint.json    # Firestore collection indexes & document templates
├── firestore.rules            # Granular document-level authorization rules
├── index.html                 # Core application mounting node
├── package.json               # System dependencies and run scripts
├── src/
│   ├── App.tsx                # Main coordinate layout, routing, and bottom tabs
│   ├── types.ts               # Shared strict TypeScript interfaces (Asset, Filters)
│   ├── index.css              # Global Tailwind v4 typography and theme definition
│   ├── main.tsx               # Main entry rendering lifecycle
│   ├── components/
│   │   ├── AuthContext.tsx    # Firebase auth state machine & user context
│   │   ├── LoginScreen.tsx    # Responsive secure personnel credentials portal
│   │   ├── DashboardStats.tsx # Analytical metrics, graphs, and value rollups
│   │   ├── BarcodeView.tsx    # Canvas vector encoder for print-ready CODE-128 codes
│   │   ├── AssetFormModal.tsx # Organizational specs and asset metadata editor
│   │   └── AssetDetailModal.tsx # Full asset record sheet with deletion protections
│   └── lib/
│       └── assetService.ts    # Firebase Firestore data queries & CRUD controllers
```

---

## 🚀 Getting Started

To spin up the development environment or run linting verification processes locally:

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Secrets
Ensure a `.env` file exists in the root directory (using `.env.example` as a template):
```env
# Standard Firebase client configuration injected during deployment
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
```

### 3. Run Development Server
Spins up the web preview on the container standard host:
```bash
npm run dev
```

### 4. Code Quality & Type-Check Verification
```bash
npm run lint
```

### 5. Production Build Compilation
```bash
npm run build
```
