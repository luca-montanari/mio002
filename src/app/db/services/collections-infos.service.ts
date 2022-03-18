import { Injectable } from '@angular/core';

import { BehaviorSubject, defer, map, Observable, timestamp } from 'rxjs';

import { 
    collection, 
    CollectionReference, 
    doc, 
    DocumentReference, 
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

    // #region Variables

    // #region Variables Private

    /**
     * Lista di tutti gli oggetti di gestione dei CollectionInfo di tutte le collection gestire
     */
    private listOfAllCollectionInfoRuntimeHandler: CollectionInfoRuntimeHandler[] = [];

    // #endregion

    // #endregion

    // #region LifeCycle

    /**
     * Costruttore
     * @param _firebase - servizio per connessione a firebase
     */
    constructor(private _firebase: InitFirebaseService) {
        console.log('@@@', 'CollectionsInfosService', 'constructor');
    }

    // #endregion

    // #region Methods

    // #region Methods Public

    /**
     * Caricamento dei dati della collection senza connessione realtime
     * @returns observable per accesso ai dati delle collection
     */
    public loadAllCollectionsInfos(): Observable<CollectionInfo[]> {
        console.log('@@@', 'CollectionsInfosService', 'loadAllCollectionsInfos');
        // Verifica che il metodo sia utilizzabile
        this._firebase.throwErrorIfNotInitialized();
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
                    collectionName: collectionInfo.id,
                    collectionInfo: collectionInfo,
                    timeStamp: timeStamp,
                    realtimeConnection: realtimeConnection,
                    realtimeConnection$: realtimeConnection.asObservable(),
                    unsubscribeConnection: null
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
            doc(this._firebase.firestore, COLLECTION_NAME_COLLECTIONSINFOS, collectionName).withConverter(collectionInfoConverter), { includeMetadataChanges: true }, 
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
                // Salva un riferimento alla sottoscrizione realtime in modo da poter interrompere il collegamento quando necessario
                collectionInfoRuntimeHandler.unsubscribeConnection = unsubscribe;

            }
        );        
    }

    /**
     * Disconnette la connessione realtime dalla collection con il nome passato in input
     * @param collectionName - nome della collection da cui disconnettersi dal realtime
     * @returns non restituisce nulla
     */
    public detachCollectionInfo(collectionName: string): void {
        console.log('@@@', 'CollectionsInfosService', 'detachCollectionInfo');
        const collectionInfoRuntimeHandler: CollectionInfoRuntimeHandler = this.getCollectionInfoRuntimeHandlerByCollectionName(collectionName);
        if (!collectionInfoRuntimeHandler.unsubscribeConnection) {
            console.log('@@@', 'CollectionsInfosService', 'detachCollectionInfo', 'la collection non risultava collegata in realtime');
            return;
        }
        collectionInfoRuntimeHandler.unsubscribeConnection();
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
     * Restituisce il riferimento tipizzato al documento che rappresenta il collectioninfo relativo alla collection con il nome passato in input
     * @param collectionName nome della collection della quale ottenere il riferimento al relativo collectioninfo
     * @returns riferimento al documento tipizzato del collectioninfo relativo alla collection con il nome passato in input
     */
    public getCollectionInfoReferenceByCollectionName(collectionName: string): DocumentReference<CollectionInfo> {
        return doc(this._firebase.firestore, COLLECTION_NAME_COLLECTIONSINFOS, collectionName).withConverter(collectionInfoConverter);        
    }   

    /**
     * Ottenere una copia della lista completa dei gestori di CollectionInfo di tutte le collection gestite
     * @returns copia della lista completa dei gestori di CollectionInfo di tutte le collection gestite
     */
    public getCopyOfListOfAllCollectionInfoRuntimeHandler(): CollectionInfoRuntimeHandler[] {
        return [ ...this.listOfAllCollectionInfoRuntimeHandler ];
    }

    // #endregion

    // #region Methods Private

    /**
     * Restituisce una observable per ottenere tutti i documenti della collection
     * @param queryExecutor - query per ricavari tutti i documenti della collection
     * @returns - observable con i documenti di tutte le collection suddivisi per nome collection
     */
    private getCollectionsInfosFromQuery(queryExecutor: Query<CollectionInfo>): Observable<CollectionInfo[]> {
        return defer(() => getDocs(queryExecutor))
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
        return collection(this._firebase.firestore, COLLECTION_NAME_COLLECTIONSINFOS).withConverter(collectionInfoConverter);
    }

    // #endregion

    // #endregion

}
