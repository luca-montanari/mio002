import { Injectable } from '@angular/core';

import { BehaviorSubject, defer, map, Observable, timestamp } from 'rxjs';

import { 
    collection, 
    CollectionReference, 
    doc, 
    getDocs, 
    onSnapshot, 
    Query, 
    query, 
    Unsubscribe 
} from 'firebase/firestore';

import { DbModule } from '../db.module';
import { CollectionInfo } from '../models/shared/collectionsInfos/collection-info';
import collectionInfoConverter from '../models/shared/collectionsInfos/collection-info.converter';
import { InitFirebaseService } from './init-firebase.service';
import { Counter } from '../models/shared/collectionsInfos/counter';
import { CollectionInfoRuntimeHandler } from '../models/shared/collectionsInfos/collection-info-runtime-handler';

export const COLLECTION_NAME_COLLECTIONSINFOS = 'collectionsInfos';

@Injectable({
    providedIn: DbModule
})
export class CollectionsInfosService {

    // private collectionsInfos = new BehaviorSubject<Map<string, CollectionInfo>>(new Map<string, CollectionInfo>());
    // private collectionsInfos$: Observable<Map<string, CollectionInfo>> = this.collectionsInfos.asObservable();
    // private listOfAllCollectionsInfosByCollectionName: Map<string, CollectionInfo> = new Map<string, CollectionInfo>();
    private listOfAllCollectionInfoRuntimeHandler: CollectionInfoRuntimeHandler[] = [];

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
    public loadAllCollectionsInfos(): Observable<CollectionInfo[]> {
        console.log('@@@', 'CollectionsInfosService', 'loadAllCollectionsInfos');
        this.firebase.throwErrorIfNotInitialized();
        // Creo un observable sulla query che mi restituisce tutti i dati della collection
        const queryGetAllDocumentsFromCollection: Query<CollectionInfo> = query(this.getCollectionReference());
        const allCollectionsInfos: Observable<CollectionInfo[]> = this.getCollectionsInfosFromQuery(queryGetAllDocumentsFromCollection);
        // Sottoscrivo la collection per salvarmi nel servizio la lista dei documenti caricati
        allCollectionsInfos.subscribe(allDocumentsExistings => {
            console.log('@@@', 'CollectionsInfosService', 'loadAllCollectionsInfos', 'subscribe', allDocumentsExistings);
            const timeStamp: Date = new Date();
            allDocumentsExistings.forEach(collectionInfo => {
                const realtimeConnection: BehaviorSubject<CollectionInfoRuntimeHandler | null> = new BehaviorSubject<CollectionInfoRuntimeHandler | null>(null);
                const collectionInfoRuntimeHandler: CollectionInfoRuntimeHandler = {
                    collectionName: collectionInfo.collectionName,
                    collectionInfo: collectionInfo,
                    timeStamp: timeStamp,
                    realtimeConnection: realtimeConnection,
                    realtimeConnection$: realtimeConnection.asObservable()
                }
                this.listOfAllCollectionInfoRuntimeHandler.push(collectionInfoRuntimeHandler);
            });            
        });
        return allCollectionsInfos;
    }

    /**
     * Caricamento dei dati rimanendo il ascolto in realtime per una collection in particolare
     * @param collectionName - nome della collection di cui mettersi in ascolto delle modifiche al documento relativo
     */
    public attachCollectionInfo(collectionName: string) {
        console.log('@@@', 'CollectionsInfosService', 'attachAllCollectionsInfos');
        const unsubscribe: Unsubscribe = onSnapshot(
            doc(this.firebase.firestore, COLLECTION_NAME_COLLECTIONSINFOS, collectionName).withConverter(collectionInfoConverter), { includeMetadataChanges: true }, 
            documentSnapshot => {
                console.log('@@@', 'CollectionsInfosService', 'attachAllCollectionsInfos', 'onSnapshot');
                // Dato restituito dal database e tipizzato
                let collectionInfo = documentSnapshot.data();

                if (!collectionInfo) {
                    throw new Error(`Non è presente nel database il documento CollectionInfo relativo alla Collection ${collectionName}`);
                }

                const collectionInfoRuntimeHandler: CollectionInfoRuntimeHandler = this.getCollectionInfoRuntimeHandlerByCollectionName(collectionName);

                collectionInfoRuntimeHandler.collectionInfo = collectionInfo;
                collectionInfoRuntimeHandler.timeStamp = new Date();

                collectionInfoRuntimeHandler.realtimeConnection.next(collectionInfoRuntimeHandler);

                // // Per la collection con il nome passato in input esiste già un CollectionInfo sul database?
                // if (!collectionInfo) {
                //     // ... NO quindi ne inizializzo uno nuovo
                //     console.log('@@@', 'CollectionsInfosService', 'attachAllCollectionsInfos', 'onSnapshot', 'collectionInfo non presente su db');
                //     collectionInfo = this.getCollectionInfoNew(collectionName);
                // }
                
                // let collectionInfoRuntimeHandler: CollectionInfoRuntimeHandler | null = this.getCollectionInfoRuntimeHandlerByCollectionName(collectionName);
                // let realtimeConnection: BehaviorSubject<CollectionInfoRuntimeHandler | null>;
                // if (this.isCollectionInfoStoredByCollectionName(collectionName)) {
                //      collectionInfoRuntimeHandler = {
                //         collectionName: collectionName,
                //         collectionInfo: collectionInfo,
                //         timeStamp: new Date()            
                //     };
                //     this.listOfAllCollectionInfoRuntimeHandler.push(collectionInfoRuntimeHandler);
                //     realtimeConnection = new BehaviorSubject<CollectionInfoRuntimeHandler | null>(null);                    
                //     collectionInfoRuntimeHandler.realtimeConnection = realtimeConnection;
                // } else {
                //     collectionInfoRuntimeHandler!.collectionInfo = collectionInfo;
                //     if (!(collectionInfoRuntimeHandler!.realtimeConnection)) {
                //         realtimeConnection = new BehaviorSubject<CollectionInfoRuntimeHandler | null>(null);
                //         collectionInfoRuntimeHandler!.realtimeConnection = realtimeConnection;
                //     } else {
                //         realtimeConnection = collectionInfoRuntimeHandler!.realtimeConnection;
                //     }
                // }                
                // realtimeConnection.next(collectionInfoRuntimeHandler);

            }
        );        
    }

