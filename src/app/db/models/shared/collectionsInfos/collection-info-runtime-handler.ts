import { BehaviorSubject, Observable } from "rxjs";

import { Unsubscribe } from "firebase/firestore";

import { CollectionInfo } from "./collection-info";

export interface CollectionInfoRuntimeHandler {
    collectionName: string;
    collectionInfo: CollectionInfo;
    timeStamp: Date;
    realtimeConnection: BehaviorSubject<CollectionInfoRuntimeHandler | null>;
    realtimeConnection$: Observable<CollectionInfoRuntimeHandler | null>;
    unsubscribeConnection: Unsubscribe | null;
}
