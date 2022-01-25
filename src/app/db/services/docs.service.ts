import { Injectable } from '@angular/core';

import { from, map, Observable } from 'rxjs';

import { collection, getDocs } from "firebase/firestore";

import { DbModule } from '../db.module';
import docConverter from '../models/docs/doc.converter';
import { InitFirebaseService } from './init-firebase.service';
import { Doc } from '../models/docs/doc';

export const DOCS_COLLECTION_NAME = 'docs';

@Injectable({
    providedIn: DbModule
})
export class DocsService {
    
    constructor(private firebase: InitFirebaseService) {        
        console.log('DocsService', 'constructor', this.firebase.debug);
        this.firebase.debug = 'DocsService';
    }
    
    getAllDocs(): Observable<Doc[]> {
        const collectionReference = collection(this.firebase.FireStore, DOCS_COLLECTION_NAME).withConverter(docConverter);
        const querySnapshot =  getDocs(collectionReference);
        return from(querySnapshot)
            .pipe(
                map(querySnapshot => {
                    const docs: Doc[] = [];
                    querySnapshot.forEach((queryDocumentSnapshot) => {                        
                        docs.push(queryDocumentSnapshot.data());
                    });
                    return docs;
                })
            );
    }

}
