import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';

import { collection, doc, getDoc, getDocs } from 'firebase/firestore';

import { InitFirebaseService } from './db/services/init-firebase.service';

@Component({
    selector: 'mio002-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

    constructor(private firebase: InitFirebaseService,
                private router: Router) {
        console.log('@@@', 'AppComponent', 'constructor');        
    }
    
    ngAfterViewInit(): void {
        this.router.navigate(['/docs']);
    }

}
