import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private firebaseApp = initializeApp(environment.firebase);
  private db = getFirestore(this.firebaseApp);
  private auth = getAuth(this.firebaseApp);

  constructor() { }

  // ✅ Login
  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  // ✅ Sign Up
  signUp(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  // ✅ Logout
  logout() {
    return signOut(this.auth);
  }

  // ✅ Get Collection Data
  getCollection(collectionName: string) {
    const colRef = collection(this.db, collectionName);
    return getDocs(colRef);
  }

  // ✅ Add or Update Document
  saveData(collectionName: string, id: string, data: any) {
    return setDoc(doc(this.db, collectionName, id), data);
  }

  // ✅ Update Document
  updateData(collectionName: string, id: string, data: any) {
    return updateDoc(doc(this.db, collectionName, id), data);
  }

  // ✅ Delete Data
  deleteData(collectionName: string, id: string) {
    return deleteDoc(doc(this.db, collectionName, id));
  }

}
