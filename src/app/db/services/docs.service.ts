import { Injectable } from '@angular/core';

import { defer, from, map, Observable, of } from 'rxjs';

import { collection, CollectionReference, getDocs, orderBy, Query, query, QueryConstraint, QuerySnapshot } from "firebase/firestore";

import { DbModule } from '../db.module';
import docConverter from '../models/docs/doc.converter';
import { InitFirebaseService } from './init-firebase.service';
import { Doc } from '../models/docs/doc';
import { OrderByCondition } from '../models/shared/orderByCondition';

export const DOCS_COLLECTION_NAME = 'docs';

@Injectable({
    providedIn: DbModule
})
export class DocsService {
    
    constructor(private firebase: InitFirebaseService) {        
        console.log('@@@', 'DocsService', 'constructor', this.firebase.debug);
        this.firebase.debug = 'DocsService';
    }
    
    getAllDocs(): Observable<Doc[]> {
        console.log('@@@', 'DocsService', 'getAllDocs', this.firebase.debug);
        const q = query(this.getCollectionReference());
        return this.getDocsFromQuery(q);
    }

    getDocs(orderByConditions: OrderByCondition[]): Observable<Doc[]> {
        console.log('@@@', 'DocsService', 'getDocs', this.firebase.debug);
        const collectionReference = this.getCollectionReference();
        const queryConstraints: QueryConstraint[] = [];
        if (orderByConditions) {
            orderByConditions.forEach(orderByCondition => {
                queryConstraints.push(orderBy(orderByCondition.fieldName, orderByCondition.orderByDirection));
            });
        }
        const q = query(collectionReference, ...queryConstraints);
        return this.getDocsFromQuery(q);
    }

    private getDocsFromQuery(q: Query<Doc>): Observable<Doc[]> {
        return defer(() => getDocs(q))
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

    private getCollectionReference(): CollectionReference<Doc> {
        return collection(this.firebase.FireStore, DOCS_COLLECTION_NAME).withConverter(docConverter);
    }

}
