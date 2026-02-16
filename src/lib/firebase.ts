import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { getFunctions, type Functions } from "firebase/functions";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Lazy singletons — only initialized on first access (client-side)
let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;
let _storage: FirebaseStorage | null = null;
let _functions: Functions | null = null;

function getApp(): FirebaseApp {
  if (!_app) {
    _app =
      getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  }
  return _app;
}

export function getFirebaseAuth(): Auth {
  if (!_auth) _auth = getAuth(getApp());
  return _auth;
}

export function getFirebaseDb(): Firestore {
  if (!_db) _db = getFirestore(getApp());
  return _db;
}

export function getFirebaseStorage(): FirebaseStorage {
  if (!_storage) _storage = getStorage(getApp());
  return _storage;
}

export function getFirebaseFunctions(): Functions {
  if (!_functions) _functions = getFunctions(getApp(), "europe-west1");
  return _functions;
}

// Lazy proxy that fully delegates to the real instance (including instanceof checks)
function lazyProxy<T extends object>(factory: () => T): T {
  return new Proxy({} as T, {
    get(_, prop, receiver) {
      const instance = factory();
      const value = Reflect.get(instance, prop, receiver);
      return typeof value === "function" ? value.bind(instance) : value;
    },
    has(_, prop) {
      return Reflect.has(factory(), prop);
    },
    getPrototypeOf() {
      return Reflect.getPrototypeOf(factory());
    },
    ownKeys() {
      return Reflect.ownKeys(factory());
    },
    getOwnPropertyDescriptor(_, prop) {
      return Reflect.getOwnPropertyDescriptor(factory(), prop);
    },
  });
}

// Convenience aliases (lazy — safe for SSR, won't init until called)
export const auth: Auth = lazyProxy(getFirebaseAuth);
export const db: Firestore = lazyProxy(getFirebaseDb);
export const storage: FirebaseStorage = lazyProxy(getFirebaseStorage);
export const functions: Functions = lazyProxy(getFirebaseFunctions);
