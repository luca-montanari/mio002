import { Injectable } from '@angular/core';

import { BehaviorSubject, defer, map, Observable } from 'rxjs';

import { collection, CollectionReference, doc, DocumentSnapshot, getDocs, onSnapshot, Query, query } from 'firebase/firestore';

import { DbModule } from '../db.module';
import { CollectionInfo } from '../models/shared/collectionsInfos/collection-info';
import collectionInfoConverter from '../models/shared/collectionsInfos/collection-info.converter';
import { InitFirebaseService } from './init-firebase.service';

export const COLLECTION_NAME_COLLECTIONSINFOS = 'collectionsInfos';

@Injectable({
    providedIn: DbModule
})
export class CollectionsInfosService {

    /**
     * Store dei dati delle collection
     */
    private collectionsInfos = new BehaviorSubject<Map<string, CollectionInfo>>(new Map<string, CollectionInfo>());

    private collectionsInfos$: Observable<Map<string, CollectionInfo>> = this.collectionsInfos.asObservable();

    /**
     * Costruttore
     * @param firebase servizio per connessione a firebase
     */
    constructor(private firebase: InitFirebaseService) {
        console.log('@@@', 'CollectionsInfosService', 'constructor');
    }

    /**
     * Caricamento dei dati della collection senza connessione realtime
     * @returns observable per accesso ai dati delle collection
     */
    public loadAllCollectionsInfos(): Observable<Map<string, CollectionInfo>> {
        console.log('@@@', 'CollectionsInfosService', 'loadAllCollectionsInfos');
        this.firebase.throwErrorIfNotInitialized();
        const queryGetAllDocumentsFromCollection: Query<CollectionInfo> = query(this.getCollectionReference());
        const allCollectionsInfos: Observable<Map<string, CollectionInfo>> = this.getCollectionsInfosFromQuery(new Date(), queryGetAllDocumentsFromCollection);
        allCollectionsInfos.subscribe(this.collectionsInfos);
        return allCollectionsInfos;
    }

    /**
     * Caricamento dei dati rimanendo il ascolto in realtime per una collection in particolare
     * @param collectionName nome della collection di cui mettersi in ascolto delle modifiche al documento relativo
     */
    public attachAllCollectionsInfos(collectionName: string) {
        const unsub = onSnapshot(
            doc(this.firebase.firestore, COLLECTION_NAME_COLLECTIONSINFOS, collectionName).withConverter(collectionInfoConverter), 
            { 
                includeMetadataChanges: true 
            }, 
            documentSnapshot => {
                const collectionInfo = documentSnapshot.data();
                const allCollectionsInfos = this.collectionsInfos.value;
                
            }
        );
    }

    /**
     * Restituisce il documento con le info generali della collection con il nome passato in input
     * @param collectionName nome della collection di cui restituire il documento relativo con le info generali di collection
     * @returns ritorna il documento relativo con le info generali di collection 
     */
    public getCollectionInfo(collectionName: string) : CollectionInfo {
        if (!this.allCollectionsInfos.has(collectionName)) {
            throw new Error(`La collection ${collectionName} non è gestita`);
        }
        return this.collectionsInfos.value.get(collectionName)!;
    }

    /**
     * Wrapper per ottenere dallo store direttamente la lista dei documenti in formato Map
     */
    private get allCollectionsInfos(): Map<string, CollectionInfo> {
        return this.collectionsInfos.value;
    }

    /**
     * Restituisce una observable per ottenere tutti i documenti della collection
     * @param q query per ricavari tutti i documenti della collection
     * @returns observable con i documenti di tutte le collection suddivisi per nome collection
     */
    private getCollectionsInfosFromQuery(timeStamp: Date, q: Query<CollectionInfo>): Observable<Map<string, CollectionInfo>> {
        return defer(() => getDocs(q))
            .pipe(                
                map(querySnapshot => {
                    const collectionsInfos: Map<string, CollectionInfo> = new Map<string, CollectionInfo>();
                    querySnapshot.forEach((queryDocumentSnapshot) => {                        
                        const collectionInfo: CollectionInfo = queryDocumentSnapshot.data();
                        collectionInfo.timeStamp = timeStamp;
                        collectionsInfos.set(queryDocumentSnapshot.data().collectionName, queryDocumentSnapshot.data());
                    });
                    return collectionsInfos;
                })
            );        
    }

    /**
     * Imposta il converter per tipizzare i dati letti dal database
     * @returns 
     */
    private getCollectionReference(): CollectionReference<CollectionInfo> {
        return collection(this.firebase.firestore, COLLECTION_NAME_COLLECTIONSINFOS).withConverter(collectionInfoConverter);
    }

}
