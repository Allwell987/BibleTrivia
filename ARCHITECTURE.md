# 🎯 Coin Purchase System - Architecture & Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Bible Trivia App                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐         ┌──────────────┐                  │
│  │  HomeScreen  │◄────────┤  ShopScreen  │                  │
│  │              │ "Shop"  │              │                  │
│  │ • Show coins │ button  │ • Browse     │                  │
│  │ • Nav button │         │ • Purchase   │                  │
│  └──────────────┘         │ • Restore    │                  │
│                            └──────────────┘                  │
│                                  │                           │
│                                  │ purchaseProduct()        │
│                                  ▼                           │
│                            ┌────────────────┐               │
│                            │  purchases.js  │               │
│                            │  (IAP Logic)   │               │
│                            └────────────────┘               │
│                                  │                           │
│       ┌──────────────────────────┼──────────────────┐        │
│       │                          │                  │        │
│       ▼                          ▼                  ▼        │
│  ┌─────────────┐    ┌──────────────────┐  ┌──────────────┐ │
│  │  App Store  │    │  Google Play     │  │ AsyncStorage │ │
│  │  (iOS)      │    │ (Android)        │  │ (Local)      │ │
│  └─────────────┘    └──────────────────┘  └──────────────┘ │
│       │                          │                  │        │
│       └──────────────┬───────────┴──────────────────┘        │
│                      ▼                                        │
│            ┌──────────────────────┐                          │
│            │  ProgressContext     │                          │
│            │ addCoins()           │                          │
│            │ spendCoins()         │                          │
│            └──────────────────────┘                          │
│                      │                                        │
│       ┌──────────────┴──────────────┐                       │
│       ▼                             ▼                       │
│  ┌──────────────┐            ┌──────────────┐             │
│  │ AsyncStorage │            │ Firebase     │             │
│  │ (Persist)    │            │ (Cloud Sync) │             │
│  └──────────────┘            └──────────────┘             │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow: Purchase Process

```
User taps "Buy" on 1200 coins @ $2.99
        │
        ▼
ShopScreen shows loading spinner
        │
        ▼
purchaseProduct("com.iguruapp.bibletrivia.coins_1200")
        │
        ├─── Initialize IAP connection
        │
        ├─── Call native requestPurchase()
        │    │
        │    └─── Shows native payment UI
        │         (Apple Pay / Google Play Billing)
        │
        ├─── User enters payment info & confirms
        │
        ├─── Receipt returned to app
        │
        ├─── Validate receipt locally
        │
        ├─── Store purchase record in AsyncStorage
        │    {
        │      productId: "...coins_1200",
        │      coins: 1200,
        │      purchaseTime: "2026-03-31T10:30:45Z",
        │      transactionId: "abc123..."
        │    }
        │
        ├─── Call addCoins(1200)
        │    │
        │    ├─── Update ProgressContext.coins
        │    │
        │    ├─── Save to AsyncStorage
        │    │
        │    └─── Sync to Firebase
        │
        ├─── Show success alert
        │    "Purchase Successful! +1200 coins"
        │
        └─── Update HomeScreen balance immediately
```

## Data Flow: Restore Purchases

```
User taps "Restore Purchases"
        │
        ▼
restorePurchases()
        │
        ├─── Query previous purchases
        │    (from device payment history)
        │
        ├─── Filter for applicable products
        │
        ├─── For each purchase:
        │    ├─ Acknowledge receipt (Android)
        │    └─ Calculate coins total
        │
        ├─── Sum all coins from purchases
        │
        ├─── Add coins to account via addCoins()
        │
        ├─── Sync to Firebase
        │
        ├─── Show confirmation alert
        │    "X coins restored from Y purchases"
        │
        └─── Update HomeScreen balance
```

## Component Hierarchy

```
App.js
├── SafeAreaProvider
│   └── AuthProvider
│       └── ThemeProvider
│           └── ProgressProvider
│               └── NavigationContainer
│                   └── Stack.Navigator
│                       ├── HomeScreen
│                       │   └── Shop Button → ShopScreen
│                       ├── ShopScreen ⭐ NEW
│                       │   ├── Balance Card
│                       │   ├── Coin Packages (4x)
│                       │   │   └── TouchableOpacity → Purchase
│                       │   ├── Info Box
│                       │   └── Restore Button
│                       ├── QuizScreen
│                       ├── Settings
│                       └── ...other screens
```

## State Management Flow

