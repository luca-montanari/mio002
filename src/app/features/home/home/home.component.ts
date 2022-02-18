import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { delay, Observable } from 'rxjs';

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
                public loadingService: LoadingService) {
        console.log('@@@', 'HomeComponent', 'constructor');        
    }
    
    ngOnInit(): void {
        console.log('@@@', 'HomeComponent', 'ngOnInit');
        if (!this.initFirebaseService.initialized) {
            this.initFirebaseService.initFirebase();   
        }        
    }
    
    public openDocs() {        
        this.router.navigate(['/docs']);
    }

}
