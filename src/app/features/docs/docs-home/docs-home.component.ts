import { Component, OnInit } from '@angular/core';

import { CollectionsInfosService, COLLECTION_NAME_COLLECTIONSINFOS } from 'src/app/db/services/collections-infos.service';
import { InitFirebaseService } from 'src/app/db/services/init-firebase.service';

@Component({
    selector: 'mio002-docs-home',
    templateUrl: './docs-home.component.html',
    styleUrls: ['./docs-home.component.scss']
})
export class DocsHomeComponent implements OnInit {

    /**
     * Costruttore
     * @param collectionsInfosService - servizio per accesso alla collection che gestisce i dati generali di ogni collection
     */
    constructor(private collectionsInfosService: CollectionsInfosService) {
        console.log('@@@', 'DocsHomeComponent', 'constructor');
    }
    
    /**
     * ngOnInit
     */
    ngOnInit(): void {
        console.log('@@@', 'DocsHomeComponent', 'ngOnInit');
        // Aggiorno il CollectionInfo della collection e mi attacco in realtime

        this.collectionsInfosService.attachCollectionInfo();

        //this.collectionsInfosService.attachAllCollectionsInfos(COLLECTION_NAME_COLLECTIONSINFOS);

    }



}
