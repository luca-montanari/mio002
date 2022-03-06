import { Counter } from "./counter";

export interface CollectionInfo {
    collectionName: string;
    counters: Counter[];
    timeStamp: Date;    
}
