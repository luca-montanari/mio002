import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { DbModule } from '../db.module';
import { CollectionInfo } from '../models/shared/collectionsInfos/collection-info';
import { InitFirebaseService } from './init-firebase.service';

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
    }    

}
