import { initializeApp } from 'firebase/app'
// import { getAnalytics } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'
import { collection, addDoc, doc, onSnapshot } from 'firebase/firestore'

import dotenv from 'dotenv'
dotenv.config()

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
}

const WEBSITES_COLLECTION = 'scraped-websites'

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
// const analytics = getAnalytics(app)

export async function addWebsiteToDb(payload: any) {
  try {
    const docRef = await addDoc(collection(db, WEBSITES_COLLECTION), payload)
    console.log('Document written with ID: ', docRef.id)
  } catch (e) {
    console.error('Error adding document: ', e)
  }
}

export async function listenForDataStoreUpdate(
  dataStoreId: string,
  callback: any,
) {
  return onSnapshot(doc(db, WEBSITES_COLLECTION, dataStoreId), callback)
}

export { db, doc, onSnapshot, WEBSITES_COLLECTION }
