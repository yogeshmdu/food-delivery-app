# Fresh to Home - Madurai Mertal Meats

A complete full-stack meat ordering ecosystem featuring:
1. **React Native Mobile App (`mobile/`)**: Native iOS & Android application ready for deployment to the **Apple App Store** and **Google Play Store**.
2. **Shop Admin Web Panel (`frontend/`)**: Shop owner live order management Kanban board with audio alert and stock/pricing control.
3. **Backend REST API (`backend/`)**: High-performance, zero-dependency Node.js REST API.

---

## 📁 Repository Structure

```
fresh-meat/
├── backend/                      # Node.js REST API Server
│   ├── server.js                 # Backend entry point
│   └── src/
│       ├── app.js                # Server setup & request router
│       ├── config/index.js       # Ports, paths & environment variables
│       ├── middleware/           # Auth, body parser, static file server
│       ├── models/database.js    # File-backed JSON database & CRUD
│       ├── routes/               # Menu, orders, and admin endpoints
│       └── utils/                # Sanitizer & response helpers
│
├── mobile/                       # 📱 React Native (Expo) Mobile App for iOS & Android
│   ├── App.js                    # Root navigator & safe area layout
│   ├── app.json                  # App Store bundleId & Play Store package config
│   ├── eas.json                  # EAS Build profiles for App Store & Play Store
│   ├── babel.config.js           # Babel preset configuration
│   ├── package.json              # React Native dependencies & scripts
│   ├── assets/                   # App icon, adaptive icon, splash screen
│   └── src/
│       ├── api/client.js         # API client with auto-host detection
│       ├── constants/theme.js    # Design system tokens, colors, elevation
│       ├── context/AppContext.js # Cart, profile, and order state with AsyncStorage
│       ├── components/           # Header, ProductCard, CategoryPill, BillSummary,
│       │                         # FloatingCartBar, BottomNav, Stepper
│       └── screens/              # HomeScreen, CategoryScreen, CartScreen,
│                                 # CheckoutScreen, TrackScreen, OrdersScreen, ProfileScreen
│
├── frontend/                     # 🖥️ Shop Owner Web Dashboard
│   ├── admin.html                # Live Kanban orders & inventory editor
│   ├── index.html                # Web PWA version
│   ├── css/                      # Modular styling (variables, admin, customer)
│   └── js/                       # Admin & Customer client services
│
├── data/
│   └── db.json                   # In-memory persistent JSON database
├── package.json                  # Root npm scripts
├── README.md                     # Documentation
└── server.js                     # Root launcher
```

---

## 🚀 Step 1: Start the Backend Server

The backend REST API serves both the mobile app and the shop admin panel:

```bash
npm start
```
- **Backend API**: `http://localhost:3000/api/menu`
- **Shop Admin Panel**: [http://localhost:3000/admin](http://localhost:3000/admin) (Admin key: `admin123`)

---

## 📱 Step 2: Run the React Native Mobile App

Open a new terminal in the `mobile` folder:

```bash
cd mobile
npm install
```

### Start Development Server:
```bash
npm start
```
* **Run on iOS Simulator**: Press `i` (macOS with Xcode)
* **Run on Android Emulator**: Press `a` (Android Studio)
* **Run on Physical Phone**: Scan the QR code with the **Expo Go** app (available on App Store and Google Play).

---

## 🏪 Step 3: Deploy to Apple App Store & Google Play Store

The `mobile/` project is pre-configured with `app.json` and `eas.json` for **Expo Application Services (EAS)**:

### 1. Install EAS CLI:
```bash
npm install -g eas-cli
```

### 2. Login to your Expo account:
```bash
eas login
```

### 3. Build for Google Play Store (Android):
Generates an **Android App Bundle (.aab)** ready for the Google Play Console:
```bash
cd mobile
eas build -p android --profile production
```

### 4. Build for Apple App Store (iOS):
Generates an **iOS Archive (.ipa)** ready for App Store Connect / TestFlight:
```bash
cd mobile
eas build -p ios --profile production
```

### 5. Automated Store Submission:
```bash
eas submit -p android
eas submit -p ios
```

---

## ⚙️ Configuration

* **Android Package Name**: `com.maduraimertalmeats.app` (configured in `mobile/app.json`)
* **iOS Bundle Identifier**: `com.maduraimertalmeats.app` (configured in `mobile/app.json`)
* **Backend Server URL**: Change the server URL anytime in `mobile/src/api/client.js` or directly inside the app under **Profile → ⚙️ Backend Server URL**.
