import { Component } from '@angular/core';

import { doc, getDoc } from 'firebase/firestore';

import { InitFirebaseService } from './db/services/init-firebase.service';

@Component({
    selector: 'mio002-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    constructor(private firebase: InitFirebaseService) {
        this.test();
    }

    async test() {
        const docRef = doc(this.firebase.FireStore, "cities", "SF");
        const docSnap = await getDoc(docRef);
        console.log(docSnap);
    }
    
}
