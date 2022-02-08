import { Injectable } from '@angular/core';

import { DbModule } from '../db.module';
import { InitFirebaseService } from './init-firebase.service';

@Injectable({
    providedIn: DbModule
})
export class CollectionsInfosService {

    constructor(private firebase: InitFirebaseService) {
        console.log('@@@', 'CollectionsInfosService', 'constructor');
    }

    loadAllCollectionsInfos() {
        console.log('@@@', 'CollectionsInfosService', 'loadAllCollectionsInfos');
    }    

}
