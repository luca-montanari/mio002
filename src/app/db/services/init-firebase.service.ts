import { Injectable } from '@angular/core';

import { FirebaseApp, initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator, Firestore } from "firebase/firestore";

import { DateTime } from 'luxon';

import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class InitFirebaseService {

    private firebaseApp: FirebaseApp;
    private firestore: Firestore;

    public get App() {
        return this.firebaseApp;
    }

    public get FireStore() {
        return this.firestore;
    }

    constructor() {         
        console.log('InitFirebaseService', 'constructor', 'inizio firebaseApp', DateTime.now());
        this.firebaseApp = initializeApp(environment.firebase);
        console.log('InitFirebaseService', 'constructor', 'fine firebaseApp', DateTime.now());
        console.log('InitFirebaseService', 'constructor', 'inizio firestore', DateTime.now());
        this.firestore = getFirestore();
        if (environment.useEmulators) {
            connectFirestoreEmulator(this.firestore, 'localhost', 8080);            
        }                
        console.log('InitFirebaseService', 'constructor', 'fine firestore', DateTime.now());
    }

}
