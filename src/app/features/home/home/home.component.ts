import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { concat, defer, delay, finalize, from, map, Observable } from 'rxjs';

import { InitFirebaseService } from 'src/app/db/services/init-firebase.service';
import { CollectionsInfosService } from 'src/app/db/services/collections-infos.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { LoadingData } from 'src/app/shared/services/models/loadingData';
import { CollectionInfo } from 'src/app/db/models/shared/collectionsInfos/collection-info';
import { DocsService } from 'src/app/db/services/docs.service';

@Component({
  selector: 'mio002-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    public loading$: Observable<LoadingData> = this.loadingService.loading$;

    // #region Component LifeCycle

    /**
     * Costruttore
     */
    constructor(private router: Router,
                private initFirebaseService: InitFirebaseService,
                private collectionsInfosService: CollectionsInfosService,
                private loadingService: LoadingService) {
        console.log('@@@', 'HomeComponent', 'constructor');                
    }
    
    /**
     * ngOnInit
     */
    ngOnInit(): void {
        console.log('@@@', 'HomeComponent', 'ngOnInit');
        // Inizializzazione dell'accesso a Firebase.
        // Inizializzazione dell'accesso a Firestore.
        // Legge tutti i CollectionInfo per ogni collection da gestire, questi documenti contengono i dati relativi alla gestione di ogni collection.
        this.initDbPrivate();
    }
     
    // #endregion

    public openDocs() {        
        console.log('@@@', 'HomeComponent', 'openDocs');
        this.router.navigate(['/docs']);
    }

    private initDbPrivate() {
        console.log('@@@', 'HomeComponent', 'initDbPrivate');
        if (this.initFirebaseService.initialized) {
            console.log('@@@', 'HomeComponent', 'initDbPrivate', 'connessione al database gi?? eseguita', this.collectionsInfosService.getCopyOfListOfAllCollectionInfoRuntimeHandler());
            return;
        }                
        concat(
            this.initFirebaseServicePrivate(),
            this.initCollectionsInfosServicePrivate()
        )   
        .subscribe(firebaseInitializedOrAllCollectionsInfos => {
            console.log('@@@', 'HomeComponent', 'initDbPrivate', 'subscribe');
            if (typeof firebaseInitializedOrAllCollectionsInfos == 'boolean') {
                console.log('@@@', 'HomeComponent', 'initDbPrivate', 'subscribe', 'firebase inizializzato');
            } else {
                console.log('@@@', 'HomeComponent', 'initDbPrivate', 'subscribe', 'dati delle collection caricati', firebaseInitializedOrAllCollectionsInfos);
            }
        });
    }

    private initFirebaseServicePrivate(): Observable<boolean> {
        console.log('@@@', 'HomeComponent', 'initFirebaseServicePrivate');
        return defer(
                () => {
                    this.loadingService.show('Inizializzazione di Firebase in corso...');
                    return from(this.initFirebaseService.initFirebase());
                })
                .pipe(
                    map(() => true),
                    finalize(() => this.loadingService.hide())
                );     
    }

    private initCollectionsInfosServicePrivate() {
        console.log('@@@', 'HomeComponent', 'initCollectionsInfosServicePrivate');
        return defer(
                () => {
                    this.loadingService.show('Inizializzazione dati delle Collection...');
                    return this.collectionsInfosService.loadAllCollectionsInfos()
                        .pipe(
                            delay(500),
                        )
                })
                .pipe(
                    finalize(() => this.loadingService.hide())
                );
    }

}
