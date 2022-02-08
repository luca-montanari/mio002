import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'mio002-docs-home',
    templateUrl: './docs-home.component.html',
    styleUrls: ['./docs-home.component.scss']
})
export class DocsHomeComponent {

    constructor() {
        console.log('@@@', 'DocsHomeComponent', 'constructor');        
    }

}
