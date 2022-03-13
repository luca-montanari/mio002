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
    getDoc,
    deleteDoc,
    DocumentSnapshot
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
    
    // #region LifeCycle
    
    /**
     * Costruttore
     */
    constructor(private firebase: InitFirebaseService) {        
        console.log('@@@', 'DocsService', 'constructor');
    }

    // #endregion

    // #region Methods

    // #region Methods Public

    // #region Metodi che eseguono letture dal database

    /**
     * Prepara una query da eseguire sul database per ottenere tutti i documenti presenti nella collection.
     * La query non viene eseguita con la sola chiamata del metodo in quanto viene restituito un observable che il chiamanete dovrà sottoscrivere.
     * @returns restituisce un observable che restituisce l'array con tutti i documenti presenti nella collection
     */
    public getAllDocs(): Observable<Doc[]> {
        console.log('@@@', 'DocsService', 'getAllDocs');
        this.firebase.throwErrorIfNotInitialized();
        const queryExecutor = query(this.getCollectionReference());
        return this.getDocsFromQuery(queryExecutor);
    }

    /**
     * Prepara una query da eseguire sul database.
     * La query non viene eseguita con la sola chiamata del metodo in quanto viene restituito un observable.
     * @param orderByConditions - condizioni di ordinamento da aggiungere alla query
     * @returns restituisce un Observable con array di Doc
     */
    public query(orderByConditions: OrderByCondition[]): Observable<Doc[]> {
        console.log('@@@', 'DocsService', 'query', orderByConditions);
        this.firebase.throwErrorIfNotInitialized();
        const collectionReference = this.getCollectionReference();
        const queryConstraints: QueryConstraint[] = [];
        // Aggiunge le eventuali condizioni di ordinamento passate al metodo
        if (orderByConditions) {
            orderByConditions.forEach(orderByCondition => {
                queryConstraints.push(orderBy(orderByCondition.fieldName, orderByCondition.orderByDirection));
            });
        }
        const queryExecutor = query(collectionReference, ...queryConstraints);
        return this.getDocsFromQuery(queryExecutor);
    }

    /**
     * Dato il riferimento ad un documento restituisce il documento tipizzato.
     * Restituisce un observable quindi il chiamante si deve sottoscrivere.
     * @param documentReference - riferimento al documento richiesto
     * @returns restitituisce un observable che restituisce il documento richiesto tipizzato
     */
    public getDoc(documentReference: DocumentReference<Doc>): Observable<DocumentSnapshot<Doc>> {
        console.log('@@@', 'DocsService', 'getDoc', documentReference);                 
        this.firebase.throwErrorIfNotInitialized();
        return defer(() => getDoc(documentReference));
    }

    /**
     * Ottiene il riferimento ad un documento.
     * Non esegue un interrogazione al database.
     * @param id id del documento di cui ottenere il riferimento
     * @returns restituisce il riferimento al documento
     */
    public getDocReference(id: string): DocumentReference<Doc> {
        console.log('@@@', 'DocsService', 'getDocReference', id);                 
        this.firebase.throwErrorIfNotInitialized();
        return doc(this.firebase.firestore, COLLECTION_NAME_DOCS, id).withConverter(docConverter);        
    }

    // #endregion

    // #region Metodi che eseguono un qualsiasi aggiornamento della collection

    /**
     * Prepara il comando a cui sottoscriversi per creare un nuvo documento e per ottemere un riferimento al documento creato
     * @param docData dati con cui creare il nuovo documento
     * @returns restituisce un observable a cui sottoscriversi per generare il nuovo documento e per ottenere un riferimento al documento creato
     */
    public createNewDoc(docData: Partial<Doc>): Observable<DocumentReference<Doc>> {                
        console.log('@@@', 'DocsService', 'createNewDoc', docData);
        this.firebase.throwErrorIfNotInitialized();
        return defer(() => this.createNewDocPrivate(docData));
    }

    /**
     * Elimina un documento dal database avendo in input il riferimento al documento
     * @param documentReference riferimento al documento da rimuovere dal database
     * @returns restituisce un observable che non ritorna risultati ma che si complta solo quando la cancellazione va a buon fine
     */
    public deleteDoc(documentReference: DocumentReference<unknown>): Observable<void> {
        console.log('@@@', 'DocsService', 'deleteDoc');
        this.firebase.throwErrorIfNotInitialized();
        return defer(() => deleteDoc(documentReference));
    }

    /**
     * Rimuove dal database la lista di documenti passata in input
     * @param documents - lista di tutti i documenti tipizzati da rimuovere
     */
    public deleteDocsByDocuments(documents: Doc[]): Observable<void> {
        console.log('@@@', 'DocsService', 'deleteDocsByDocuments');
        // Verifica che il metodo sia utilizzabile
        this.firebase.throwErrorIfNotInitialized();
        // Esegue l'eliminazione dei documenti
        return from(this.deleteDocsByDocumentsPrivate(documents));
    }

    // #endregion

    // #endregion

    // #region Methods Private

    // #region Metodi che genera eccezioni

    /**
     * Verifica che il numero passato in input non sia superiore al numero di documenti che è possibile modificare in un batch
     */
    private checkMaximunDocumentsForBatch(count: number): void {
        if (count > 500) {
            throw new Error(`Non è possibile eseguire un batch che va a modificare più di 500 documenti (numero di documenti che si vogliono modificare: ${count})`);
        };
        return;
    }

    // #endregion

    // #region Metodi che eseguono letture dal database

    /**
     * Ritorna un observable per eseguire una query sul database e restituire dati tipizzati
     * @param q query costruita per interrogare il database ed ottenere i dati voluti
     * @returns restituisce un observable a cui il chiamante deve sottoscriversi per eseguire effettivamente l'interrogazione al database
     */
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

    // #endregion

    // #region Metodi che eseguono un qualsiasi aggiornamento della collection

    /**
     * Crea un nuovo documento nella collection
     * @param docData dati con cui creare il documento
     * @returns restituisce una promise che permette di ottenere il rifermento al documento
     */
    private async createNewDocPrivate(docData: Partial<Doc>): Promise<DocumentReference<Doc>> {
        console.log('@@@', 'DocsService', 'createNewDocPrivate', docData);
        docData.timestampClientAddDoc = Timestamp.now();
        let newDoc = doc(this.getCollectionReference());
        const batch = writeBatch(this.firebase.firestore);                
        batch.set<Partial<Doc>>(newDoc, docData);        
        batch.update<Partial<Doc>>(newDoc, { timestampServerAddDoc: serverTimestamp() });
        await batch.commit();        
        return newDoc;
    } 

    /**
     * Eliminazione di tutti i documenti 
     * @param documents lista dei documenti tipizzati da eliminare
     * @returns restituite una promise che si risolve solo se il commit va a buon fine
     */
    private async deleteDocsByDocumentsPrivate(documents: Doc[]): Promise<void> {
        console.log('@@@', 'DocsService', 'deleteDocsByDocuments');
        // Verifica che il metodo sia utilizzabile
        this.firebase.throwErrorIfNotInitialized();
        this.checkMaximunDocumentsForBatch(documents.length);
        // Inizializza il batch
        const batch = writeBatch(this.firebase.firestore);                
        // Cicla su tutti i documenti da eliminare
        for (const document of documents) {
            batch.delete(this.getDocReference(document.id));
            throw new Error('dddddddddddddd');
        }        
        // Commit delle cancellazioni
        return await batch.commit();
    }

    // #endregion

    // #region Metodi che gestiscono la tipizzazione dei dati ottenuti o scritti sul database

    /**
     * Ottiene un riferimento alla collection tipizzato
     * @returns restituisce un riferimento alla collection docs tipizzato con il converter
     */
    private getCollectionReference(): CollectionReference<Doc> {
        return collection(this.firebase.firestore, COLLECTION_NAME_DOCS).withConverter(docConverter);
    }

    // #endregion

    // #endregion

    // #endregion
    
}
