jest.mock('./src/context/AuthContext', () => ({
  useAuth: () => ({
    user: { uid: 'test-user-id', email: 'test@example.com' },
    signInWithApple: jest.fn(),
    signInWithGoogle: jest.fn(),
    logout: jest.fn(),
    isAppleAvailable: true,
    isFirebaseConfigured: true,
    isGoogleSignInAvailable: true,
  }),
}));

jest.mock('expo-auth-session/providers/google', () => ({
  useAuthRequest: jest.fn(() => [null, null, jest.fn()]),
}));

jest.mock('expo-web-browser', () => ({
  maybeCompleteAuthSession: jest.fn(),
}));

jest.mock('./src/config/firebase', () => ({
  db: {},
  auth: {},
  isFirebaseConfigured: false,
}));

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  initializeAuth: jest.fn(),
  getReactNativePersistence: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  addDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  getDocs: jest.fn(() => Promise.resolve({ docs: [] })),
  doc: jest.fn(),
  getDoc: jest.fn(() => Promise.resolve({ exists: () => false })),
  setDoc: jest.fn(() => Promise.resolve()),
  Timestamp: {
    now: jest.fn(() => ({ toDate: () => new Date() })),
  },
}));

jest.mock('expo-apple-authentication', () => ({
  isAvailableAsync: jest.fn(() => Promise.resolve(true)),
  signInAsync: jest.fn(),
  signOutAsync: jest.fn(),
  refreshAsync: jest.fn(),
}));
