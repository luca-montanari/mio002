import { Injectable } from '@angular/core';

import { FirebaseApp, initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator, Firestore } from "firebase/firestore";

import { environment } from 'src/environments/environment';
import { DbModule } from '../db.module';

@Injectable({
    providedIn: DbModule
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
        console.log('@@@', 'InitFirebaseService', 'constructor');        
        this.firebaseApp = initializeApp(environment.firebase);
        // Inizializza Firestore
        this.firestore = getFirestore();
        if (environment.useEmulators) {
            connectFirestoreEmulator(this.firestore, 'localhost', 8080);            
        }               
    }

}
