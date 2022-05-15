import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyACDms95Ym8NiLzWOuVmXt5qv5U31jO3JU',
  authDomain: 'rai-chat-5f80d.firebaseapp.com',
  databaseURL:
    'https://rai-chat-5f80d-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'rai-chat-5f80d',
  storageBucket: 'rai-chat-5f80d.appspot.com',
  messagingSenderId: '154981871524',
  appId: '1:154981871524:web:16757b1831e1e464eadb31',
  measurementId: 'G-Q804W3HQMC'
}
// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const storage = getStorage(app)

//init services
const auth = getAuth()

export { auth }
