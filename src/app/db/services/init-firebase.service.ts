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
        // Inizializza Firestore
        this._firestore = getFirestore();
        if (environment.useEmulators) {
            connectFirestoreEmulator(this._firestore, 'localhost', 8080);            
        }
        console.log('aaa111', new Date());
        await new Promise(f => setTimeout(f, 3000));
        console.log('aaa222', new Date());
        return Promise.resolve();
        // this.SleepForDebug(3000);
    } 

    // private SleepForDebug(ms: number) {
    //     const end = Date.now() + ms
    //     while (Date.now() < end) continue
    // }

}