    public getCollectionInfoRuntimeHandlerByCollectionName(collectionName: string): CollectionInfoRuntimeHandler {
        return this.listOfAllCollectionInfoRuntimeHandler.find(currentCollectionInfoRuntimeHandler => currentCollectionInfoRuntimeHandler.collectionName.toLowerCase() === collectionName.toLowerCase())!;
    }

    // private isCollectionInfoStoredByCollectionName(collectionName: string): boolean {
    //     const collectionInfoRuntimeHandler: CollectionInfoRuntimeHandler | undefined = this.listOfAllCollectionInfoRuntimeHandler.find(currentCollectionInfoRuntimeHandler => currentCollectionInfoRuntimeHandler.collectionName.toLowerCase() === collectionName.toLowerCase());
    //     return !!collectionInfoRuntimeHandler;
    // }

    // private getCollectionInfoByCollectionNameSafe(collectionName: string): CollectionInfo | null {
    //     const collectionInfoRuntimeHandler: CollectionInfoRuntimeHandler | undefined = this.listOfAllCollectionInfoRuntimeHandler.find(currentCollectionInfoRuntimeHandler => currentCollectionInfoRuntimeHandler.collectionName.toLowerCase() === collectionName.toLowerCase());
    //     if (collectionInfoRuntimeHandler) {
    //         return collectionInfoRuntimeHandler.collectionInfo;
    //     } else {
    //         return null;
    //     }        
    // }

    // private getCollectionInfoRuntimeHandlerByCollectionNameSafe(collectionName: string): CollectionInfoRuntimeHandler | null {        
    //     const collectionInfoRuntimeHandler: CollectionInfoRuntimeHandler | undefined = this.listOfAllCollectionInfoRuntimeHandler.find(currentCollectionInfoRuntimeHandler => currentCollectionInfoRuntimeHandler.collectionName.toLowerCase() === collectionName.toLowerCase());
    //     if (collectionInfoRuntimeHandler) {
    //         return collectionInfoRuntimeHandler;
    //     } else {
    //         return null;
    //     }        
    // }

    // /**
    //  * Restituisce il documento con le info generali della collection con il nome passato in input
    //  * @param collectionName - nome della collection di cui restituire il documento relativo con le info generali di collection
    //  * @returns ritorna il documento relativo con le info generali di collection 
    //  */
    // public getCollectionInfo(collectionName: string) : CollectionInfo {
    //     console.log('@@@', 'CollectionsInfosService', 'getCollectionInfo', collectionName);
    //     if (!this.allCollectionsInfos.has(collectionName)) {
    //         throw new Error(`La collection ${collectionName} non è gestita`);
    //     }
    //     return this.collectionsInfos.value.get(collectionName)!;
    // }

    // /**
    //  * Wrapper per ottenere dallo store direttamente la lista dei documenti in formato Map
    //  */
    // private get allCollectionsInfos(): Map<string, CollectionInfo> {
    //     return this.collectionsInfos.value;
    // }

    /**
     * Restituisce una observable per ottenere tutti i documenti della collection
     * @param q - query per ricavari tutti i documenti della collection
     * @returns - observable con i documenti di tutte le collection suddivisi per nome collection
     */
    private getCollectionsInfosFromQuery(q: Query<CollectionInfo>): Observable<CollectionInfo[]> {
        return defer(() => getDocs(q))
            .pipe(                
                map(querySnapshot => {
                    const collectionsInfos: CollectionInfo[] = [];
                    querySnapshot.forEach((queryDocumentSnapshot) => {                        
                        const collectionInfo: CollectionInfo = queryDocumentSnapshot.data();
                        collectionsInfos.push(collectionInfo);
                    });
                    return collectionsInfos;
                })
            );        
    }

    /**
     * Imposta il converter per tipizzare i dati letti dal database
     * @returns riferimento alla collection con impostato il converter per tipizzare i dati restituiti dal database
     */
    private getCollectionReference(): CollectionReference<CollectionInfo> {
        return collection(this.firebase.firestore, COLLECTION_NAME_COLLECTIONSINFOS).withConverter(collectionInfoConverter);
    }

    // /**
    //  * Crea un documento di info vuoto se la collection con il nome passato in input non ne aveva uno già salvato sul database
    //  * @param collectionName - nome della collection del quale creare il documento di info
    //  * @returns restituisce il documento di info vuoto creato
    //  */
    // private getCollectionInfoNew(collectionName: string): CollectionInfo {
    //     const counter: Counter = {
    //         name: 'count',
    //         value: 0
    //     };
    //     const counters: Counter[] = [];
    //     counters.push(counter);
    //     const collectionInfoNew: CollectionInfo = {
    //         collectionName: collectionName,
    //         counters
    //     };
    //     return collectionInfoNew;
    // }

}
