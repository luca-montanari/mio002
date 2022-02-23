import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { delay, finalize, from, Observable, of, tap } from 'rxjs';

import { InitFirebaseService } from 'src/app/db/services/init-firebase.service';
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
                private loadingService: LoadingService) {
        console.log('@@@', 'HomeComponent', 'constructor');        
        this.loading$.subscribe(aaa => console.log('XXXXXXXX', aaa));
    }
    
    ngOnInit(): void {
        console.log('@@@', 'HomeComponent', 'ngOnInit');
        this.initFirebaseServicePrivate();
    }
        
    public openDocs() {        
        console.log('@@@', 'HomeComponent', 'openDocs');
        this.router.navigate(['/docs']);
    }

    private initFirebaseServicePrivate(): void {
        console.log('@@@', 'HomeComponent', 'initFirebaseServicePrivate');
        // this.loadingService.show('Inizializzazione di Firebase in corso...')
        // // try
        // // {
        // if (!this.initFirebaseService.initialized) {
        //     this.initFirebaseService.initFirebase()
        //         .then(() => {
        //             this.loadingService.hide()
        //         });   
        // }                                
        // // }
        // // finally
        // // {
        // //     this.loadingService.hide();
        // // }
        if (this.initFirebaseService.initialized) {
            return;
        }
        this.loadingService.show('Inizializzazione di Firebase in corso...');
        from(this.initFirebaseService.initFirebase())
            .pipe(
                finalize(() => this.loadingService.hide())
            );
    }

}
