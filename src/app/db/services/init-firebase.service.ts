import { Injectable } from '@angular/core';

import { FirebaseApp, initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator, Firestore } from "firebase/firestore";

import { LoadingService } from 'src/app/shared/services/loading.service';
import { environment } from 'src/environments/environment';
import { DbModule } from '../db.module';

@Injectable({
    providedIn: DbModule
})
export class InitFirebaseService {

    private _firebaseApp!: FirebaseApp;
    private _firestore!: Firestore;

    constructor(private loadingService: LoadingService) {         
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

    public initFirebase() {
        console.log('@@@', 'InitFirebaseService', 'initFirebase');        
        this.loadingService.show('Inizializzazione di Firebase in corso...')
        try
        {
            this._firebaseApp = initializeApp(environment.firebase);
            // Inizializza Firestore
            this._firestore = getFirestore();
            if (environment.useEmulators) {
                connectFirestoreEmulator(this._firestore, 'localhost', 8080);            
            }                   
            
            await new Promise(f => setTimeout(f, 1000));
            
        }
        finally
        {
            this.loadingService.hide();
        }
    } 

}
