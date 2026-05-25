import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyBl5G2FULAIDEIskS4tdmdTwPj6AMLORqI',
  authDomain: 'my-blog-guestbook.firebaseapp.com',
  databaseURL: 'https://my-blog-guestbook-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'my-blog-guestbook',
  storageBucket: 'my-blog-guestbook.firebasestorage.app',
  messagingSenderId: '25113142234',
  appId: '1:25113142234:web:e5b8a05eb110d6281656e3',
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
