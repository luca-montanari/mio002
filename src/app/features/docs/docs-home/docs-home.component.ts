import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { Doc } from 'src/app/db/models/docs/doc';

import { DocsService } from 'src/app/db/services/docs.service';
import { InitFirebaseService } from 'src/app/db/services/init-firebase.service';

@Component({
    selector: 'mio002-docs-home',
    templateUrl: './docs-home.component.html',
    styleUrls: ['./docs-home.component.scss']
})
export class DocsHomeComponent {

    // allDocs: Observable<Doc[]>;

    constructor(private firebase: InitFirebaseService,
                private docsService: DocsService) {
        console.log('@@@', 'DocsHomeComponent', 'constructor');        
    }

}
