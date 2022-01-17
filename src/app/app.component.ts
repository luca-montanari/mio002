import { Component } from '@angular/core';

import { collection, doc, getDoc, getDocs } from 'firebase/firestore';

import { InitFirebaseService } from './db/services/init-firebase.service';

@Component({
    selector: 'mio002-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    constructor(private firebase: InitFirebaseService) {
        console.log('AppComponent', 'constructor');
        this.test();
    }

    async test() {
        console.log('AppComponent', 'test');
        const querySnapshot = await getDocs(collection(this.firebase.FireStore, "docs"));
        querySnapshot.forEach((doc) => {            
            console.log(doc.id, " => ", doc.data());
        });
    }

}
