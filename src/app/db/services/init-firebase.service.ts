import { Injectable } from '@angular/core';

import { FirebaseApp, initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator, Firestore } from "firebase/firestore";

import { environment } from 'src/environments/environment';
import { DbModule } from '../db.module';

@Injectable({
    providedIn: DbModule
})
export class InitFirebaseService {

    private _firebaseApp!: FirebaseApp;
    private _firestore!: Firestore;

    constructor() {         
        console.log('@@@', 'InitFirebaseService', 'constructor');        
    }

    public get app(): FirebaseApp {
        return this._firebaseApp;
    }

    public get firestore(): Firestore {        
        return this._firestore;
    }

    public get initialized(): boolean {
        return !!this._firebaseApp && !!this._firestore;
    }

    public async initFirebase(): Promise<void> {
        console.log('@@@', 'InitFirebaseService', 'initFirebase');        
        this._firebaseApp = initializeApp(environment.firebase);
        this._firestore = getFirestore();
        if (environment.useEmulators) {
            connectFirestoreEmulator(this._firestore, 'localhost', 8080);            
        }
        await new Promise(f => setTimeout(f, 500));
    }
    
    public throwErrorIfNotInitialized() {
        if (this.initialized) {
            return;
        }
        throw new Error("Accesso a Firebase non inizializzato");
    }

}
