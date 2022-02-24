import { Injectable } from '@angular/core';

import { BehaviorSubject, defer, map, Observable } from 'rxjs';

import { collection, CollectionReference, getDocs, Query, query } from 'firebase/firestore';

import { DbModule } from '../db.module';
import { CollectionInfo } from '../models/shared/collectionsInfos/collection-info';
import collectionInfoConverter from '../models/shared/collectionsInfos/collection-info.converter';
import { InitFirebaseService } from './init-firebase.service';

export const COLLECTIONSINFOS_COLLECTION_NAME = 'collectionsInfos';

@Injectable({
    providedIn: DbModule
})
export class CollectionsInfosService {

    private collectionsInfos = new BehaviorSubject<CollectionInfo[]>([]);

    constructor(private firebase: InitFirebaseService) {
        console.log('@@@', 'CollectionsInfosService', 'constructor');
    }

    loadAllCollectionsInfos() {
        console.log('@@@', 'CollectionsInfosService', 'loadAllCollectionsInfos');
        this.firebase.throwErrorIfNotInitialized();
        const queryGetAllDocumentsFromCollection = query(this.getCollectionReference());
        return this.getCollectionsInfosFromQuery(queryGetAllDocumentsFromCollection);
    }    

    private getCollectionsInfosFromQuery(q: Query<CollectionInfo>): Observable<CollectionInfo[]> {
        return defer(() => getDocs(q))
            .pipe(                
                map(querySnapshot => {
                    const collectionsInfos: CollectionInfo[] = [];
                    querySnapshot.forEach((queryDocumentSnapshot) => {                        
                        collectionsInfos.push(queryDocumentSnapshot.data());
                    });
                    return collectionsInfos;
                })
            );        
    }

    private getCollectionReference(): CollectionReference<CollectionInfo> {
        return collection(this.firebase.firestore, COLLECTIONSINFOS_COLLECTION_NAME).withConverter(collectionInfoConverter);
    }

}
