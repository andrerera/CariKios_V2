import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Fallback dummy config if the real one isn't provisioned yet
const dummyConfig = {
  apiKey: "dummy",
  authDomain: "dummy.firebaseapp.com",
  projectId: "dummy",
  storageBucket: "dummy.appspot.com",
  messagingSenderId: "000000",
  appId: "000000",
  firestoreDatabaseId: "(default)"
};

let firebaseConfig = dummyConfig;

try {
  // @ts-ignore - this file might not exist yet
  import('../../firebase-applet-config.json').then(config => {
    firebaseConfig = config.default;
  });
} catch (e) {
  console.warn("Firebase config not found, using dummy. Please run setup again.");
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
