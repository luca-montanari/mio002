import { BehaviorSubject } from "rxjs";

import { CollectionInfo } from "./collection-info";

export interface CollectionInfoRuntimeHandler {
    collectionName: string;
    collectionInfo: CollectionInfo;
    timeStamp: Date;
    realtimeConnection?: BehaviorSubject<CollectionInfoRuntimeHandler | null>;
}
