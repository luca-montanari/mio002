import { Injectable } from '@angular/core';

import { BehaviorSubject, defer, finalize, map, Observable } from 'rxjs';

import { collection, CollectionReference, getDocs, Query, query } from 'firebase/firestore';

import { DbModule } from '../db.module';
import { CollectionInfo } from '../models/shared/collectionsInfos/collection-info';
import collectionInfoConverter from '../models/shared/collectionsInfos/collection-info.converter';
import { InitFirebaseService } from './init-firebase.service';

export const COLLECTION_NAME_COLLECTIONSINFOS = 'collectionsInfos';

@Injectable({
    providedIn: DbModule
})
export class CollectionsInfosService {

    private collectionsInfos = new BehaviorSubject<Map<string, CollectionInfo>>(new Map<string, CollectionInfo>());

    private collectionsInfos$: Observable<Map<string, CollectionInfo>> = this.collectionsInfos.asObservable();

    constructor(private firebase: InitFirebaseService) {
        console.log('@@@', 'CollectionsInfosService', 'constructor');
    }

    // public loadAllCollectionsInfos() {
    //     console.log('@@@', 'CollectionsInfosService', 'loadAllCollectionsInfos');
    //     this.firebase.throwErrorIfNotInitialized();
    //     const queryGetAllDocumentsFromCollection = query(this.getCollectionReference());
    //     return this.getCollectionsInfosFromQuery(queryGetAllDocumentsFromCollection);
    // }    

    public loadAllCollectionsInfos() {
        console.log('@@@', 'CollectionsInfosService', 'loadAllCollectionsInfos');
        this.firebase.throwErrorIfNotInitialized();
        const queryGetAllDocumentsFromCollection = query(this.getCollectionReference());
        this.getCollectionsInfosFromQuery(queryGetAllDocumentsFromCollection).subscribe(this.collectionsInfos);
    }   

    public getCollectionInfo(collectionName: string) : CollectionInfo {
        
        console.log('ppppppppppppp aaa', this.collectionsInfos.value);
        console.log('ppppppppppppp 111', this.allCollectionsInfos);
        console.log('ppppppppppppp 222', collectionName);

        if (!this.allCollectionsInfos.has(collectionName))
        {
            console.log('ppppppppppppp 333');
            throw new Error(`La collection ${collectionName} non è gestita`);
        }
        return this.collectionsInfos.value.get(collectionName)!;
    }

    private get allCollectionsInfos(): Map<string, CollectionInfo> {
        return this.collectionsInfos.value;
    }

    private getCollectionsInfosFromQuery(q: Query<CollectionInfo>): Observable<Map<string, CollectionInfo>> {
        return defer(() => getDocs(q))
            .pipe(                
                map(querySnapshot => {
                    const collectionsInfos: Map<string, CollectionInfo> = new Map<string, CollectionInfo>();
                    querySnapshot.forEach((queryDocumentSnapshot) => {                        
                        collectionsInfos.set(queryDocumentSnapshot.data().collectionName, queryDocumentSnapshot.data());
                    });
                    return collectionsInfos;
                })
            );        
    }

    private getCollectionReference(): CollectionReference<CollectionInfo> {
        return collection(this.firebase.firestore, COLLECTION_NAME_COLLECTIONSINFOS).withConverter(collectionInfoConverter);
    }

}
