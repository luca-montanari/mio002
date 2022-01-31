import { Injectable } from '@angular/core';

import { defer, from, map, Observable, of } from 'rxjs';

import { addDoc, collection, CollectionReference, DocumentReference, getDoc, getDocs, orderBy, Query, query, QueryConstraint, QuerySnapshot } from "firebase/firestore";

import { DbModule } from '../db.module';
import docConverter from '../models/docs/doc.converter';
import { InitFirebaseService } from './init-firebase.service';
import { Doc } from '../models/docs/doc';
import { OrderByCondition } from '../models/shared/orderByCondition';
import { ExternalReference } from '@angular/compiler';

export const DOCS_COLLECTION_NAME = 'docs';

@Injectable({
    providedIn: DbModule
})
export class DocsService {
    
    constructor(private firebase: InitFirebaseService) {        
        console.log('@@@', 'DocsService', 'constructor');
    }
    
    getAllDocs(): Observable<Doc[]> {
        console.log('@@@', 'DocsService', 'getAllDocs');
        const q = query(this.getCollectionReference());
        return this.getDocsFromQuery(q);
    }

    query(orderByConditions: OrderByCondition[]): Observable<Doc[]> {
        console.log('@@@', 'DocsService', 'query', orderByConditions);
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

    addDoc(docData: Partial<Doc>): Observable<DocumentReference<Partial<Doc>>> {
        console.log('@@@', 'DocsService', 'addDoc', docData);        
        return defer(() => addDoc<Partial<Doc>>(this.getCollectionReference(), docData));
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
