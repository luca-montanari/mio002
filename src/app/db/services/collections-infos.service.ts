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

    /**
     * Lista di tutti gli oggetti di gestione dei CollectionInfo di tutte le collection gestire
     */
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
                // Si presume che nel database siano presenti i documenti di CollectionInfo per ogni collection da gestire
                if (!collectionInfo) {
                    throw new Error(`Non è presente nel database il documento CollectionInfo relativo alla Collection ${collectionName}`);
                }
                // Ricava l'oggetto che permette la gestione del CollectionInfo
                const collectionInfoRuntimeHandler: CollectionInfoRuntimeHandler = this.getCollectionInfoRuntimeHandlerByCollectionName(collectionName);
                // Aggiornamento del CollectionInfo
                collectionInfoRuntimeHandler.collectionInfo = collectionInfo;
                // Aggiornamento del timestamp che indica il momento nel quale sul client ho ottenuto il CollectionInfo
                collectionInfoRuntimeHandler.timeStamp = new Date();
                // Emette il CollectionInfo aggiornato
                collectionInfoRuntimeHandler.realtimeConnection.next(collectionInfoRuntimeHandler);              
            }
        );        
    }

    /**
     * Ottenere l'oggetto che permette la gestione del CollectionInfo della collection con il nome passato in input
     * @param collectionName - nome della collection di cui ottenere la gestione del CollectionInfo
     * @returns l'oggetto che permette la gestione del CollectionInfo della collection con il nome passato in input
     */
    public getCollectionInfoRuntimeHandlerByCollectionName(collectionName: string): CollectionInfoRuntimeHandler {
        return this.listOfAllCollectionInfoRuntimeHandler.find(currentCollectionInfoRuntimeHandler => currentCollectionInfoRuntimeHandler.collectionName.toLowerCase() === collectionName.toLowerCase())!;
    }   

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

}
