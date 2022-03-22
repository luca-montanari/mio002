import { BehaviorSubject, Observable } from "rxjs";

import { Unsubscribe } from "firebase/firestore";

import { CollectionInfo } from "./collection-info";

/**
 * Gestione del documento di CollectionInfo di una collection.
 * Contiene i dati di gestione come i contatori.
 * Documento al quale un componente si può connettere in realtime per ricevere gli aggiornamenti.
 */
export interface CollectionInfoRuntimeHandler {
    /**
     * Nome della collection di cui il documento rappresenta le info generali
     */
    collectionName: string;
    /**
     * Dati di gestione della collection
     */
    collectionInfo: CollectionInfo;
    /**
     * Copia dei dati di gesitone della collection all'ultima lettura dal server
     */
    collectionInfoClient: CollectionInfo;
    /**
     * Data di ultima lettura dal server
     */
    timeStamp: Date;
    /**
     * Per connessione realtime alle modifiche del documento relativo ad una collection
     */
    realtimeConnection: BehaviorSubject<CollectionInfoRuntimeHandler | null>;
    /**
     * Per connessione realtime alle modifiche del documento relativo ad una collection
     */
    realtimeConnection$: Observable<CollectionInfoRuntimeHandler | null>;
    /**
     * Per connessione realtime alle modifiche del documento relativo ad una collection
     */
    unsubscribeConnection: Unsubscribe | null;
}
