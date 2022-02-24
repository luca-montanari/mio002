import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { concat, concatMap, concatWith, defer, delay, finalize, from, map, Observable, of, tap } from 'rxjs';

import { InitFirebaseService } from 'src/app/db/services/init-firebase.service';
import { CollectionsInfosService } from 'src/app/db/services/collections-infos.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { LoadingData } from 'src/app/shared/services/models/loadingData';

const loadingText1: string = 'Inizializzazione dell\'accesso al database...';

@Component({
  selector: 'mio002-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    public loading$: Observable<LoadingData> = this.loadingService.loading$;
    
    constructor(private router: Router,
                private initFirebaseService: InitFirebaseService,
                private collectionsInfosService: CollectionsInfosService,
                private loadingService: LoadingService) {
        console.log('@@@', 'HomeComponent', 'constructor');        
        this.loading$.subscribe(aaa => console.log('XXXXXXXX', aaa));
    }
    
    ngOnInit(): void {
        console.log('@@@', 'HomeComponent', 'ngOnInit');
        this.initDbPrivate();
    }
        
    public openDocs() {        
        console.log('@@@', 'HomeComponent', 'openDocs');
        this.router.navigate(['/docs']);
    }

    private initDbPrivate() {
        console.log('@@@', 'HomeComponent', 'initDb');
        if (this.initFirebaseService.initialized) {
            return;
        }                
        concat(
            this.initFirebaseServicePrivate(),
            this.initCollectionsInfosServicePrivate()
        )   
        .subscribe(allCollectionsInfos => {
            console.log('aaaaaaaaaaaaaa', allCollectionsInfos)
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

        // .subscribe(() => {
        //      console.log('@@@', 'HomeComponent', 'initFirebaseServicePrivate', 'Inizializzazione di Firebase completata');
        // });

        // concat(
        //     from(this.initFirebaseService.initFirebase()),
        //     this.collectionsInfosService.loadAllCollectionsInfos()
        //         .pipe(
        //             tap(xxx => this.loadingService.show('Inizializzazione dati delle Collection...')),
        //             delay(2000),
        //         )
        // )
        // .subscribe(allCollectionsInfos => {
        //     console.log('aaaaaaaaaaaaaa', allCollectionsInfos)
        // });

        // this.loadingService.show('Inizializzazione di Firebase in corso...');
        // from(this.initFirebaseService.initFirebase())
        //     .pipe(
        //         concatMap(() => {
        //             this.loadingService.show('Inizializzazione dati delle Collection...');        
        //             return this.collectionsInfosService.loadAllCollectionsInfos()
        //                 .pipe(
        //                     delay(2000),
        //                     finalize(() => this.loadingService.hide())
        //                 )
        //         })
        //     )
        //     .subscribe(allCollectionsInfos => {
        //         console.log('aaaaaaaaaaaaaa', allCollectionsInfos)
        //     });

    }

    private initCollectionsInfosServicePrivate() {
        console.log('@@@', 'HomeComponent', 'initCollectionsInfosServicePrivate');
        return defer(
                () => {
                    this.loadingService.show('Inizializzazione dati delle Collection...');
                    return this.collectionsInfosService.loadAllCollectionsInfos()
                        .pipe(
                            delay(2000),
                        )
            })
            .pipe(
                finalize(() => this.loadingService.hide())
            );
    }

}
