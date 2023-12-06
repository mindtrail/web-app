import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import {
  collection,
  addDoc,
  doc,
  onSnapshot,
  connectFirestoreEmulator,
} from 'firebase/firestore'

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
}

const WEBSITES_COLLECTION = 'scraped-websites'

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

connectFirestoreEmulator(db, 'localhost', 8080)
// const analytics = getAnalytics(app)

export async function addWebsiteToDb(payload: any) {
  try {
    const docRef = await addDoc(collection(db, WEBSITES_COLLECTION), payload)
    console.log('Document written with ID: ', docRef.id)
  } catch (e) {
    console.error('Error adding document: ', e)
  }
}

export async function listenForCollectionUpdate(
  collectionId: string,
  callback: any,
) {
  return onSnapshot(doc(db, WEBSITES_COLLECTION, collectionId), callback)
}

export { doc, onSnapshot, WEBSITES_COLLECTION }
