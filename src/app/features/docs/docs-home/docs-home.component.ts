import { Component, OnDestroy, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { CollectionsInfosService, COLLECTION_NAME_COLLECTIONSINFOS } from 'src/app/db/services/collections-infos.service';
import { COLLECTION_NAME_DOCS } from 'src/app/db/services/docs.service';
import { InitFirebaseService } from 'src/app/db/services/init-firebase.service';
import { CollectionInfoRuntimeHandler } from 'src/app/db/models/shared/collectionsInfos/collection-info-runtime-handler';

@Component({
    selector: 'mio002-docs-home',
    templateUrl: './docs-home.component.html',
    styleUrls: ['./docs-home.component.scss']
})
export class DocsHomeComponent implements OnInit, OnDestroy {

    /**
     * Collegamento realtime con il CollectionInfo di docs registrato nel database 
     */
    public collectionInfoRuntimeHandler: Observable<CollectionInfoRuntimeHandler | null>;

    /**
     * Costruttore
     * @param collectionsInfosService - servizio per accesso alla collection che gestisce i dati generali di ogni collection
     */
    constructor(private collectionsInfosService: CollectionsInfosService) {
        console.log('@@@', 'DocsHomeComponent', 'constructor');
        // Riferimento all'observable per poter sottoscrivrersi alle modifiche realtime al documento di CollectionInfo della collection COLLECTION_NAME_DOCS
        this.collectionInfoRuntimeHandler = this.collectionsInfosService.getCollectionInfoRuntimeHandlerByCollectionName(COLLECTION_NAME_DOCS).realtimeConnection$;
    }

    /**
     * ngOnInit
     */
    ngOnInit(): void {
        console.log('@@@', 'DocsHomeComponent', 'ngOnInit');
        // Connessione in realtime al documento di CollectionInfo della collection COLLECTION_NAME_DOCS
        this.collectionsInfosService.attachCollectionInfo(COLLECTION_NAME_DOCS);
    }

    /**
     * ngOnDestroy
     */
    ngOnDestroy(): void {
        console.log('@@@', 'DocsHomeComponent', 'ngOnDestroy');
        // Disconnessione del realtime dal documento di CollectionInfo della collection COLLECTION_NAME_DOCS
        this.collectionsInfosService.detachCollectionInfo(COLLECTION_NAME_DOCS);
    }
    
}