```
┌─────────────────────────────────────────────────────┐
│           ProgressContext                           │
├─────────────────────────────────────────────────────┤
│                                                      │
│  State:                   Functions:                │
│  ├─ progress             ├─ updateProgress()       │
│  │  ├─ coins        ◄────┼─ addCoins() ◄─── Shop  │
│  │  ├─ scores            ├─ spendCoins() ◄─ Quiz  │
│  │  └─ unlocked          └─ earnCoins()           │
│  │                                                  │
│  └─ loading          Syncs with:                   │
│                      ├─ AsyncStorage (local)       │
│                      └─ Firebase (cloud)           │
│                                                     │
└─────────────────────────────────────────────────────┘
         │
         ├─ Persisted in AsyncStorage
         │  Key: "bible_trivia_progress"
         │  {
         │    coins: 1200,
         │    easyHighScore: 85,
         │    ...
         │  }
         │
         └─ Synced to Firebase
            Collection: users
            Document: [user.uid]
            Field: progress { coins: 1200, ... }
```

## File Dependencies

```
ShopScreen.js
├── imports: ProgressContext (useProgress)
├── imports: purchases.js
│   ├── react-native-purchases
│   ├── AsyncStorage
│   └── Platform
├── imports: analytics.js
└── imports: ThemeContext

purchases.js
├── react-native-purchases (external)
├── AsyncStorage
├── Platform
└── (no internal deps)

ProgressContext.js
├── AsyncStorage
├── Firebase
├── AuthContext
└── (modified: added addCoins export)

App.js
├── imports: purchases.js → initializePurchases()
├── imports: ShopScreen
└── (modified: added Shop route)

HomeScreen.js
└── (modified: added Shop button)
```

## Purchase States

```
Initial State
    ↓
┌─────────────────────────────────┐
│ IDLE (waiting for user action)  │
└─────────────────────────────────┘
    ↓ (User taps Buy)
┌─────────────────────────────────┐
│ LOADING (native UI opens)       │
└─────────────────────────────────┘
    ↓
    ├─ (User confirms)     ├─ (User cancels)
    ▼                       ▼
┌──────────────────┐   ┌──────────────────┐
│ PROCESSING       │   │ CANCELLED        │
│ (verify receipt) │   │ (alert shown)    │
└──────────────────┘   └──────────────────┘
    ↓                       ↓
    ├─ (Success)       ├─ Back to IDLE
    │                  │
    ▼                  ▼
┌──────────────────┐  
│ SUCCESS          │  
│ • Add coins      │  
│ • Update balance │  
│ • Show alert     │  
│ • Sync data      │  
└──────────────────┘
    ↓
┌──────────────────┐
│ Back to IDLE     │
└──────────────────┘
```

## Error Handling Flow

```
purchaseProduct() throws error
        │
        ├─ Network Error
        │  └─→ "Check your connection"
        │
        ├─ Product Not Found
        │  └─→ "Product unavailable"
        │
        ├─ User Cancelled
        │  └─→ (silently return to shop)
        │
        ├─ Payment Failed
        │  └─→ "Payment declined, try another method"
        │
        ├─ Receipt Invalid
        │  └─→ "Transaction failed, please retry"
        │
        └─ Unknown Error
           └─→ "An error occurred, please try again"

All errors:
├─ Logged to console
├─ Tracked in analytics
├─ Shown to user
└─ No coins added
```

## Coin Balance Update Flow

```
Initial Balance: 200 coins
        ↓
User purchases coins
        ↓
ProgressContext.addCoins(1200)
        ↓
┌─────────────────────────┐
│ Update local state      │ 
│ coins: 200 → 1400      │
└─────────────────────────┘
        ↓
┌─────────────────────────┐
│ Save to AsyncStorage    │
│ (immediate, local)      │
└─────────────────────────┘
        ↓
┌─────────────────────────┐
│ Sync to Firebase        │
│ (async, cloud)          │
└─────────────────────────┘
        ↓
┌─────────────────────────┐
│ Update HomeScreen       │
│ (context listener)      │
└─────────────────────────┘
        ↓
Coin balance displays 1400 ✅
```

## Offline Behavior

```
Purchase attempted offline
        ↓
Network error thrown
        ↓
Show error to user
        ↓
Coins NOT added
        ↓
User gets online
        ↓
User retries from Shop
        ↓
Purchase succeeds
        ↓
Coins added
        ↓
Data synced to Firebase
```

## Multi-Device Sync

```
Device A (iPhone)
├─ Purchase 500 coins
├─ coins = 700
└─ Sync to Firebase

Firebase Cloud
├─ users/[uid]/progress
└─ coins: 700

Device B (Android)
├─ App opens
├─ Check cloud for updates
├─ Fetch from Firebase
├─ coins: 700
└─ Update local AsyncStorage
```

---

**This architecture ensures:**
- ✅ Reliable purchases
- ✅ Offline-first capabilities
- ✅ Multi-device sync
- ✅ Error recovery
- ✅ Data persistence