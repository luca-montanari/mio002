import { Injectable } from '@angular/core';

import { defer, from, map, Observable, of } from 'rxjs';

import { 
    Timestamp, 
    serverTimestamp, 
    addDoc, 
    collection, 
    CollectionReference, 
    DocumentReference, 
    getDocs, 
    orderBy, 
    Query, 
    query, 
    QueryConstraint,
    updateDoc,
    writeBatch,
    doc,
    getDoc
} from "firebase/firestore";

import { DbModule } from '../db.module';
import docConverter from '../models/docs/doc.converter';
import { InitFirebaseService } from './init-firebase.service';
import { Doc } from '../models/docs/doc';
import { OrderByCondition } from '../models/shared/order-by-condition';

export const COLLECTION_NAME_DOCS = 'docs';

@Injectable({
    providedIn: DbModule
})
export class DocsService {
    
    constructor(private firebase: InitFirebaseService) {        
        console.log('@@@', 'DocsService', 'constructor');
    }
    
    public getAllDocs(): Observable<Doc[]> {
        console.log('@@@', 'DocsService', 'getAllDocs');
        this.firebase.throwErrorIfNotInitialized();
        const q = query(this.getCollectionReference());
        return this.getDocsFromQuery(q);
    }

    public query(orderByConditions: OrderByCondition[]): Observable<Doc[]> {
        console.log('@@@', 'DocsService', 'query', orderByConditions);
        this.firebase.throwErrorIfNotInitialized();
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

    public createNewDoc(docData: Partial<Doc>) {                
        console.log('@@@', 'DocsService', 'createNewDoc', docData);                 
        this.firebase.throwErrorIfNotInitialized();
        return defer(() => this.addDocPrivate(docData));
    }

    public getDoc(doc: DocumentReference<Doc>) {
        console.log('@@@', 'DocsService', 'getDoc', doc);                 
        this.firebase.throwErrorIfNotInitialized();
        return defer(() => getDoc(doc));
    }

    private async addDocPrivate(docData: Partial<Doc>) {
        docData.timestampClientAddDoc = Timestamp.now();
        let newDoc = doc(this.getCollectionReference());
        const batch = writeBatch(this.firebase.firestore);                
        await batch.set<Partial<Doc>>(newDoc, docData);        
        await batch.update<Partial<Doc>>(newDoc, { timestampServerAddDoc: serverTimestamp() });
        await batch.commit();
        return newDoc;
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
        return collection(this.firebase.firestore, COLLECTION_NAME_DOCS).withConverter(docConverter);
    }

}
